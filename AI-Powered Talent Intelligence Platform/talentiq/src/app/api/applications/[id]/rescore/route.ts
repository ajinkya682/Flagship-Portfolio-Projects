import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Application } from '@/core/database/models/Application';
import { Candidate } from '@/core/database/models/Candidate';
import { verifyAccessToken } from '@/core/auth/jwt';

/**
 * PATCH /api/applications/[id]/rescore
 * 
 * Re-runs AI scoring for an existing application.
 * Accepts { aiScore } body with the full score object from /api/candidates/score.
 * Requires recruiter authentication.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Auth check
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('accessToken='))
        ?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verifyAccessToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { aiScore, extractedSkills, extractedCompanies, extractedEducation } = body;

    if (!aiScore) {
      return NextResponse.json({ error: 'aiScore data is required' }, { status: 400 });
    }

    // Update Application's aiScore
    const updatedApplication = await Application.findByIdAndUpdate(
      params.id,
      {
        aiScore: {
          score: aiScore.score ?? 0,
          skillsMatch: aiScore.skillsMatch ?? 0,
          experienceMatch: aiScore.experienceMatch ?? 0,
          educationMatch: aiScore.educationMatch ?? 0,
          keywordsMatch: aiScore.keywordsMatch ?? 0,
          strengths: aiScore.strengths ?? [],
          gaps: aiScore.gaps ?? [],
          reasons: aiScore.reasons ?? [],
          scoredAt: new Date(),
        },
      },
      { new: true }
    ).populate('candidate');

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Optionally update extracted entities on the Candidate document
    if (extractedSkills || extractedCompanies || extractedEducation) {
      const candidateId = (updatedApplication.candidate as any)._id;
      await Candidate.findByIdAndUpdate(candidateId, {
        ...(extractedSkills && { extractedSkills }),
        ...(extractedCompanies && { extractedCompanies }),
        ...(extractedEducation && { extractedEducation }),
      });
    }

    return NextResponse.json({
      success: true,
      applicationId: params.id,
      score: aiScore.score,
    });
  } catch (error: any) {
    console.error('Rescore error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
