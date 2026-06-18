import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/core/database/mongoose";
import { Signal } from "@/core/database/models/Signal";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      const cookies = req.headers.get('cookie');
      token = cookies?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
      if (!token) {
        token = cookies?.split(';').find(c => c.trim().startsWith('candidateToken='))?.split('=')[1];
      }
    }
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId } = params;
    const since = req.nextUrl.searchParams.get('since');
    
    let query: any = { roomId };
    if (since) {
      query.createdAt = { $gt: new Date(parseInt(since)) };
    }

    const signals = await Signal.find(query).sort({ createdAt: 1 }).lean();

    return NextResponse.json(signals);
  } catch (error: any) {
    console.error("Signal GET error:", error);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      const cookies = req.headers.get('cookie');
      token = cookies?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
      if (!token) {
        token = cookies?.split(';').find(c => c.trim().startsWith('candidateToken='))?.split('=')[1];
      }
    }
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId } = params;
    const { senderId, type, payload } = await req.json();

    if (!senderId || !type || !payload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const signal = new Signal({
      roomId,
      senderId,
      type,
      payload
    });

    await signal.save();

    return NextResponse.json({ success: true, signal });
  } catch (error: any) {
    console.error("Signal POST error:", error);
    return NextResponse.json({ error: "Failed to create signal" }, { status: 500 });
  }
}
