import { NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';

/**
 * GET /api/debug/gemini-test
 * Tests if the Gemini API key is working correctly.
 * Remove this endpoint after verification.
 */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'GEMINI_API_KEY is not set in .env' 
    }, { status: 500 });
  }

  // Check key format — valid Google AI Studio keys start with "AIza"
  const keyPreview = `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;
  const looksValid = apiKey.startsWith('AIza');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say "API key works!" in 5 words or less.',
    });

    return NextResponse.json({
      status: 'success',
      keyPreview,
      looksValid,
      response: response.text,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      keyPreview,
      looksValid,
      error: error.message,
      details: error?.errorDetails || error?.status || 'unknown',
    }, { status: 500 });
  }
}
