import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Notification } from '@/core/database/models/Notification';


export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Try to get user from session, fallback to company-wide notifications
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    // Fetch the 30 most recent notifications (sorted newest first)
    // In a real app, filter by recipientUserId from session
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const notification = new Notification({
      recipientUserId: body.recipientUserId || 'all',
      type: body.type,
      title: body.title,
      message: body.message,
      candidateId: body.candidateId,
      applicationId: body.applicationId,
      offerId: body.offerId,
      hireLetterID: body.hireLetterID,
      assignmentId: body.assignmentId,
      linkHref: body.linkHref,
      isRead: false,
    });

    await notification.save();
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
