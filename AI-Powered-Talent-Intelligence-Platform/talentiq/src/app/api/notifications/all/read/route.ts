import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Notification } from '@/core/database/models/Notification';
import { verifyAccessToken } from '@/core/auth/jwt';

// Mark ALL notifications as read for the logged-in user
export async function PATCH(req: NextRequest) {
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

    await Notification.updateMany({ 
      companyId: decoded.companyId,
      recipientUserId: decoded.userId 
    }, { isRead: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
