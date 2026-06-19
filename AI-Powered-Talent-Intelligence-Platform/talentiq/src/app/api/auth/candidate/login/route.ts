import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and Access Token are required' }, { status: 400 });
    }

    await connectToDatabase();

    const candidate = await Candidate.findOne({ email: email.toLowerCase() });

    if (!candidate) {
      return NextResponse.json({ error: 'Invalid email or access token' }, { status: 401 });
    }

    if (!candidate.portalToken) {
      return NextResponse.json({ error: 'Invalid email or access token' }, { status: 401 });
    }

    // Since we are moving to hashed tokens but might have plain text tokens during transition
    // Let's support both for now, then strictly enforce hashed
    let isValid = false;
    if (candidate.portalToken.startsWith('$2a$') || candidate.portalToken.startsWith('$2b$')) {
      isValid = await bcrypt.compare(token, candidate.portalToken);
    } else {
      isValid = candidate.portalToken === token;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or access token' }, { status: 401 });
    }

    // Generate JWT
    const jwt = await new jose.SignJWT({
      candidateId: candidate._id.toString(),
      email: candidate.email,
      role: 'candidate',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Set HTTP-only cookie
    cookies().set({
      name: 'candidate_token',
      value: jwt,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Candidate Login Error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
