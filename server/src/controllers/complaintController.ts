import { Request, Response } from 'express';
import complaintService from '../services/complaintService.js';
import routingService from '../services/routingService.js';
import { uploadImageToCloudinary } from '../services/imageUploadService.js';
import { createComplaintSchema, updateComplaintStatusSchema } from '../schemas/complaintSchema.js';

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

    const routingDecision = routingService.routeComplaint({
      issueType: parsed.data.issueType,
      category: parsed.data.issueType,
      severity: parsed.data.severity,
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
      issueType: parsed.data.issueType || 'General',
      severity: parsed.data.severity || 'Medium',
      address: parsed.data.address,
      ward: parsed.data.ward,
      responsibleAuthority: routingDecision.responsibleAuthority,
      status: 'Pending',
      aiAnalysis: {
        source: 'demo',
        inferredIssueType: parsed.data.issueType || 'General',
        routing: routingDecision,
      },
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
