import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { Company } from '@/core/database/models/Company';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function GET() {
  try {
    const token = cookies().get('candidate_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    await connectToDatabase();

    const candidateId = payload.candidateId as string;

    // Find all applications for this candidate
    // Populate job and company details
    const applications = await Application.find({ candidate: candidateId })
      .populate({
        path: 'job',
        model: Job,
        select: 'title department location employmentType',
      })
      .populate({
        path: 'companyId',
        model: Company,
        select: 'name logo',
      })
      .sort({ appliedAt: -1 })
      .lean();

    const formattedApplications = applications.map((app: any) => ({
      id: app._id,
      job: {
        id: app.job?._id,
        title: app.job?.title || 'Unknown Job',
        department: app.job?.department || '',
        location: app.job?.location || '',
        employmentType: app.job?.employmentType || '',
      },
      company: {
        id: app.companyId?._id,
        name: app.companyId?.name || 'Unknown Company',
        logo: app.companyId?.logo || null,
      },
      stage: app.stage,
      appliedAt: app.appliedAt,
    }));

    return NextResponse.json(formattedApplications);
  } catch (error: any) {
    console.error('Fetch Candidate Applications Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
