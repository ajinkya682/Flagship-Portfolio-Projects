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
  recruiterNotes: Array<{
    id: string;
    author: string;
    avatar: string;
    text: string;
    createdAt: string;
  }>;
  tags: string[];
  assignedTo?: mongoose.Types.ObjectId;
  daysInStage: number;
  timeline: Array<{
    event: string;
    date: Date;
    type: 'stage_change' | 'offer' | 'offer_accepted' | 'offer_declined' | 'assignment' | 'hired' | 'message' | 'note';
  }>;
  assignmentId?: mongoose.Types.ObjectId;
  hireLetterIds: mongoose.Types.ObjectId[];
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

const NoteSchema = new Schema({
  id: String,
  author: String,
  avatar: String,
  text: String,
  createdAt: String
}, { _id: false });

const ApplicationSchema: Schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  stage: { type: String, default: 'applied' },
  aiScore: { type: AIScoreSchema },
  appliedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'career_page' },
  recruiterNotes: { type: [NoteSchema], default: [] },
  tags: { type: [String], default: [] },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  daysInStage: { type: Number, default: 0 },
  timeline: {
    type: [
      {
        event: { type: String, required: true },
        date: { type: Date, default: Date.now },
        type: {
          type: String,
          enum: ['stage_change', 'offer', 'offer_accepted', 'offer_declined', 'assignment', 'hired', 'message', 'note'],
          default: 'stage_change',
        },
      },
    ],
    default: [],
  },
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment' },
  hireLetterIds: { type: [Schema.Types.ObjectId], ref: 'HireLetter', default: [] },
}, { timestamps: true });

export const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
