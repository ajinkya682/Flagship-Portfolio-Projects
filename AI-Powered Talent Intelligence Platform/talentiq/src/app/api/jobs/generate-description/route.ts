import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function POST(req: Request) {
  try {
    // Auth Check
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      verifyAccessToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { title, department, type } = body;

    if (!title || !department || !type) {
      return NextResponse.json({ error: 'Title, department, and type are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Write a professional, modern, and engaging job description for the following position.
Title: ${title}
Department: ${department}
Employment Type: ${type}

The description should include:
1. A brief overview of the role and its impact.
2. 3-5 key responsibilities.
3. 3-5 key requirements or qualifications.

CRITICAL INSTRUCTIONS FOR FORMATTING:
- Do NOT include the Title, Department, or Employment Type at the top of the description. Start directly with the overview.
- Do NOT use any Markdown formatting whatsoever (no **, no #, no *, no _, etc).
- Use raw, simple plain text only.
- For bullet points, use a simple hyphen (-) and a space.
- Keep the tone enthusiastic but professional.
- Keep it concise, around 150-200 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error('No text generated from Gemini');
    }

    return NextResponse.json({ description: text });
  } catch (error: any) {
    console.error('Job generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
