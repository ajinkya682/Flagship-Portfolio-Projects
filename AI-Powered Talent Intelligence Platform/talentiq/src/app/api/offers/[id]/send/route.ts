import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Offer } from '@/core/database/models/Offer';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const offerId = params.id;
    const offer = await Offer.findById(offerId);
    
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    if (offer.status !== 'draft') {
      return NextResponse.json({ error: 'Offer is not in draft state' }, { status: 400 });
    }

    offer.status = 'sent';
    offer.sentAt = new Date();
    await offer.save();

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Send offer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
