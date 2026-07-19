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
  issueType?: string;
  severity?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  responsibleAuthority?: string;
  ward?: string;
  status?: ComplaintStatus;
  aiAnalysis?: Record<string, unknown>;
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
    issueType: {
      type: String,
      trim: true,
      default: 'General',
    },
    severity: {
      type: String,
      trim: true,
      default: 'Medium',
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
      default: {},
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
