import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIScore {
  score: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordsMatch: number;
  strengths: string[];
  gaps: string[];
  reasons: Array<{ text: string; positive: boolean }>;
  scoredAt: Date;
}

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  stage: string;
  aiScore?: IAIScore;
  appliedAt: Date;
  source: string;
  recruiterNotes: string[];
  tags: string[];
  assignedTo?: mongoose.Types.ObjectId;
  daysInStage: number;
}

const AIScoreSchema = new Schema({
  score: { type: Number, required: true },
  skillsMatch: { type: Number, required: true },
  experienceMatch: { type: Number, required: true },
  educationMatch: { type: Number, required: true },
  keywordsMatch: { type: Number, required: true },
  strengths: { type: [String], default: [] },
  gaps: { type: [String], default: [] },
  reasons: [{ text: String, positive: Boolean }],
  scoredAt: { type: Date, default: Date.now }
}, { _id: false });

const ApplicationSchema: Schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  stage: { type: String, default: 'applied' },
  aiScore: { type: AIScoreSchema },
  appliedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'career_page' },
  recruiterNotes: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  daysInStage: { type: Number, default: 0 }
}, { timestamps: true });

export const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
