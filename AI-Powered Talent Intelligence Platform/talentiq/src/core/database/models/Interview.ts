import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInterview extends Document {
  application: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  locationType: 'video' | 'phone' | 'onsite';
  meetingLink?: string;
  interviewers: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'completed' | 'cancelled';
  scorecards: mongoose.Types.ObjectId[];
}

const InterviewSchema: Schema = new Schema({
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  locationType: { type: String, enum: ['video', 'phone', 'onsite'], default: 'video' },
  meetingLink: { type: String },
  interviewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  scorecards: [{ type: Schema.Types.ObjectId, ref: 'Scorecard' }]
}, { timestamps: true });

export const Interview: Model<IInterview> = mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
