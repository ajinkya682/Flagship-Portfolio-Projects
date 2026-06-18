import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Offer } from '@/core/database/models/Offer';
import { HireLetter } from '@/core/database/models/HireLetter';
import { Application } from '@/core/database/models/Application';
import { Job } from '@/core/database/models/Job';
import { Company } from '@/core/database/models/Company';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    console.log('Ensure Company is loaded:', Company.modelName);

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const offer = await Offer.findOne({ _id: id, companyId: decoded.companyId }).populate({
      path: 'job',
      populate: { path: 'company' }
    });
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    if (offer.hireLetterSent) {
      return NextResponse.json({ error: 'Hire letter already sent for this offer' }, { status: 400 });
    }

    let application = await Application.findById(offer.application);
    if (!application) {
      // Fallback: If offer.application was set to candidate._id by mistake or doesn't exist
      application = await Application.findOne({ candidate: offer.candidate }).sort({ createdAt: -1 });
    }

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const jobDoc = offer.job as any;
    const jobTitle = jobDoc?.title || 'Role';
    const companyName = jobDoc?.company?.name || 'Your Company';

    // Create a new HireLetter based on the offer details
    const hireLetter = new HireLetter({
      companyId: decoded.companyId,
      applicationId: application._id,
      candidateId: offer.candidate,
      jobId: jobDoc?._id || offer.job, // Use jobDoc._id explicitly
      companyName: companyName,
      role: jobTitle,
      startDate: offer.startDate || new Date(), // Fallback just in case
      salary: offer.salary,
      currency: offer.currency,
      letterContent: offer.letterContent || `We are pleased to offer you the position of ${jobTitle}.`,
      status: 'sent',
      sentAt: new Date(),
    });

    await hireLetter.save();

    // Mark the offer as having its hire letter sent
    offer.hireLetterSent = true;
    await offer.save();

    // Update the application timeline
    await Application.findByIdAndUpdate(application._id, {
      $push: {
        hireLetterIds: hireLetter._id,
        timeline: {
          event: `Hire letter sent for ${jobTitle}`,
          date: new Date(),
          type: 'hired',
        },
      },
    });

    return NextResponse.json({ success: true, hireLetter });
  } catch (error: any) {
    console.error('Error sending hire letter from offer:', error);
    return NextResponse.json({ error: error.message || 'Failed to send hire letter', stack: error.stack }, { status: 500 });
  }
}
