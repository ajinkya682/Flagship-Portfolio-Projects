import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  applicationId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  referenceLink?: string;
  submissionLink?: string;
  submissionText?: string;
  submittedAt?: Date;
  status: 'pending' | 'submitted' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    referenceLink: { type: String },
    submissionLink: { type: String },
    submissionText: { type: String },
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'reviewed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Assignment: Model<IAssignment> =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>('Assignment', AssignmentSchema);
