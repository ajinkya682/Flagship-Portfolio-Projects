import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();

    // The frontend sends a unified "Candidate" object
    const {
      name, email, phone, avatar, jobId,
      linkedinUrl, githubUrl, portfolioUrl, resumeUrl, passportPhotoUrl,
      signature, availableStartDate,
      extractedSkills, extractedCompanies, extractedEducation,
      aiScore, strengths, gaps, source
    } = body;

    if (!jobId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // 1. Create the Candidate document
    const newCandidate = await Candidate.create({
      name,
      email,
      phone,
      avatar,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      passportPhotoUrl,
      signature,
      availableStartDate,
      extractedSkills,
      extractedCompanies,
      extractedEducation,
      hasPortalAccess: false
    });

    // 2. Create the Application document
    const application = await Application.create({
      job: job._id,
      candidate: newCandidate._id,
      stage: 'Screening', // default
      source: source || 'Career Site',
      aiScore: {
        score: aiScore || 0,
        skillsMatch: aiScore || 0,
        experienceMatch: aiScore || 0,
        educationMatch: aiScore || 0,
        keywordsMatch: aiScore || 0,
        strengths: strengths || [],
        gaps: gaps || [],
        reasons: [],
        scoredAt: new Date()
      },
      appliedAt: new Date(),
      daysInStage: 0
    });

    // 3. Increment applicant count on job
    job.applicantCount = (job.applicantCount || 0) + 1;
    await job.save();

    // Format for frontend response
    const formattedCandidate = {
      id: newCandidate._id.toString(),
      applicationId: application._id.toString(),
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      avatar: newCandidate.avatar,
      role: job.title,
      jobId: job._id.toString(),
      stage: application.stage,
      source: application.source,
      aiScore: application.aiScore?.score || 0,
      daysInStage: application.daysInStage,
      appliedAt: application.appliedAt,
      notes: [],
      timeline: [{ event: 'Applied via Career Site', date: 'Just now', type: 'applied' }],
      extractedSkills: newCandidate.extractedSkills,
      strengths: application.aiScore?.strengths || [],
      gaps: application.aiScore?.gaps || [],
      linkedinUrl: newCandidate.linkedinUrl,
      githubUrl: newCandidate.githubUrl,
      portfolioUrl: newCandidate.portfolioUrl,
      resumeUrl: newCandidate.resumeUrl,
      passportPhotoUrl: newCandidate.passportPhotoUrl,
      signature: newCandidate.signature,
      availableStartDate: newCandidate.availableStartDate,
    };

    return NextResponse.json(formattedCandidate, { status: 201 });
  } catch (error: any) {
    console.error('Create candidate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Find all jobs for the company
    const jobs = await Job.find({ company: decoded.companyId }).select('_id title');
    const jobIds = jobs.map(j => j._id);
    
    const jobMap = jobs.reduce((acc, job) => {
      acc[job._id.toString()] = job.title;
      return acc;
    }, {} as Record<string, string>);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate')
      .sort({ appliedAt: -1 });

    const formattedCandidates = applications.map(app => {
      const c = app.candidate as any; // populated candidate
      return {
        id: c._id.toString(),
        applicationId: app._id.toString(),
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: c.avatar,
        role: jobMap[app.job.toString()] || 'Unknown Role',
        jobId: app.job.toString(),
        stage: app.stage,
        source: app.source,
        aiScore: app.aiScore?.score || 0,
        daysInStage: app.daysInStage,
        appliedAt: app.appliedAt,
        notes: [], // Need Note model if implemented later
        timeline: [], // Need Timeline model
        extractedSkills: c.extractedSkills || [],
        extractedCompanies: c.extractedCompanies || [],
        extractedEducation: c.extractedEducation || [],
        strengths: app.aiScore?.strengths || [],
        gaps: app.aiScore?.gaps || [],
        linkedinUrl: c.linkedinUrl,
        githubUrl: c.githubUrl,
        portfolioUrl: c.portfolioUrl,
        resumeUrl: c.resumeUrl,
        passportPhotoUrl: c.passportPhotoUrl,
        signature: c.signature,
        availableStartDate: c.availableStartDate,
      };
    });

    return NextResponse.json(formattedCandidates);
  } catch (error: any) {
    console.error('Fetch candidates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
