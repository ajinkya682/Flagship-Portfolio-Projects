import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Message } from '@/core/database/models/Message';
import { Candidate } from '@/core/database/models/Candidate';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const candidateId = searchParams.get('candidateId');

    if (!candidateId) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

    const messages = await Message.find({ candidateId, companyId: candidate.companyId }).sort({ createdAt: 1 });

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
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

    await Message.deleteMany({ candidateId, companyId: candidate.companyId });

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
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });

    const message = await Message.create({
      companyId: candidate.companyId,
      candidateId,
      senderId: senderId || 'me',
      text,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    if (senderId === 'candidate') {
      const { Notification } = await import('@/core/database/models/Notification');
      await Notification.create({
        recipientUserId: 'all',
        companyId: candidate.companyId,
        type: 'candidate_message',
        title: 'New Message from Candidate',
        message: `${candidate.name} sent you a message.`,
        candidateId: candidate._id,
        linkHref: `/applications/${candidateId}`,
      });
    }

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
