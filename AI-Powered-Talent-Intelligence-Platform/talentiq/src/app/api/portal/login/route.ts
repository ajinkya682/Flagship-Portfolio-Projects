import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { portalToken } = await req.json();

    if (!portalToken) {
      return NextResponse.json({ error: 'Portal token is required' }, { status: 400 });
    }

    // Case-insensitive exact match
    const candidate = await Candidate.findOne({ 
      portalToken: { $regex: new RegExp(`^${portalToken}$`, 'i') } 
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Invalid access code. Please check and try again.' }, { status: 401 });
    }

    // Generate JWT for candidate
    const token = jwt.sign(
      { candidateId: candidate._id.toString(), type: 'candidate' }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return the token in a secure HTTP-only cookie
    const response = NextResponse.json({ success: true, candidateId: candidate._id });
    
    response.cookies.set({
      name: 'candidateToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Portal login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
