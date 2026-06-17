import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Application } from '@/core/database/models/Application';
import { Candidate } from '@/core/database/models/Candidate';
import { Job } from '@/core/database/models/Job';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const applicationId = params.id;
    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const candidate = await Candidate.findById(application.candidate);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!candidate.resumeUrl) {
      return NextResponse.json({ error: 'Candidate has no resume uploaded' }, { status: 400 });
    }

    // Call our internal score endpoint
    const scoreUrl = new URL('/api/candidates/score', req.url);
    const scoreRes = await fetch(scoreUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeUrl: candidate.resumeUrl, job: job })
    });

    if (!scoreRes.ok) {
      const err = await scoreRes.json();
      return NextResponse.json({ error: err.error || 'Failed to score resume' }, { status: scoreRes.status });
    }

    const scoreData = await scoreRes.json();

    // Update Application
    application.aiScore = {
      score: scoreData.aiScore || 0,
      skillsMatch: scoreData.skillsMatch || scoreData.aiScore || 0,
      experienceMatch: scoreData.experienceMatch || scoreData.aiScore || 0,
      educationMatch: scoreData.educationMatch || scoreData.aiScore || 0,
      keywordsMatch: scoreData.keywordsMatch || scoreData.aiScore || 0,
      strengths: scoreData.strengths || [],
      gaps: scoreData.gaps || [],
      reasons: scoreData.reasons || [],
      scoredAt: new Date()
    };
    await application.save();

    // Update Candidate
    candidate.extractedSkills = scoreData.extractedSkills || [];
    candidate.extractedCompanies = scoreData.extractedCompanies || [];
    candidate.extractedEducation = scoreData.extractedEducation || [];
    await candidate.save();

    // Return updated fields for the frontend
    return NextResponse.json({
      aiScore: application.aiScore.score,
      scoreBreakdown: {
        skills: application.aiScore.skillsMatch,
        experience: application.aiScore.experienceMatch,
        education: application.aiScore.educationMatch,
        keywords: application.aiScore.keywordsMatch,
      },
      strengths: application.aiScore.strengths,
      gaps: application.aiScore.gaps,
      reasons: application.aiScore.reasons,
      extractedSkills: candidate.extractedSkills,
      extractedCompanies: candidate.extractedCompanies,
      extractedEducation: candidate.extractedEducation,
    });

  } catch (error: any) {
    console.error('Rescore error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
