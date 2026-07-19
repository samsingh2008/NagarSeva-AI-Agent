export interface ComplaintAIAnalysis {
  category: string;
  severity: string;
  department: string;
  summary: string;
  confidence: number;
  suggestedActions: string[];
}

export interface ComplaintRecord {
  _id?: string;
  complaintId?: string;
  description?: string;
  status?: string;
  responsibleAuthority?: string;
  escalationLevel?: number;
  category?: string | null;
  severity?: string | null;
  department?: string | null;
  summary?: string | null;
  confidence?: number | null;
  suggestedActions?: string[] | null;
  aiAnalysis?: Partial<ComplaintAIAnalysis> | null;
}

export interface ComplaintApiResponse {
  success: boolean;
  data?: ComplaintRecord;
  message?: string;
}

export const getComplaintAIAnalysis = (complaint?: ComplaintRecord | null): Partial<ComplaintAIAnalysis> | null => {
  if (!complaint) {
    return null;
  }

  const nestedAnalysis = complaint.aiAnalysis || {};

  return {
    category: complaint.category ?? nestedAnalysis.category,
    severity: complaint.severity ?? nestedAnalysis.severity,
    department: complaint.department ?? nestedAnalysis.department,
    summary: complaint.summary ?? nestedAnalysis.summary,
    confidence: complaint.confidence ?? nestedAnalysis.confidence,
    suggestedActions: complaint.suggestedActions ?? nestedAnalysis.suggestedActions,
  };
};
