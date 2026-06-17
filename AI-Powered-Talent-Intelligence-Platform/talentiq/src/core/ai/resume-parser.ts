import { ai } from '@/lib/gemini';
import { Type, Schema } from '@google/genai';

export async function parseResumeWithGemini(resumeText: string) {
  try {
    const prompt = `
      You are an expert technical recruiter. Extract the following information from the provided resume text.
      Return the output strictly in the requested JSON schema.
      
      Resume text:
      ${resumeText}
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        skills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of technical and soft skills extracted from the resume.",
        },
        companies: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of companies the candidate has worked for.",
        },
        education: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of educational institutions and degrees.",
        },
      },
      required: ["skills", "companies", "education"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    if (!response.text) {
      throw new Error('No content returned from Gemini API');
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('[resume-parser] Gemini parsing error:', error?.message || error);
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('INVALID_ARGUMENT')) {
      console.error('[resume-parser] ⚠️  Gemini API key may be invalid. Check GEMINI_API_KEY in .env — it should start with "AIza".');
    }
    // Return empty fallback on failure
    return { skills: [], companies: [], education: [] };
  }
}
