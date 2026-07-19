import mongoose, { Schema, Document } from 'mongoose';

export type ComplaintStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'
  | 'Escalated';

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

const complaintSchema = new Schema<ComplaintDocument>(
  {
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
  },
  {
    timestamps: true,
  }
);

complaintSchema.pre('validate', function (next) {
  if (!this.complaintId) {
    this.complaintId = `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
  next();
});

const Complaint =
  (mongoose.models.Complaint as mongoose.Model<ComplaintDocument>) ||
  mongoose.model<ComplaintDocument>('Complaint', complaintSchema);

export default Complaint;
