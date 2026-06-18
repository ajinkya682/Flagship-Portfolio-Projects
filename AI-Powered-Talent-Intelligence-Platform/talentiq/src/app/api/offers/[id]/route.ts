import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Offer } from '@/core/database/models/Offer';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const offer = await Offer.findOne({ _id: id, companyId: decoded.companyId });
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    if (status) {
      offer.status = status;
    }

    await offer.save();

    return NextResponse.json({ success: true, offer });
  } catch (error) {
    console.error('Error updating offer:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const offer = await Offer.findOne({ _id: id, companyId: decoded.companyId });
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    await Offer.findOneAndDelete({ _id: id, companyId: decoded.companyId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
