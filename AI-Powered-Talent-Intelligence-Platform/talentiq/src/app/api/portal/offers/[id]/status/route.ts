import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Offer } from '@/core/database/models/Offer';
import { Application } from '@/core/database/models/Application';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const offerId = params.id;
    const body = await req.json();
    const { status } = body;

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const offer = await Offer.findById(offerId);
    
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Verify this offer belongs to the authenticated candidate
    if (offer.candidate.toString() !== decoded.candidateId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update offer status
    offer.status = status;
    await offer.save();

    const application = await Application.findById(offer.application).populate('candidate').populate('job');
    
    if (application) {
      const candidate = application.candidate as any;
      const job = application.job as any;

      if (status === 'accepted') {
        application.stage = 'Hired';
        application.timeline.push({
          event: `Offer accepted by candidate`,
          date: new Date(),
          type: 'offer_accepted',
        });
        
        // Notify recruiter
        const { Notification } = await import('@/core/database/models/Notification');
        await Notification.create({
          recipientUserId: 'all',
          companyId: application.companyId,
          type: 'offer_accepted',
          title: 'Offer Accepted!',
          message: `${candidate?.name || 'A candidate'} has accepted the offer for ${job?.title || 'the job'}.`,
          candidateId: candidate?._id,
          applicationId: application._id,
          offerId: offer._id,
          linkHref: '/pipeline',
        });
      } else if (status === 'declined') {
        application.timeline.push({
          event: `Offer declined by candidate`,
          date: new Date(),
          type: 'offer_declined',
        });

        // Notify recruiter
        const { Notification } = await import('@/core/database/models/Notification');
        await Notification.create({
          recipientUserId: 'all',
          companyId: application.companyId,
          type: 'offer_declined',
          title: 'Offer Declined',
          message: `${candidate?.name || 'A candidate'} has declined the offer.`,
          candidateId: candidate?._id,
          applicationId: application._id,
          offerId: offer._id,
          linkHref: '/pipeline',
        });
      }
      await application.save();
    }

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error('Update offer status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
