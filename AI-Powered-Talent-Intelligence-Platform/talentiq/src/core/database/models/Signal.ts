import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISignal extends Document {
  roomId: string;
  senderId: string;
  type: string;
  payload: any;
  createdAt: Date;
}

const SignalSchema = new Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24h
}, { timestamps: true });

export const Signal: Model<ISignal> = mongoose.models.Signal || mongoose.model<ISignal>('Signal', SignalSchema);
