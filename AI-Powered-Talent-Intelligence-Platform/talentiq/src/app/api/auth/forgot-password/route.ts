import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDatabase from '@/core/database/mongoose';
import { User } from '@/core/database/models/User';
import { sendEmail } from '@/lib/nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // We don't return a 404 to prevent email enumeration attacks. 
    // We just return a generic success message.
    if (!user) {
      return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    // Construct the reset link
    // Determine the base URL depending on the environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://talentiq.dev');
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e5e5; color: #171717;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #2563EB; margin: 0;">TalentIQ</h1>
        </div>
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #525252; margin-bottom: 24px;">
          Hi ${user.name},<br><br>
          We received a request to reset your password. If you didn't make this request, you can safely ignore this email. Otherwise, click the button below to verify your request and set a new password.
        </p>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 12px 24px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">Verify & Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #737373; margin-bottom: 32px;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #2563EB; word-break: break-all;">${resetUrl}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e5e5; margin-bottom: 24px;">
        <div style="text-align: center; font-size: 12px; color: #a3a3a3;">
          <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} TalentIQ. All rights reserved.</p>
          <p style="margin: 0;">
            <a href="${baseUrl}" style="color: #a3a3a3; text-decoration: underline;">Home</a> &bull;
            <a href="${baseUrl}/terms" style="color: #a3a3a3; text-decoration: underline;">Terms & Conditions</a> &bull;
            <a href="${baseUrl}/privacy" style="color: #a3a3a3; text-decoration: underline;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Reset your TalentIQ password',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
