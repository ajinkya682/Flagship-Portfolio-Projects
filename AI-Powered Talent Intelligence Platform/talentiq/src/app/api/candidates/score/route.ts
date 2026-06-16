import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import pdfParse from 'pdf-parse';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function POST(req: Request) {
  try {
    const { resumeUrl, job } = await req.json();

    if (!resumeUrl || !job) {
      return NextResponse.json({ error: 'resumeUrl and job are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // 1. Get the PDF buffer
    let pdfBuffer: Buffer;
    if (resumeUrl.startsWith('/uploads/')) {
      // Local file
      const filePath = join(process.cwd(), 'public', resumeUrl);
      pdfBuffer = await readFile(filePath);
    } else {
      // Remote file
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error('Failed to fetch resume file');
      const arrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    }

    // 2. Parse the PDF text
    let resumeText = '';
    try {
      const data = await pdfParse(pdfBuffer);
      resumeText = data.text;
    } catch (e) {
      console.error("PDF Parsing error:", e);
      throw new Error("Could not parse text from the uploaded PDF.");
    }

    // 3. Setup Gemini AI
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert technical recruiter and AI talent intelligence system.
Analyze the following Candidate Resume against the Job Description and return a JSON evaluation.

Job Title: ${job.title}
Job Department: ${job.department}
Job Description:
${job.description}

Candidate Resume:
${resumeText}

Please evaluate the candidate and output raw JSON ONLY, without markdown backticks. Return the JSON in exactly this schema:
{
  "aiScore": number, // 0 to 100 representing how well the candidate matches the job
  "strengths": string[], // 3-5 key strengths or matching qualifications
  "gaps": string[], // 1-3 missing skills or areas of concern
  "extractedSkills": string[] // A list of all relevant skills found in the resume
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });

    let text = response.text || '';
    
    // Clean up potential markdown blocks if Gemini ignored the prompt instructions
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      throw new Error("AI returned invalid JSON.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Score error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
