import mongoose, { Schema } from 'mongoose';
const complaintSchema = new Schema({
    complaintId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    imageMetadata: {
        type: Object,
        default: {},
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    category: {
        type: String,
        trim: true,
        default: null,
    },
    issueType: {
        type: String,
        trim: true,
        default: 'General',
    },
    severity: {
        type: String,
        trim: true,
        default: null,
    },
    department: {
        type: String,
        trim: true,
        default: null,
    },
    summary: {
        type: String,
        trim: true,
        default: null,
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: null,
    },
    suggestedActions: {
        type: [String],
        default: null,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    address: {
        type: String,
        trim: true,
    },
    responsibleAuthority: {
        type: String,
        trim: true,
        default: 'Municipal Corporation',
    },
    ward: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Escalated'],
        default: 'Pending',
    },
    aiAnalysis: {
        type: Object,
        default: null,
    },
    resolvedAt: {
        type: Date,
    },
    escalationLevel: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
complaintSchema.pre('validate', function (next) {
    if (!this.complaintId) {
        this.complaintId = `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    }
    next();
});
const Complaint = mongoose.models.Complaint ||
    mongoose.model('Complaint', complaintSchema);
export default Complaint;
//# sourceMappingURL=complaint.js.map