import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Offer } from '@/core/database/models/Offer';
import { Candidate } from '@/core/database/models/Candidate';
import { Job } from '@/core/database/models/Job';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch offers and populate candidate and job
    const offers = await Offer.find()
      .populate('candidate', 'name email role avatar stage')
      .populate('job', 'title department')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const { candidateId, jobId, amount, equity } = body;
    
    if (!candidateId || !amount) {
      return NextResponse.json({ error: 'Candidate and amount are required' }, { status: 400 });
    }

    // Since we may not have an explicit application ID in the frontend yet, 
    // let's grab the candidate and use their applicationId if present, 
    // or create a dummy object ID for application to satisfy the schema temporarily.
    // The schema requires 'application', 'candidate', 'job', 'salary', 'startDate', 'expirationDate', 'letterContent'
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const offerJobId = jobId || (candidate as any).job;

    const newOffer = new Offer({
      application: (candidate as any).applicationId || candidate._id, // fallback if no explicit application
      candidate: candidate._id,
      job: offerJobId,
      salary: typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g,"")) : amount,
      currency: 'USD',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default start date in 2 weeks
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'draft',
      letterContent: `We are pleased to offer you the position. Base salary: $${amount}. Equity: ${equity || '0'}%.`,
      sentAt: new Date()
    });

    await newOffer.save();

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
