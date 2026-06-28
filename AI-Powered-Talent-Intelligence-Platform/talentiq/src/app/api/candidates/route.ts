import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { verifyAccessToken } from '@/core/auth/jwt';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();

    const {
      name, email, phone, avatar, jobId,
      linkedinUrl, githubUrl, portfolioUrl, resumeUrl, passportPhotoUrl,
      signature, availableStartDate,
      extractedSkills, extractedCompanies, extractedEducation,
      aiScore, skillsMatch, experienceMatch, educationMatch, keywordsMatch,
      strengths, gaps, reasons, source, portalToken
    } = body;

    if (!jobId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify job exists - handle invalid ObjectId format gracefully
    let job;
    try {
      job = await Job.findById(jobId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 });
    }
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if candidate is logged in
    const candidateToken = cookies().get('candidate_token')?.value;
    let loggedInCandidateId = null;
    
    if (candidateToken) {
      try {
        const { payload } = await jose.jwtVerify(candidateToken, JWT_SECRET);
        loggedInCandidateId = payload.candidateId as string;
      } catch (e) {
        console.error('Invalid candidate token', e);
      }
    }

    let candidateDoc;
    let plainTokenForResponse = null;

    if (loggedInCandidateId) {
      // Path B: Returning Candidate
      candidateDoc = await Candidate.findById(loggedInCandidateId);
      if (!candidateDoc) {
        return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
      }
      
      // Update missing fields
      let updated = false;
      if (phone && !candidateDoc.phone) { candidateDoc.phone = phone; updated = true; }
      if (linkedinUrl && !candidateDoc.linkedinUrl) { candidateDoc.linkedinUrl = linkedinUrl; updated = true; }
      if (githubUrl && !candidateDoc.githubUrl) { candidateDoc.githubUrl = githubUrl; updated = true; }
      if (portfolioUrl && !candidateDoc.portfolioUrl) { candidateDoc.portfolioUrl = portfolioUrl; updated = true; }
      if (resumeUrl && !candidateDoc.resumeUrl) { candidateDoc.resumeUrl = resumeUrl; updated = true; }
      if (passportPhotoUrl && !candidateDoc.passportPhotoUrl) { candidateDoc.passportPhotoUrl = passportPhotoUrl; updated = true; }
      if (signature && !candidateDoc.signature) { candidateDoc.signature = signature; updated = true; }
      if (availableStartDate && !candidateDoc.availableStartDate) { candidateDoc.availableStartDate = availableStartDate; updated = true; }
      
      if (updated) {
        await candidateDoc.save();
      }

      // Check for duplicate application
      const existingApplication = await Application.findOne({
        candidate: candidateDoc._id,
        job: job._id
      });

      if (existingApplication) {
        return NextResponse.json({ error: 'You have already applied for this position.' }, { status: 400 });
      }

    } else {
      // Path A: New Candidate (or existing but not logged in)
      const existingEmail = await Candidate.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return NextResponse.json({ error: 'An account with this email already exists. Please log in first to apply.', requireLogin: true }, { status: 400 });
      }

      // Generate token securely on backend instead of trusting frontend
      const generatedToken = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g. 8 chars like 'A1B2C3D4'
      const hashedToken = await bcrypt.hash(generatedToken, 10);

      // 1. Create the Candidate document
      candidateDoc = await Candidate.create({
        companyId: job.company, // keeping it for backwards compat, though not required
        name,
        email: email.toLowerCase(),
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
        hasPortalAccess: true,
        portalToken: hashedToken
      });
      
      // Pass back the plain token just once so the frontend can display it or email it
      plainTokenForResponse = generatedToken;
    }

    // 2. Create the Application document
    const application = await Application.create({
      companyId: job.company,
      job: job._id,
      candidate: candidateDoc._id,
      stage: 'Screening', // default
      source: source || 'Career Site',
      aiScore: {
        score: aiScore || 0,
        skillsMatch: skillsMatch || aiScore || 0,
        experienceMatch: experienceMatch || aiScore || 0,
        educationMatch: educationMatch || aiScore || 0,
        keywordsMatch: keywordsMatch || aiScore || 0,
        strengths: strengths || [],
        gaps: gaps || [],
        reasons: reasons || [],
        scoredAt: new Date()
      },
      appliedAt: new Date(),
      daysInStage: 0
    });

    // 3. Increment applicant count on job
    job.applicantCount = (job.applicantCount || 0) + 1;
    await job.save();

    // 4. Create Notification for Recruiter
    const { Notification } = await import('@/core/database/models/Notification');
    await Notification.create({
      recipientUserId: 'all',
      companyId: job.company,
      type: 'new_application',
      title: 'New Application Received',
      message: `${candidateDoc.name} applied for ${job.title}.`,
      candidateId: candidateDoc._id,
      applicationId: application._id,
      linkHref: `/pipeline`,
    });

    // Format for frontend response
    const formattedCandidate = {
      id: candidateDoc._id.toString(),
      applicationId: application._id.toString(),
      name: candidateDoc.name,
      email: candidateDoc.email,
      phone: candidateDoc.phone,
      avatar: candidateDoc.avatar,
      role: job.title,
      jobId: job._id.toString(),
      stage: application.stage,
      source: application.source,
      aiScore: application.aiScore?.score || 0,
      // Full score breakdown for the detail page
      scoreBreakdown: {
        skills: application.aiScore?.skillsMatch || 0,
        experience: application.aiScore?.experienceMatch || 0,
        education: application.aiScore?.educationMatch || 0,
        keywords: application.aiScore?.keywordsMatch || 0,
      },
      daysInStage: application.daysInStage,
      appliedAt: application.appliedAt,
      notes: application.recruiterNotes || [],
      tags: application.tags || [],
      timeline: [{ event: 'Applied via Career Site', date: 'Just now', type: 'applied' }],
      extractedSkills: candidateDoc.extractedSkills || [],
      extractedCompanies: candidateDoc.extractedCompanies || [],
      extractedEducation: candidateDoc.extractedEducation || [],
      strengths: application.aiScore?.strengths || [],
      gaps: application.aiScore?.gaps || [],
      reasons: application.aiScore?.reasons || [],
      linkedinUrl: candidateDoc.linkedinUrl,
      githubUrl: candidateDoc.githubUrl,
      portfolioUrl: candidateDoc.portfolioUrl,
      resumeUrl: candidateDoc.resumeUrl,
      passportPhotoUrl: candidateDoc.passportPhotoUrl,
      signature: candidateDoc.signature,
      availableStartDate: candidateDoc.availableStartDate,
      portalToken: plainTokenForResponse || null, // Only for new candidates
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
    const applications = await Application.find({ companyId: decoded.companyId, job: { $in: jobIds } })
      .populate('candidate')
      .sort({ appliedAt: -1 });

    const formattedCandidates = applications.map(app => {
      const c = app.candidate as any; // populated candidate
      return {
        id: app._id.toString(),
        candidateId: c._id.toString(),
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
        // Full score breakdown for the detail page
        scoreBreakdown: {
          skills: app.aiScore?.skillsMatch || 0,
          experience: app.aiScore?.experienceMatch || 0,
          education: app.aiScore?.educationMatch || 0,
          keywords: app.aiScore?.keywordsMatch || 0,
        },
        daysInStage: app.daysInStage,
        appliedAt: app.appliedAt,
        notes: app.recruiterNotes || [],
        timeline: app.timeline && app.timeline.length > 0
          ? app.timeline.map((t: any) => ({
              event: t.event,
              date: new Date(t.date).toLocaleDateString(),
              type: t.type || 'stage',
            }))
          : [{ event: 'Applied via Career Site', date: new Date(app.appliedAt).toLocaleDateString(), type: 'applied' }],
        assignedTo: app.assignedTo ? app.assignedTo.toString() : undefined,
        extractedSkills: c.extractedSkills || [],
        tags: app.tags || [],
        extractedCompanies: c.extractedCompanies || [],
        extractedEducation: c.extractedEducation || [],
        strengths: app.aiScore?.strengths || [],
        gaps: app.aiScore?.gaps || [],
        reasons: app.aiScore?.reasons || [],
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
