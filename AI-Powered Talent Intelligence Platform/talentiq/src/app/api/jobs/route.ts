import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Job } from '@/core/database/models/Job';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Auth Check
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
    const status = searchParams.get('status');
    const query: any = { company: decoded.companyId };
    
    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    const formattedJobs = jobs.map(j => ({
      id: j._id.toString(),
      title: j.title,
      department: j.department,
      location: j.location,
      type: j.employmentType,
      remote: j.remoteType,
      status: j.status,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      description: j.description,
      requirements: j.requirements,
      skills: j.skills,
      postedAt: j.publishedAt || j.createdAt,
      slug: j.slug,
      applicationFormConfig: j.applicationFormConfig
    }));

    return NextResponse.json(formattedJobs);
  } catch (error: any) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Auth Check
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

    const body = await req.json();
    
    const newJob = await Job.create({
      title: body.title,
      department: body.department,
      location: body.location,
      employmentType: body.type,
      remoteType: body.remote,
      status: body.status || 'published',
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      description: body.description,
      applicationFormConfig: body.applicationFormConfig,
      publishedAt: new Date(),
      slug: body.slug || `job_${Math.random().toString(36).substring(2, 8)}`,
      company: decoded.companyId
    });

    const formattedJob = {
      id: newJob._id.toString(),
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.employmentType,
      remote: newJob.remoteType,
      status: newJob.status,
      salaryMin: newJob.salaryMin,
      salaryMax: newJob.salaryMax,
      description: newJob.description,
      postedAt: newJob.publishedAt || newJob.createdAt,
      slug: newJob.slug,
      applicationFormConfig: newJob.applicationFormConfig
    };

    return NextResponse.json(formattedJob, { status: 201 });
  } catch (error: any) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
