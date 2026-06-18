import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  refreshTokens: string[];
  avatar?: string;
  role: 'admin' | 'recruiter' | 'hiring-manager' | 'viewer';
  company: mongoose.Types.ObjectId;
  plan: 'starter' | 'growth' | 'enterprise';
  hearAbout?: string;
  createdAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  googleId: { type: String },
  refreshTokens: { type: [String], default: [] },
  avatar: { type: String },
  role: { type: String, enum: ['admin', 'recruiter', 'hiring-manager', 'viewer'], default: 'admin' },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  plan: { type: String, enum: ['starter', 'growth', 'enterprise'], default: 'starter' },
  hearAbout: { type: String },
  lastActiveAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
