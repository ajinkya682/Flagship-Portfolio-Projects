import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo?: string;
  industry: string;
  size: string;
  timezone: string;
  currency: string;
  careerPageUrl: string;
  subdomain: string;
  slug: string;
  ssoEnabled: boolean;
  pipelineStages: { id: string; name: string; color: string; order: number; isCore: boolean }[];
  apiKeys: {
    geminiApiKey?: string;
    emailUser?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  };
  billing: {
    plan: 'starter' | 'growth' | 'enterprise';
    billingCycle: 'monthly' | 'annually';
    status: 'active' | 'past_due' | 'canceled';
    currentPeriodEnd?: Date;
  };
}

const PipelineStageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#94A3B8' },
  order: { type: Number, required: true },
  isCore: { type: Boolean, default: false } // 'Applied', 'Hired', 'Rejected' are core
}, { _id: false });

const ApiKeysSchema = new Schema({
  geminiApiKey: String,
  emailUser: String,
  clientId: String,
  clientSecret: String,
  refreshToken: String,
}, { _id: false });

const BillingSchema = new Schema({
  plan: { type: String, enum: ['starter', 'growth', 'enterprise'], default: 'starter' },
  billingCycle: { type: String, enum: ['monthly', 'annually'], default: 'annually' },
  status: { type: String, enum: ['active', 'past_due', 'canceled'], default: 'active' },
  currentPeriodEnd: { type: Date }
}, { _id: false });

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: { type: String, default: 'Technology' },
  size: { type: String, default: '1-10' },
  timezone: { type: String, default: 'UTC' },
  currency: { type: String, default: 'USD' },
  careerPageUrl: { type: String },
  subdomain: { type: String },
  slug: { type: String, required: true, unique: true },
  ssoEnabled: { type: Boolean, default: false },
  pipelineStages: {
    type: [PipelineStageSchema],
    default: [
      { id: 'applied', name: 'Applied', color: '#94A3B8', order: 0, isCore: true },
      { id: 'screening', name: 'Screening', color: '#3B82F6', order: 1, isCore: false },
      { id: 'interview', name: 'Interview', color: '#8B5CF6', order: 2, isCore: false },
      { id: 'assessment', name: 'Assessment', color: '#F59E0B', order: 3, isCore: false },
      { id: 'offer', name: 'Offer', color: '#10B981', order: 4, isCore: false },
      { id: 'hired', name: 'Hired', color: '#059669', order: 5, isCore: true },
      { id: 'rejected', name: 'Rejected', color: '#EF4444', order: 6, isCore: true }
    ]
  },
  apiKeys: { type: ApiKeysSchema, default: {} },
  billing: { type: BillingSchema, default: { plan: 'starter', billingCycle: 'annually', status: 'active' } }
}, { timestamps: true });

export const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
