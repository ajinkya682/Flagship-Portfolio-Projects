import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Notification } from '@/core/database/models/Notification';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (id === 'all') {
      // Mark all as read
      await Notification.updateMany({}, { isRead: true });
      return NextResponse.json({ success: true });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error marking notification read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
