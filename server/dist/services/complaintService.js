import mongoose from 'mongoose';
import Complaint from '../models/complaint.js';
class ComplaintService {
    buildComplaintRecord(input) {
        return {
            _id: new mongoose.Types.ObjectId().toString(),
            complaintId: input.complaintId || `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            ...input,
            category: input.category ?? null,
            severity: input.severity ?? null,
            department: input.department ?? null,
            summary: input.summary ?? null,
            confidence: input.confidence ?? null,
            suggestedActions: input.suggestedActions ?? null,
            status: input.status || 'Pending',
            aiAnalysis: input.aiAnalysis ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    async createInMemoryComplaint(input) {
        const complaint = this.buildComplaintRecord(input);
        ComplaintService.inMemoryComplaints.unshift(complaint);
        return complaint;
    }
    isDatabaseAvailable() {
        return mongoose.connection.readyState === 1;
    }
    async createComplaint(input) {
        if (!this.isDatabaseAvailable()) {
            return this.createInMemoryComplaint(input);
        }
        try {
            return await Complaint.create(input);
        }
        catch (error) {
            if (error instanceof Error && /buffering timed out|MongoServerSelectionError|ECONN|ENOTFOUND/i.test(error.message)) {
                return this.createInMemoryComplaint(input);
            }
            throw error;
        }
    }
    async getComplaints() {
        if (!this.isDatabaseAvailable()) {
            return ComplaintService.inMemoryComplaints.sort((a, b) => {
                const aTime = new Date(a.createdAt).getTime();
                const bTime = new Date(b.createdAt).getTime();
                return bTime - aTime;
            });
        }
        return Complaint.find().sort({ createdAt: -1 }).lean();
    }
    async getComplaintById(id) {
        if (!this.isDatabaseAvailable()) {
            return ComplaintService.inMemoryComplaints.find((complaint) => complaint._id === id) || null;
        }
        return Complaint.findById(id).lean();
    }
    async updateComplaintStatus(id, status) {
        if (!this.isDatabaseAvailable()) {
            const complaint = ComplaintService.inMemoryComplaints.find((item) => item._id === id);
            if (!complaint) {
                return null;
            }
            const updated = {
                ...complaint,
                status,
                updatedAt: new Date(),
                resolvedAt: status === 'Resolved' ? new Date() : undefined,
            };
            ComplaintService.inMemoryComplaints = ComplaintService.inMemoryComplaints.map((item) => (item._id === id ? updated : item));
            return updated;
        }
        const complaint = await Complaint.findByIdAndUpdate(id, {
            status,
            resolvedAt: status === 'Resolved' ? new Date() : undefined,
        }, { new: true });
        return complaint;
    }
    async updateComplaintEscalation(id, status, escalationLevel) {
        if (!this.isDatabaseAvailable()) {
            const complaint = ComplaintService.inMemoryComplaints.find((item) => item._id === id);
            if (!complaint) {
                return null;
            }
            const updated = {
                ...complaint,
                status,
                escalationLevel,
                updatedAt: new Date(),
                resolvedAt: status === 'Resolved' ? new Date() : undefined,
            };
            ComplaintService.inMemoryComplaints = ComplaintService.inMemoryComplaints.map((item) => (item._id === id ? updated : item));
            return updated;
        }
        const complaint = await Complaint.findByIdAndUpdate(id, {
            status,
            escalationLevel,
            resolvedAt: status === 'Resolved' ? new Date() : undefined,
        }, { new: true });
        return complaint;
    }
}
ComplaintService.inMemoryComplaints = [];
export default new ComplaintService();
//# sourceMappingURL=complaintService.js.map