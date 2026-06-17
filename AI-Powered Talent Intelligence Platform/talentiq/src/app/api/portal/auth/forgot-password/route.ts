import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import { inngest } from '@/inngest/client';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Verify candidate exists
    const candidate = await Candidate.findOne({ email });

    // We don't want to leak whether an email exists or not for security, 
    // so we return a success response either way.
    if (!candidate) {
      return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save token to candidate
    candidate.resetPasswordToken = token;
    candidate.resetPasswordExpires = resetPasswordExpires;
    await candidate.save();

    // Trigger urgent email worker
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal/reset-password?token=${token}`;
    
    await inngest.send({
      name: 'email/send.urgent',
      data: {
        to: email,
        subject: 'Reset your TalentIQ Password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hi ${candidate.name},</p>
            <p>You requested a password reset. Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best,<br/>The TalentIQ Team</p>
          </div>
        `
      }
    });

    return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
