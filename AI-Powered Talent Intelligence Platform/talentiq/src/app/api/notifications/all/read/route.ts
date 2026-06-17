import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Notification } from '@/core/database/models/Notification';

// Mark ALL notifications as read
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    await Notification.updateMany({}, { isRead: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
