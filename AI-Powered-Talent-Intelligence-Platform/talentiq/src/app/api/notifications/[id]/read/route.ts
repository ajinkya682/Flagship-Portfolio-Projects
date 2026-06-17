import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Notification } from '@/core/database/models/Notification';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.cookies.get('accessToken')?.value || 
              req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;

    if (id === 'all') {
      // Mark all as read for the specific user
      await Notification.updateMany({ recipientUserId: decoded.userId }, { isRead: true });
      return NextResponse.json({ success: true });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientUserId: decoded.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error marking notification read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
