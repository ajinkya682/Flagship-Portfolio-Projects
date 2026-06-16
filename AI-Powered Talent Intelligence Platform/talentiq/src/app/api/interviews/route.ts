import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Interview } from '@/core/database/models/Interview';
import { Application } from '@/core/database/models/Application';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const dateQuery = url.searchParams.get('date'); // YYYY-MM-DD
    const candidateId = url.searchParams.get('candidateId');

    let filter: any = {};
    if (candidateId) filter.candidate = candidateId;

    if (dateQuery) {
      const startOfDay = new Date(`${dateQuery}T00:00:00.000Z`);
      const endOfDay = new Date(`${dateQuery}T23:59:59.999Z`);
      filter.scheduledAt = { $gte: startOfDay, $lt: endOfDay };
    }

    const interviews = await Interview.find(filter)
      .populate('job', 'title department location')
      .populate('candidate', 'name email avatar role')
      .sort({ scheduledAt: 1 });

    return NextResponse.json(interviews);
  } catch (error: any) {
    console.error('Fetch interviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { candidateId, applicationId, jobId, scheduledAt, locationType } = body;

    if (!candidateId || !applicationId || !jobId || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 45 minute duration strictly
    const duration = 45;
    const proposedStart = new Date(scheduledAt);
    const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);

    // Ensure working hours (9 AM to 5 PM)
    const hour = proposedStart.getHours();
    const minutes = proposedStart.getMinutes();
    const decimalHour = hour + minutes / 60;
    
    // 5 PM is 17:00. Since slot is 45 mins, last slot can start at 16:15
    if (decimalHour < 9 || decimalHour > 16.25) {
      return NextResponse.json({ error: 'Interviews must be scheduled between 9:00 AM and 5:00 PM.' }, { status: 400 });
    }

    // Check for double booking
    // Find any interview where the scheduledAt time overlaps with [proposedStart, proposedEnd]
    const startOfDay = new Date(proposedStart);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(proposedStart);
    endOfDay.setHours(23, 59, 59, 999);

    const existingInterviews = await Interview.find({
      scheduledAt: { $gte: startOfDay, $lt: endOfDay },
      status: { $ne: 'cancelled' }
    });

    const hasOverlap = existingInterviews.some(interview => {
      const existingStart = new Date(interview.scheduledAt);
      const existingEnd = new Date(existingStart.getTime() + interview.duration * 60000);
      
      // Overlap condition: proposed starts before existing ends AND proposed ends after existing starts
      return proposedStart < existingEnd && proposedEnd > existingStart;
    });

    if (hasOverlap) {
      return NextResponse.json({ error: 'Time slot is already booked.' }, { status: 409 });
    }

    // Create the interview
    const interview = new Interview({
      application: new mongoose.Types.ObjectId(applicationId),
      candidate: new mongoose.Types.ObjectId(candidateId),
      job: new mongoose.Types.ObjectId(jobId),
      scheduledAt: proposedStart,
      duration,
      locationType: locationType || 'video',
      status: 'scheduled'
    });

    await interview.save();

    return NextResponse.json(interview, { status: 201 });

  } catch (error: any) {
    console.error('Create interview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
