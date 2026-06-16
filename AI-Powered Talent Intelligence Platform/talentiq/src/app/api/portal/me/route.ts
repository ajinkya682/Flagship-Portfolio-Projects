import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { Company } from '@/core/database/models/Company';
import { Offer } from '@/core/database/models/Offer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('candidateToken='))?.split('=')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (decoded.type !== 'candidate' || !decoded.candidateId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const candidate = await Candidate.findById(decoded.candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Get the application
    const application = await Application.findOne({ candidate: candidate._id }).sort({ appliedAt: -1 });
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Get the job
    const job = await Job.findById(application.job);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get the company
    const company = await Company.findById(job.company);

    // Get the offer
    const offer = await Offer.findOne({ candidate: candidate._id, status: { $ne: 'draft' } }).sort({ createdAt: -1 });

    const payload = {
      candidate: {
        id: candidate._id.toString(),
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        avatar: candidate.avatar,
        linkedinUrl: candidate.linkedinUrl,
        githubUrl: candidate.githubUrl,
        portfolioUrl: candidate.portfolioUrl,
        resumeUrl: candidate.resumeUrl,
        passportPhotoUrl: candidate.passportPhotoUrl,
        signature: candidate.signature,
        availableStartDate: candidate.availableStartDate,
        extractedSkills: candidate.extractedSkills || [],
        extractedCompanies: candidate.extractedCompanies || [],
        extractedEducation: candidate.extractedEducation || [],
        isBlocked: candidate.isBlocked || false,
      },
      application: {
        id: application._id.toString(),
        stage: application.stage,
        appliedAt: application.appliedAt,
        source: application.source,
        aiScore: application.aiScore?.score,
        strengths: application.aiScore?.strengths || [],
        gaps: application.aiScore?.gaps || [],
      },
      job: {
        id: job._id.toString(),
        title: job.title,
        department: job.department,
        location: job.location,
      },
      company: {
        name: company?.name || 'Company',
        logo: company?.logo || '',
      },
      timeline: [{ event: 'Applied via Career Site', date: new Date(application.appliedAt).toLocaleDateString(), type: 'applied' }],
      interviews: [],
      messages: [],
      offer: offer ? {
        id: offer._id.toString(),
        salary: offer.salary,
        currency: offer.currency,
        startDate: offer.startDate,
        letterContent: offer.letterContent,
        status: offer.status,
      } : null
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('Portal me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
