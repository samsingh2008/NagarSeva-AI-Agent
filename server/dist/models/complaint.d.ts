import mongoose, { Document } from 'mongoose';
export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected' | 'Escalated';
export interface ComplaintInput {
    complaintId?: string;
    imageUrl?: string;
    imageMetadata?: {
        name?: string;
        mimeType?: string;
        size?: number;
        uploadedAt?: Date;
    };
    description?: string;
    category?: string | null;
    issueType?: string;
    severity?: string | null;
    department?: string | null;
    summary?: string | null;
    confidence?: number | null;
    suggestedActions?: string[] | null;
    latitude?: number;
    longitude?: number;
    address?: string;
    responsibleAuthority?: string;
    ward?: string;
    status?: ComplaintStatus;
    aiAnalysis?: Record<string, unknown> | null;
    resolvedAt?: Date;
    escalationLevel?: number;
}
export interface ComplaintDocument extends Document, ComplaintInput {
    createdAt: Date;
    updatedAt: Date;
}
declare const Complaint: mongoose.Model<ComplaintDocument, {}, {}, {}, mongoose.Document<unknown, {}, ComplaintDocument, {}, {}> & ComplaintDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Complaint;
//# sourceMappingURL=complaint.d.ts.map