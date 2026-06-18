export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Template } from '@/core/database/models/Template';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded;
    try {
      decoded = verifyAccessToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const templates = await Template.find({ companyId: decoded.companyId }).sort({ createdAt: -1 });

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Fetch templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded;
    try {
      decoded = verifyAccessToken(token) as any;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, subject, body: templateBody } = body;

    const newTemplate = await Template.create({
      companyId: decoded.companyId,
      name,
      type,
      subject,
      body: templateBody,
      isActive: true
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error: any) {
    console.error('Create template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
