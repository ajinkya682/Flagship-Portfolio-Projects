export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Application } from '@/core/database/models/Application';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    
    const query: any = { companyId: decoded.companyId };
    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('candidate')
      .populate('job', 'title department')
      .sort({ appliedAt: -1 });

    return NextResponse.json(applications);
  } catch (error: any) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { candidateId, jobId, matchScore = 0 } = body;

    if (!candidateId || !jobId) {
      return NextResponse.json({ error: 'Missing candidateId or jobId' }, { status: 400 });
    }

    // Check if application already exists
    const existing = await Application.findOne({ candidate: candidateId, job: jobId });
    if (existing) {
      return NextResponse.json({ error: 'Application already exists' }, { status: 400 });
    }

    const application = await Application.create({
      companyId: decoded.companyId,
      job: jobId,
      candidate: candidateId,
      stage: 'Applied',
      source: 'AI Match',
      aiScore: {
        score: matchScore,
        skillsMatch: matchScore,
        experienceMatch: 0,
        educationMatch: 0,
        keywordsMatch: matchScore,
        strengths: ["Strong keyword match from AI Analytics"],
        gaps: [],
        reasons: [{ text: "Candidate matched open role keywords via AI Cross-Job Match.", positive: true }],
        scoredAt: new Date()
      },
      appliedAt: new Date(),
      daysInStage: 0,
      timeline: [{
        event: 'Matched via AI Analytics',
        date: new Date(),
        type: 'stage_change'
      }]
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
