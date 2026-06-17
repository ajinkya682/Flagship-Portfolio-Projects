import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Job } from '@/core/database/models/Job';
import { Candidate } from '@/core/database/models/Candidate';
import { Application } from '@/core/database/models/Application';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ jobs: [], candidates: [], applications: [] });
    }

    await connectToDatabase();

    const regex = new RegExp(q, 'i');

    // Search jobs
    const jobs = await Job.find({
      $or: [
        { title: regex },
        { department: regex },
        { location: regex },
        { description: regex },
      ],
      status: 'open',
    })
      .select('title department location status')
      .limit(5)
      .lean();

    // Search candidates
    const candidates = await Candidate.find({
      $or: [
        { name: regex },
        { email: regex },
        { extractedSkills: regex },
      ],
    })
      .select('name email avatar extractedSkills')
      .limit(5)
      .lean();

    // Search applications (via candidate + job name lookup)
    const matchedCandidateIds = candidates.map(c => c._id);
    const matchedJobIds = jobs.map(j => j._id);

    const applications = await Application.find({
      $or: [
        { candidate: { $in: matchedCandidateIds } },
        { job: { $in: matchedJobIds } },
        { stage: regex },
        { tags: regex },
      ],
    })
      .populate('candidate', 'name email avatar')
      .populate('job', 'title department')
      .select('stage appliedAt candidate job')
      .limit(5)
      .lean();

    return NextResponse.json({
      jobs: jobs.map((j: any) => ({
        id: j._id.toString(),
        title: j.title,
        department: j.department,
        location: j.location,
        href: `/jobs/${j._id}`,
      })),
      candidates: candidates.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        email: c.email,
        avatar: c.avatar,
        skills: (c.extractedSkills || []).slice(0, 3),
        href: `/applications/${c._id.toString()}`,
      })),
      applications: applications.map((a: any) => ({
        id: a._id.toString(),
        candidateName: a.candidate?.name || 'Unknown',
        jobTitle: a.job?.title || 'Unknown',
        stage: a.stage,
        href: `/applications/${a.candidate?._id?.toString() || ''}`,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
