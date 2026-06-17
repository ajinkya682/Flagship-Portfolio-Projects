import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHireLetter extends Document {
  applicationId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  companyName: string;
  companyDetails?: string;
  role: string;
  startDate: Date;
  salary: number;
  currency: string;
  letterContent: string;
  aiGenerated: boolean;
  status: 'draft' | 'sent' | 'signed' | 'rejected';
  sentAt?: Date;
  signedAt?: Date;
  signatureData?: string; // candidate typed name as digital signature
  createdAt: Date;
  updatedAt: Date;
}

const HireLetterSchema: Schema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    companyName: { type: String, required: true },
    companyDetails: { type: String },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    salary: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    letterContent: { type: String, required: true },
    aiGenerated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed', 'rejected'],
      default: 'draft',
    },
    sentAt: { type: Date },
    signedAt: { type: Date },
    signatureData: { type: String },
  },
  { timestamps: true }
);

export const HireLetter: Model<IHireLetter> =
  mongoose.models.HireLetter ||
  mongoose.model<IHireLetter>('HireLetter', HireLetterSchema);
