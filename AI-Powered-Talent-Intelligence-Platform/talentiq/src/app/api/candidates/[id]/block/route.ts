import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Candidate } from '@/core/database/models/Candidate';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const body = await req.json();
    const { isBlocked } = body;

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, isBlocked: candidate.isBlocked });
  } catch (error: any) {
    console.error('Block candidate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
