import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function GET() {
  try {
    const token = cookies().get('candidate_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    await connectToDatabase();

    const candidateId = payload.candidateId as string;
    const candidate = await Candidate.findById(candidateId).lean();

    if (!candidate) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        linkedinUrl: candidate.linkedinUrl,
        githubUrl: candidate.githubUrl,
        portfolioUrl: candidate.portfolioUrl,
        resumeUrl: candidate.resumeUrl,
        avatar: candidate.avatar,
      },
    });
  } catch (error: any) {
    console.error('Candidate Me Error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
