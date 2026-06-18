import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { HireLetter } from '@/core/database/models/HireLetter';
import { Application } from '@/core/database/models/Application';
import { Candidate } from '@/core/database/models/Candidate';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const query: any = { companyId: decoded.companyId };
    if (candidateId) query.candidateId = candidateId;

    const letters = await HireLetter.find(query)
      .populate('candidateId', 'name email avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(letters);
  } catch (error) {
    console.error('Error fetching hire letters:', error);
    return NextResponse.json({ error: 'Failed to fetch hire letters' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const {
      candidateId,
      companyName,
      companyDetails,
      role,
      salary,
      startDate,
      letterContent,
      aiGenerated = false,
    } = body;

    if (!candidateId || !role || !salary || !startDate || !letterContent) {
      return NextResponse.json(
        { error: 'candidateId, role, salary, startDate, and letterContent are required' },
        { status: 400 }
      );
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Find the latest application for this candidate
    const application = await Application.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const hireLetter = new HireLetter({
      companyId: decoded.companyId,
      applicationId: application._id,
      candidateId: candidate._id,
      jobId: application.job,
      companyName: companyName || 'Company',
      companyDetails,
      role,
      salary: parseFloat(salary),
      startDate: new Date(startDate),
      letterContent,
      aiGenerated,
      status: 'sent',
      sentAt: new Date(),
    });

    await hireLetter.save();

    // Push hire letter ID to application + timeline event
    await Application.findByIdAndUpdate(application._id, {
      $push: {
        hireLetterIds: hireLetter._id,
        timeline: {
          event: `Hire letter sent for ${role}`,
          date: new Date(),
          type: 'hired',
        },
      },
    });

    return NextResponse.json(hireLetter, { status: 201 });
  } catch (error) {
    console.error('Error creating hire letter:', error);
    return NextResponse.json({ error: 'Failed to create hire letter' }, { status: 500 });
  }
}
