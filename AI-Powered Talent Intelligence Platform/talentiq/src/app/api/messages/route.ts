import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Message } from '@/core/database/models/Message';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    const messages = await Message.find({ candidateId }).sort({ createdAt: 1 });

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      candidateId: msg.candidateId,
      senderId: msg.senderId,
      text: msg.text,
      time: msg.time,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json(formattedMessages);
  } catch (error: any) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    await Message.deleteMany({ candidateId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
