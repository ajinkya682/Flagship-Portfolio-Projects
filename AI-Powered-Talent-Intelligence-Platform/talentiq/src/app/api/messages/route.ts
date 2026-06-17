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

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { candidateId, senderId, text, time } = body;

    if (!candidateId || !text) {
      return NextResponse.json({ error: 'Candidate ID and text are required' }, { status: 400 });
    }

    const message = await Message.create({
      candidateId,
      senderId: senderId || 'me',
      text,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    return NextResponse.json({
      id: message._id.toString(),
      candidateId: message.candidateId,
      senderId: message.senderId,
      text: message.text,
      time: message.time,
      createdAt: message.createdAt,
    });
  } catch (error: any) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
