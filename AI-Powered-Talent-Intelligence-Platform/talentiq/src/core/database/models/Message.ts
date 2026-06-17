import mongoose, { Document, Model } from 'mongoose';

export interface IMessage extends Document {
  candidateId: string;
  senderId: string; // 'me' for recruiter, or 'candidate'
  text: string;
  time: string; // Optional: specific formatted time string
  createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  candidateId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
