import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Assignment } from '@/core/database/models/Assignment';
import { Application } from '@/core/database/models/Application';
import { Candidate } from '@/core/database/models/Candidate';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');
    const applicationId = searchParams.get('applicationId');

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const query: any = { companyId: decoded.companyId };
    if (candidateId) query.candidateId = candidateId;
    if (applicationId) query.applicationId = applicationId;

    const assignments = await Assignment.find(query)
      .populate('candidateId', 'name email avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
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

    const { candidateId, jobId, applicationId, title, description, deadline, referenceLink } = body;

    if (!candidateId || !title || !description || !deadline) {
      return NextResponse.json(
        { error: 'candidateId, title, description, and deadline are required' },
        { status: 400 }
      );
    }

    // Find the application to get proper IDs
    const application = await Application.findOne(
      applicationId
        ? { _id: applicationId }
        : { candidate: candidateId }
    ).sort({ createdAt: -1 });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const assignment = new Assignment({
      companyId: decoded.companyId,
      applicationId: application._id,
      candidateId: candidate._id,
      jobId: jobId || application.job,
      title,
      description,
      deadline: new Date(deadline),
      referenceLink,
      status: 'pending',
    });

    await assignment.save();

    // Update Application: store assignmentId + append timeline event
    await Application.findByIdAndUpdate(application._id, {
      assignmentId: assignment._id,
      $push: {
        timeline: {
          event: `Assignment sent: "${title}" — Due ${new Date(deadline).toLocaleDateString()}`,
          date: new Date(),
          type: 'assignment',
        },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
