import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInterview extends Document {
  companyId: mongoose.Types.ObjectId;
  application: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  locationType: 'video' | 'phone' | 'onsite';
  meetingLink?: string;
  roomId?: string; // WebRTC Unique Room ID
  interviewers: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'waiting' | 'live' | 'completed' | 'cancelled';
  scorecards: mongoose.Types.ObjectId[];
  startedAt?: Date;
  endedAt?: Date;
  notes: Array<{
    authorId: mongoose.Types.ObjectId;
    text: string;
    timestamp: Date;
  }>;
}

const InterviewSchema: Schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  locationType: { type: String, enum: ['video', 'phone', 'onsite'], default: 'video' },
  meetingLink: { type: String },
  roomId: { type: String },
  interviewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'waiting', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  scorecards: [{ type: Schema.Types.ObjectId, ref: 'Scorecard' }],
  startedAt: { type: Date },
  endedAt: { type: Date },
  notes: {
    type: [{
      authorId: { type: Schema.Types.ObjectId, ref: 'User' },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }],
    default: []
  }
}, { timestamps: true });

export const Interview: Model<IInterview> = mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema);
