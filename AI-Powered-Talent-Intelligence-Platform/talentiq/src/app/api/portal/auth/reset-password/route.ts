import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find candidate by valid unexpired token
    const candidate = await Candidate.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Password reset token is invalid or has expired.' }, { status: 400 });
    }

    // Set the new password (portalToken is currently used for candidate auth according to other portal API routes)
    // Assuming portalToken is a hashed password or a plain token that allows login
    // Let's store it as bcrypt hash since they are resetting password to use it for login
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    candidate.portalToken = hashedPassword;
    
    // Clear reset token fields
    candidate.resetPasswordToken = undefined;
    candidate.resetPasswordExpires = undefined;
    
    await candidate.save();

    return NextResponse.json({ success: true, message: 'Password has been successfully reset.' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
