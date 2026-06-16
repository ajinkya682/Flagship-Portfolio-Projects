import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Message } from '@/core/database/models/Message';
import { Candidate } from '@/core/database/models/Candidate';

export async function GET() {
  try {
    await connectToDatabase();

    // Find all distinct candidateIds that have messages
    const distinctCandidateIds = await Message.distinct('candidateId');

    if (!distinctCandidateIds.length) {
      return NextResponse.json([]);
    }

    // Fetch candidate info for each
    const candidates = await Candidate.find({
      _id: { $in: distinctCandidateIds },
    }).select('_id name email avatar');

    // For each candidate, get the last message
    const contacts = await Promise.all(
      candidates.map(async (candidate) => {
        const lastMessage = await Message.findOne({
          candidateId: candidate._id.toString(),
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: candidate._id.toString(),
          name: candidate.name,
          email: candidate.email,
          avatar: candidate.avatar || null,
          lastMessageText: lastMessage ? lastMessage.text : '',
          lastMessageTime: lastMessage ? lastMessage.time : '',
          lastMessageSender: lastMessage ? lastMessage.senderId : '',
          lastMessageAt: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    // Sort by most recent message first
    contacts.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('Fetch contacts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
