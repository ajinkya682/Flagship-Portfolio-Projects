export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Message } from '@/core/database/models/Message';
import { Candidate } from '@/core/database/models/Candidate';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const requestedCandidateId = url.searchParams.get('candidateId');

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let decoded;
    try {
      decoded = verifyAccessToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find all distinct candidateIds that have messages for this company
    const distinctCandidateIds = await Message.distinct('candidateId', { companyId: decoded.companyId });

    // If requestedCandidateId is present but not in distinct list, we still want to fetch them
    const candidateIdsToFetch = new Set<string>(distinctCandidateIds.map(id => id.toString()));
    if (requestedCandidateId) {
      candidateIdsToFetch.add(requestedCandidateId);
    }

    if (candidateIdsToFetch.size === 0) {
      return NextResponse.json([]);
    }

    // Fetch candidate info for each
    const candidates = await Candidate.find({
      _id: { $in: Array.from(candidateIdsToFetch) },
      companyId: decoded.companyId,
    }).select('_id name email avatar isBlocked');

    // For each candidate, get the last message
    const contacts = await Promise.all(
      candidates.map(async (candidate) => {
        const lastMessage = await Message.findOne({
          candidateId: candidate._id.toString(),
          companyId: decoded.companyId,
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          id: candidate._id.toString(),
          name: candidate.name,
          email: candidate.email,
          avatar: candidate.avatar || null,
          isBlocked: candidate.isBlocked || false,
          lastMessageText: lastMessage ? lastMessage.text : '',
          lastMessageTime: lastMessage ? lastMessage.time : '',
          lastMessageSender: lastMessage ? lastMessage.senderId : '',
          lastMessageAt: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    // Sort by most recent message first, but keep requestedCandidateId at top if they have no messages
    contacts.sort((a, b) => {
      if (requestedCandidateId) {
        if (a.id === requestedCandidateId && !a.lastMessageAt) return -1;
        if (b.id === requestedCandidateId && !b.lastMessageAt) return 1;
      }
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
