import mongoose from 'mongoose';
import { ComplaintInput } from '../models/complaint.js';
declare class ComplaintService {
    private static inMemoryComplaints;
    private buildComplaintRecord;
    private createInMemoryComplaint;
    private isDatabaseAvailable;
    createComplaint(input: ComplaintInput): Promise<(mongoose.Document<unknown, {}, import("../models/complaint.js").ComplaintDocument, {}, {}> & import("../models/complaint.js").ComplaintDocument & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        category: string | null;
        severity: string | null;
        department: string | null;
        summary: string | null;
        confidence: number | null;
        suggestedActions: string[] | null;
        status: import("../models/complaint.js").ComplaintStatus;
        aiAnalysis: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
        complaintId: string;
        imageUrl?: string;
        imageMetadata?: {
            name?: string;
            mimeType?: string;
            size?: number;
            uploadedAt?: Date;
        };
        description?: string;
        issueType?: string;
        latitude?: number;
        longitude?: number;
        address?: string;
        responsibleAuthority?: string;
        ward?: string;
        resolvedAt?: Date;
        escalationLevel?: number;
        _id: string;
    }>;
    getComplaints(): Promise<Record<string, unknown>[] | (mongoose.FlattenMaps<import("../models/complaint.js").ComplaintDocument> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getComplaintById(id: string): Promise<Record<string, unknown> | (mongoose.FlattenMaps<import("../models/complaint.js").ComplaintDocument> & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateComplaintStatus(id: string, status: string): Promise<(mongoose.Document<unknown, {}, import("../models/complaint.js").ComplaintDocument, {}, {}> & import("../models/complaint.js").ComplaintDocument & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        status: string;
        updatedAt: Date;
        resolvedAt: Date | undefined;
    } | null>;
    updateComplaintEscalation(id: string, status: string, escalationLevel: number): Promise<(mongoose.Document<unknown, {}, import("../models/complaint.js").ComplaintDocument, {}, {}> & import("../models/complaint.js").ComplaintDocument & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        status: string;
        escalationLevel: number;
        updatedAt: Date;
        resolvedAt: Date | undefined;
    } | null>;
}
declare const _default: ComplaintService;
export default _default;
//# sourceMappingURL=complaintService.d.ts.map