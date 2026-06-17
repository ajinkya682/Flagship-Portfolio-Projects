import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { HireLetter } from '@/core/database/models/HireLetter';
import { Application } from '@/core/database/models/Application';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { signature, action } = body; // action: 'sign' | 'reject'

    const hireLetter = await HireLetter.findById(id);
    if (!hireLetter) {
      return NextResponse.json({ error: 'Hire letter not found' }, { status: 404 });
    }

    if (hireLetter.status !== 'sent') {
      return NextResponse.json({ error: 'Hire letter is not in a signable state' }, { status: 400 });
    }

    if (action === 'sign') {
      if (!signature || !signature.trim()) {
        return NextResponse.json({ error: 'Signature is required to accept' }, { status: 400 });
      }

      hireLetter.status = 'signed';
      hireLetter.signatureData = signature;
      hireLetter.signedAt = new Date();
      await hireLetter.save();

      // Update application stage to Hired + timeline
      await Application.findByIdAndUpdate(hireLetter.applicationId, {
        stage: 'Hired',
        $push: {
          timeline: {
            event: `Hire letter signed by candidate — officially hired!`,
            date: new Date(),
            type: 'hired',
          },
        },
      });

      return NextResponse.json({ success: true, status: 'signed' });
    } else if (action === 'reject') {
      hireLetter.status = 'rejected';
      await hireLetter.save();

      // Timeline event
      await Application.findByIdAndUpdate(hireLetter.applicationId, {
        $push: {
          timeline: {
            event: `Candidate declined the hire letter`,
            date: new Date(),
            type: 'stage_change',
          },
        },
      });

      return NextResponse.json({ success: true, status: 'rejected' });
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "sign" or "reject"' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing hire letter signature:', error);
    return NextResponse.json({ error: 'Failed to process hire letter' }, { status: 500 });
  }
}
