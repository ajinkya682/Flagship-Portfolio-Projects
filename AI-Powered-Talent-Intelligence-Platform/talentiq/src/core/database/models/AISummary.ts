import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICrossMatch {
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  originalJobId: mongoose.Types.ObjectId;
  originalJobTitle: string;
  matchedJobId: mongoose.Types.ObjectId;
  matchedJobTitle: string;
  matchScore: number;
  matchedSkills: string[];
}

export interface IInsight {
  id: string;
  category: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  actionText: string;
}

export interface IAISummary extends Document {
  companyId: mongoose.Types.ObjectId;
  insights: IInsight[];
  weekOf: Date; // Monday of the week
  generatedAt: Date;
  content: string; // Markdown/text summary from AI
  pipelineHealth: number; // 0-100 score
  pipelineHealthBreakdown: {
    stage: string;
    avgDaysInStage: number;
    conversionRate: number;
  }[];
  crossMatches: ICrossMatch[];
  totalCandidates: number;
  totalHired: number;
  totalOffersAccepted: number;
  avgAiScore: number;
}

const CrossMatchSchema = new Schema({
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate' },
  candidateName: String,
  originalJobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  originalJobTitle: String,
  matchedJobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  matchedJobTitle: String,
  matchScore: Number,
  matchedSkills: [String],
}, { _id: false });

const PipelineStageBreakdownSchema = new Schema({
  stage: String,
  avgDaysInStage: Number,
  conversionRate: Number,
}, { _id: false });

const InsightSchema = new Schema({
  id: String,
  category: String,
  type: String,
  title: String,
  description: String,
  actionText: String,
}, { _id: false });

const AISummarySchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    weekOf: { type: Date, required: true },
    generatedAt: { type: Date, default: Date.now },
    content: { type: String, required: true },
    pipelineHealth: { type: Number, default: 0 },
    pipelineHealthBreakdown: { type: [PipelineStageBreakdownSchema], default: [] },
    crossMatches: { type: [CrossMatchSchema], default: [] },
    totalCandidates: { type: Number, default: 0 },
    totalHired: { type: Number, default: 0 },
    totalOffersAccepted: { type: Number, default: 0 },
    avgAiScore: { type: Number, default: 0 },
    insights: { type: [InsightSchema], default: [] },
  },
  { timestamps: true }
);

AISummarySchema.index({ companyId: 1, weekOf: 1 }, { unique: true });

export const AISummary: Model<IAISummary> =
  mongoose.models.AISummary ||
  mongoose.model<IAISummary>('AISummary', AISummarySchema);
