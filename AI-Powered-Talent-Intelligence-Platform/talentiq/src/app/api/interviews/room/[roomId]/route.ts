import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/core/database/mongoose";
import { Interview } from "@/core/database/models/Interview";
import { Candidate } from "@/core/database/models/Candidate";
import { Job } from "@/core/database/models/Job";
import { User } from "@/core/database/models/User";
import { verifyAccessToken } from '@/core/auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    await connectToDatabase();

    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      const cookies = req.headers.get('cookie');
      token = cookies?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
      if (!token) {
        const cTokenStr = cookies?.split(';').find(c => c.trim().startsWith('candidateToken=') || c.trim().startsWith('candidate_token='));
        token = cTokenStr?.split('=')[1];
      }
    }
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    const { roomId } = params;

    const interview = await Interview.findById(roomId)
      .populate('candidate', 'name email avatar extractedSkills')
      .populate('job', 'title department location')
      .populate('interviewers', 'name avatar')
      .populate('notes.authorId', 'name avatar')
      .lean();

    if (!interview) {
      return NextResponse.json({ error: "Interview room not found" }, { status: 404 });
    }

    // Verify access
    if (decoded.type === 'candidate') {
      if (interview.candidate?._id?.toString() !== decoded.candidateId) {
        return NextResponse.json({ error: "Unauthorized access to room" }, { status: 403 });
      }
    } else {
      if (interview.companyId?.toString() !== decoded.companyId?.toString()) {
        return NextResponse.json({ error: "Unauthorized access to room" }, { status: 403 });
      }
    }

    return NextResponse.json(interview);
  } catch (error: any) {
    console.error("Room API error:", error);
    return NextResponse.json({ error: "Failed to fetch room details" }, { status: 500 });
  }
}

// Save notes during interview
export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      const cookies = req.headers.get('cookie');
      token = cookies?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
      if (!token) {
        const cTokenStr = cookies?.split(';').find(c => c.trim().startsWith('candidateToken=') || c.trim().startsWith('candidate_token='));
        token = cTokenStr?.split('=')[1];
      }
    }
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    let decoded;
    try { decoded = verifyAccessToken(token) as any; } catch (e) { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }); }

    if (decoded.type === 'candidate') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { roomId } = params;
    const { text } = await req.json();

    const interview = await Interview.findById(roomId);
    if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    interview.notes.push({
      authorId: decoded.userId,
      text,
      timestamp: new Date()
    });

    await interview.save();

    return NextResponse.json({ success: true, notes: interview.notes });
  } catch (err) {
    console.error("Notes save error:", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
