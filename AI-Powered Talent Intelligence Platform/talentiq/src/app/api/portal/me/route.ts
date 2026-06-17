export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { Company } from '@/core/database/models/Company';
import { Offer } from '@/core/database/models/Offer';
import { HireLetter } from '@/core/database/models/HireLetter';
import { Assignment } from '@/core/database/models/Assignment';
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

    // Get all non-draft offers
    const allOffers = await Offer.find({ candidate: candidate._id, status: { $ne: 'draft' } }).sort({ createdAt: -1 });
    // Latest non-declined offer for the main view
    const latestOffer = allOffers.find((o: any) => o.status !== 'declined') || allOffers[0] || null;

    // Get latest hire letter
    const hireLetter = await HireLetter.findOne({ candidateId: candidate._id }).sort({ createdAt: -1 });

    // Get assignment if in Assessment stage
    const assignment = await Assignment.findOne({ candidateId: candidate._id, status: { $in: ['pending', 'submitted'] } }).sort({ createdAt: -1 });

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
      timeline: application.timeline && application.timeline.length > 0
        ? application.timeline.map((t: any) => ({
            event: t.event,
            date: new Date(t.date).toLocaleDateString(),
            type: t.type,
          }))
        : [{ event: 'Applied for position', date: new Date(application.appliedAt).toLocaleDateString(), type: 'stage_change' }],
      interviews: [],
      messages: [],
      offer: latestOffer ? {
        id: latestOffer._id.toString(),
        salary: latestOffer.salary,
        currency: latestOffer.currency,
        startDate: latestOffer.startDate,
        letterContent: latestOffer.letterContent,
        status: latestOffer.status,
      } : null,
      allOffers: allOffers.map((o: any) => ({
        id: o._id.toString(),
        salary: o.salary,
        currency: o.currency,
        startDate: o.startDate,
        letterContent: o.letterContent,
        status: o.status,
        sentAt: o.sentAt,
      })),
      hireLetter: hireLetter ? {
        id: hireLetter._id.toString(),
        role: hireLetter.role,
        companyName: hireLetter.companyName,
        salary: hireLetter.salary,
        startDate: hireLetter.startDate,
        letterContent: hireLetter.letterContent,
        status: hireLetter.status,
        sentAt: hireLetter.sentAt,
        signedAt: hireLetter.signedAt,
      } : null,
      assignment: assignment ? {
        id: assignment._id.toString(),
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        referenceLink: assignment.referenceLink,
        status: assignment.status,
        submittedAt: assignment.submittedAt,
        submissionLink: assignment.submissionLink,
      } : null,
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('Portal me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
