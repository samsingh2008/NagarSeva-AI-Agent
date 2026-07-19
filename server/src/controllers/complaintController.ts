import { Request, Response } from 'express';
import complaintService from '../services/complaintService.js';
import routingService from '../services/routingService.js';
import { uploadImageToCloudinary } from '../services/imageUploadService.js';
import { createComplaintSchema, updateComplaintStatusSchema } from '../schemas/complaintSchema.js';
import { evaluateEscalation, buildSafetyHeatmap } from '../services/analyticsService.js';
import { recommendSaferRoute } from '../services/routeSafetyService.js';
import { buildDashboardSummary } from '../services/dashboardService.js';
import { analyzeComplaint } from '../services/aiAnalysisService.js';
import { analyzeComplaintWithGemini } from '../services/geminiService.js';

const sendSuccess = (res: Response, statusCode: number, data: unknown, message: string) => {
  res.status(statusCode).json({ success: true, data, message });
};

const sendError = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ success: false, message });
};

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const file = req.file;

    const parsed = createComplaintSchema.safeParse(payload);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid complaint payload';
      return sendError(res, 400, message);
    }

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await uploadImageToCloudinary(file.buffer, file.originalname);
    }

    const fallbackAnalysis = analyzeComplaint({
      description: parsed.data.description,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      issueType: parsed.data.issueType,
      severity: parsed.data.severity,
    });
    const geminiAnalysis = await analyzeComplaintWithGemini({
      description: parsed.data.description,
      image: file
        ? {
            buffer: file.buffer,
            mimeType: file.mimetype,
          }
        : undefined,
    });
    const issueType = geminiAnalysis?.category || fallbackAnalysis.inferredIssueType;
    const routingSeverity = geminiAnalysis?.severity || fallbackAnalysis.severity;

    const routingDecision = routingService.routeComplaint({
      issueType,
      category: geminiAnalysis?.category || issueType,
      severity: routingSeverity,
      ward: parsed.data.ward,
      location: {
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
      },
    });

    const complaint = await complaintService.createComplaint({
      description: parsed.data.description,
      imageUrl,
      imageMetadata: {
        name: file?.originalname,
        mimeType: file?.mimetype,
        size: file?.size,
        uploadedAt: new Date(),
      },
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      category: geminiAnalysis?.category ?? null,
      issueType,
      severity: geminiAnalysis?.severity ?? null,
      department: geminiAnalysis?.department ?? null,
      summary: geminiAnalysis?.summary ?? null,
      confidence: geminiAnalysis?.confidence ?? null,
      suggestedActions: geminiAnalysis?.suggestedActions ?? null,
      address: parsed.data.address,
      ward: parsed.data.ward,
      responsibleAuthority: geminiAnalysis?.department || routingDecision.responsibleAuthority,
      status: 'Pending',
      aiAnalysis: geminiAnalysis,
      escalationLevel: routingDecision.escalationLevel,
    });

    return sendSuccess(res, 201, complaint, 'Complaint created successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create complaint';
    return sendError(res, 500, message);
  }
};

export const getComplaints = async (_req: Request, res: Response) => {
  try {
    const complaints = await complaintService.getComplaints();
    return sendSuccess(res, 200, complaints, 'Complaints fetched successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch complaints';
    return sendError(res, 500, message);
  }
};

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);

    if (!complaint) {
      return sendError(res, 404, 'Complaint not found');
    }

    return sendSuccess(res, 200, complaint, 'Complaint fetched successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch complaint';
    return sendError(res, 500, message);
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const parsed = updateComplaintStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid status payload';
      return sendError(res, 400, message);
    }

    const complaint = await complaintService.updateComplaintStatus(req.params.id, parsed.data.status);

    if (!complaint) {
      return sendError(res, 404, 'Complaint not found');
    }

    return sendSuccess(res, 200, complaint, 'Complaint status updated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update complaint status';
    return sendError(res, 500, message);
  }
};

export const checkEscalation = async (req: Request, res: Response) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);

    if (!complaint) {
      return sendError(res, 404, 'Complaint not found');
    }

    const result = evaluateEscalation(complaint as Record<string, unknown>);
    const updatedComplaint = await complaintService.updateComplaintEscalation(
      req.params.id,
      result.updatedComplaint.status as string,
      result.updatedComplaint.escalationLevel as number
    );

    if (!updatedComplaint) {
      return sendError(res, 404, 'Complaint not found');
    }

    const responseComplaint = {
      ...updatedComplaint,
      escalationLevel: result.updatedComplaint.escalationLevel,
    };

    return sendSuccess(res, 200, responseComplaint, result.shouldEscalate ? 'Complaint escalated successfully' : 'No escalation required');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check escalation';
    return sendError(res, 500, message);
  }
};

export const getSafetyHeatmap = async (_req: Request, res: Response) => {
  try {
    const complaints = await complaintService.getComplaints();
    const heatmap = buildSafetyHeatmap(complaints as Record<string, unknown>[]);
    return sendSuccess(res, 200, heatmap, 'Safety heatmap fetched successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch safety heatmap';
    return sendError(res, 500, message);
  }
};

export const getRouteRecommendation = async (req: Request, res: Response) => {
  try {
    const { origin, destination, time } = req.body || {};

    if (!origin || !destination || typeof time !== 'string') {
      return sendError(res, 400, 'Origin, destination, and time are required');
    }

    const complaints = await complaintService.getComplaints();
    const heatmap = buildSafetyHeatmap(complaints as Record<string, unknown>[]);
    const recommendation = recommendSaferRoute(
      {
        origin: { latitude: Number(origin.latitude), longitude: Number(origin.longitude) },
        destination: { latitude: Number(destination.latitude), longitude: Number(destination.longitude) },
        time,
      },
      heatmap
    );

    return sendSuccess(res, 200, recommendation, 'Route recommendation generated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate route recommendation';
    return sendError(res, 500, message);
  }
};

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const complaints = await complaintService.getComplaints();
    const summary = buildDashboardSummary(complaints as Array<Record<string, unknown>>);
    return sendSuccess(res, 200, summary, 'Dashboard summary fetched successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard summary';
    return sendError(res, 500, message);
  }
};
