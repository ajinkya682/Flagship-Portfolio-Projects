import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScorecardCriterion {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export interface IScorecard extends Document {
  companyId: mongoose.Types.ObjectId;
  interview: mongoose.Types.ObjectId;
  interviewer: mongoose.Types.ObjectId;
  overallRating: 'strong-yes' | 'yes' | 'no' | 'strong-no';
  criteria: IScorecardCriterion[];
  notes: string;
  submittedAt: Date;
}

const ScorecardSchema: Schema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  interview: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  interviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  overallRating: { type: String, enum: ['strong-yes', 'yes', 'no', 'strong-no'], required: true },
  criteria: [{
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  }],
  notes: { type: String },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Scorecard: Model<IScorecard> = mongoose.models.Scorecard || mongoose.model<IScorecard>('Scorecard', ScorecardSchema);
