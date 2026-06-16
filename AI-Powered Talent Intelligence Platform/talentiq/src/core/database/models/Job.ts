import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  remoteType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  requirements: string[];
  skills: string[];
  niceToHaveSkills: string[];
  status: 'draft' | 'active' | 'paused' | 'closed' | 'published';
  applicantCount: number;
  publishedAt?: Date;
  closedAt?: Date;
  scoringWeights: {
    skills: number;
    experience: number;
    education: number;
  };
  slug?: string;
  applicationFormConfig?: {
    requireFullName?: boolean;
    requireMobileNumber?: boolean;
    requireDate?: boolean;
    requireLinkedin?: boolean;
    requireGithub?: boolean;
    requirePortfolio?: boolean;
    requireResume?: boolean;
    requirePassportPhoto?: boolean;
    requireSignature?: boolean;
    customQuestions?: string[];
  };
  company: mongoose.Types.ObjectId;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String },
  employmentType: { type: String, default: 'Full-time' },
  remoteType: { type: String, default: 'On-site' },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  currency: { type: String, default: 'USD' },
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  niceToHaveSkills: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'active', 'paused', 'closed', 'published'], default: 'draft' },
  applicantCount: { type: Number, default: 0 },
  publishedAt: { type: Date },
  closedAt: { type: Date },
  scoringWeights: {
    skills: { type: Number, default: 40 },
    experience: { type: Number, default: 40 },
    education: { type: Number, default: 20 },
  },
  slug: { type: String },
  applicationFormConfig: {
    requireFullName: { type: Boolean, default: true },
    requireMobileNumber: { type: Boolean, default: true },
    requireDate: { type: Boolean, default: false },
    requireLinkedin: { type: Boolean, default: false },
    requireGithub: { type: Boolean, default: false },
    requirePortfolio: { type: Boolean, default: false },
    requireResume: { type: Boolean, default: true },
    requirePassportPhoto: { type: Boolean, default: false },
    requireSignature: { type: Boolean, default: false },
    customQuestions: { type: [String], default: [] },
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
