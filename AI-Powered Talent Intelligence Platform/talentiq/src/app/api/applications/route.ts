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
    
    const query: any = {};
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
