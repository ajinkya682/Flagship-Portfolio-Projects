import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Application } from '@/core/database/models/Application';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    // Auth Check
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    
    const application = await Application.findOne({ _id: id, companyId: decoded.companyId });
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (body.stage) {
      application.stage = body.stage;
      application.timeline.push({
        event: `Moved to ${body.stage}`,
        date: new Date(),
        type: 'stage_change',
      });
    }

    if (body.tags !== undefined) {
      application.tags = body.tags;
    }

    await application.save();

    return NextResponse.json({ success: true, stage: application.stage });
  } catch (error: any) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
