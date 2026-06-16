import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import connectToDatabase from '@/core/database/mongoose';
import { Job } from '@/core/database/models/Job';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Detects file MIME type from URL extension.
 */
function getMimeType(url: string): string {
  const clean = url.toLowerCase().split('?')[0];
  if (clean.endsWith('.docx') || clean.endsWith('.doc')) return 'docx';
  return 'application/pdf'; // default to PDF
}

/**
 * For DOCX: extract raw text using mammoth.
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

/**
 * Fetches the resume file from a URL and returns it as a base64 string + mimeType.
 * PDFs are returned as base64 (sent directly to Gemini).
 * DOCX files are returned as extracted text.
 */
async function fetchResumeData(resumeUrl: string): Promise<
  | { mode: 'pdf'; base64: string; mimeType: 'application/pdf' }
  | { mode: 'text'; text: string }
> {
  console.log('[score] Fetching resume from:', resumeUrl);
  const response = await fetch(resumeUrl);
  if (!response.ok) {
    throw new Error(`Could not download resume (HTTP ${response.status}). Check the file URL.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = getMimeType(resumeUrl);

  if (mimeType === 'docx') {
    console.log('[score] File type: DOCX — extracting text with mammoth...');
    const text = await extractDocxText(buffer);
    return { mode: 'text', text };
  }

  // PDF: encode as base64 for Gemini's native PDF understanding
  console.log('[score] File type: PDF — encoding as base64 for Gemini...');
  const base64 = buffer.toString('base64');
  return { mode: 'pdf', base64, mimeType: 'application/pdf' };
}

// ── Main route ────────────────────────────────────────────────────────────────

/**
 * POST /api/candidates/score
 *
 * Accepts { resumeUrl, job } — sends the resume + job description to Gemini
 * in a single call and returns:
 *   aiScore, skillsMatch, experienceMatch, educationMatch, keywordsMatch,
 *   strengths[], gaps[], reasons[], extractedSkills[], extractedCompanies[], extractedEducation[]
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeUrl, job, jobId } = body;

    if (!resumeUrl) {
      return NextResponse.json({ error: 'resumeUrl is required' }, { status: 400 });
    }
    if (!job && !jobId) {
      return NextResponse.json({ error: 'job or jobId is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured in .env' }, { status: 500 });
    }

    // Load job from DB if only jobId was given
    let jobData = job;
    if (!jobData && jobId) {
      await connectToDatabase();
      jobData = await Job.findById(jobId).lean();
      if (!jobData) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
    }

    // ── Step 1: Fetch & prepare resume ────────────────────────────────────
    const resumeData = await fetchResumeData(resumeUrl);
    console.log('[score] Resume ready. Mode:', resumeData.mode);

    // ── Step 2: Build Gemini prompt ───────────────────────────────────────
    const requirements = Array.isArray(jobData.requirements) ? jobData.requirements : [];
    const skills = Array.isArray(jobData.skills) ? jobData.skills : [];

    const systemPrompt = `You are an expert AI recruiter and talent intelligence system.
Your task is to analyze a candidate's resume against a job description and return a detailed JSON evaluation.

JOB DETAILS:
- Title: ${jobData.title}
- Department: ${jobData.department || 'Not specified'}
- Description: ${jobData.description}
- Required Skills: ${skills.length > 0 ? skills.join(', ') : 'See description'}
- Requirements: ${requirements.length > 0 ? requirements.join('; ') : 'See description'}

Analyze the resume provided and return ONLY valid JSON in this exact schema:
{
  "score": <integer 0-100, overall match>,
  "skillsMatch": <integer 0-100, how well skills match>,
  "experienceMatch": <integer 0-100, how well experience matches>,
  "educationMatch": <integer 0-100, how well education matches>,
  "keywordsMatch": <integer 0-100, keyword alignment>,
  "strengths": [<string>, ...],
  "gaps": [<string>, ...],
  "reasons": [
    { "text": <string>, "positive": <boolean> },
    ...
  ],
  "extractedSkills": [<string>, ...],
  "extractedCompanies": [<string>, ...],
  "extractedEducation": [<string>, ...]
}

Rules:
- strengths: 3-5 specific strengths from the resume
- gaps: 1-3 specific gaps or missing qualifications
- reasons: 3-5 specific reasons for the score (mix of positive and negative)
- extractedSkills: all technical and soft skills found in the resume
- extractedCompanies: companies the candidate has worked at
- extractedEducation: degrees and institutions found`;

    // ── Step 3: Call Gemini ───────────────────────────────────────────────
    console.log('[score] Calling Gemini AI...');
    const ai = new GoogleGenAI({ apiKey });

    let contents: any;

    if (resumeData.mode === 'pdf') {
      // Send PDF directly as inline data — Gemini reads the actual PDF content
      contents = [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: resumeData.mimeType,
                data: resumeData.base64,
              },
            },
          ],
        },
      ];
    } else {
      // DOCX: send extracted text
      if (!resumeData.text || resumeData.text.trim().length < 50) {
        return NextResponse.json(
          { error: 'Could not extract enough text from the DOCX file. Please try a PDF.' },
          { status: 422 }
        );
      }
      contents = `${systemPrompt}\n\nRESUME TEXT:\n${resumeData.text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score:           { type: Type.INTEGER },
            skillsMatch:     { type: Type.INTEGER },
            experienceMatch: { type: Type.INTEGER },
            educationMatch:  { type: Type.INTEGER },
            keywordsMatch:   { type: Type.INTEGER },
            strengths:       { type: Type.ARRAY, items: { type: Type.STRING } },
            gaps:            { type: Type.ARRAY, items: { type: Type.STRING } },
            reasons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text:     { type: Type.STRING },
                  positive: { type: Type.BOOLEAN },
                },
                required: ['text', 'positive'],
              },
            },
            extractedSkills:    { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedEducation: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['score', 'skillsMatch', 'experienceMatch', 'educationMatch', 'keywordsMatch', 'strengths', 'gaps', 'reasons', 'extractedSkills', 'extractedCompanies', 'extractedEducation'],
        },
      },
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response. Please try again.');
    }

    // ── Step 4: Parse and return ───────────────────────────────────────────
    let parsed: any;
    try {
      parsed = JSON.parse(response.text);
    } catch {
      console.error('[score] Failed to parse Gemini JSON:', response.text?.substring(0, 200));
      throw new Error('Gemini returned invalid JSON. Please try again.');
    }

    console.log('[score] ✅ Success! Overall score:', parsed.score, '| Skills found:', parsed.extractedSkills?.length ?? 0);

    return NextResponse.json({
      aiScore:            parsed.score           ?? 0,
      skillsMatch:        parsed.skillsMatch      ?? 0,
      experienceMatch:    parsed.experienceMatch  ?? 0,
      educationMatch:     parsed.educationMatch   ?? 0,
      keywordsMatch:      parsed.keywordsMatch    ?? 0,
      strengths:          parsed.strengths        ?? [],
      gaps:               parsed.gaps             ?? [],
      reasons:            parsed.reasons          ?? [],
      extractedSkills:    parsed.extractedSkills    ?? [],
      extractedCompanies: parsed.extractedCompanies ?? [],
      extractedEducation: parsed.extractedEducation ?? [],
    });
  } catch (error: any) {
    console.error('[score] ❌ Error:', error?.message || error);
    if (error?.message?.includes('API_KEY') || error?.status === 400 || error?.message?.includes('invalid')) {
      console.error('[score] ⚠️  Check your GEMINI_API_KEY in .env — get a valid key at https://aistudio.google.com/app/apikey');
    }
    return NextResponse.json(
      { error: error.message || 'AI analysis failed. Please check server logs.' },
      { status: 500 }
    );
  }
}
