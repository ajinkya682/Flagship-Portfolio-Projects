import { ai } from '@/lib/gemini';
import { Type, Schema } from '@google/genai';

// Accept both Mongoose IJob documents and plain job objects from frontend/DB
interface JobLike {
  title: string;
  department?: string;
  description: string;
  requirements: string[];
  skills: string[];
}

export async function scoreCandidateWithGemini(resumeText: string, job: JobLike) {
  try {
    // Defensive: ensure arrays exist even if job has incomplete data
    const requirements = Array.isArray(job.requirements) ? job.requirements : [];
    const skills = Array.isArray(job.skills) ? job.skills : [];

    const prompt = `
      You are an expert technical recruiter evaluating a candidate for the following job:
      Job Title: ${job.title}
      Department: ${job.department || 'Not specified'}
      Description: ${job.description}
      Required Skills: ${skills.length > 0 ? skills.join(', ') : 'Not specified'}
      Requirements: ${requirements.length > 0 ? requirements.join(', ') : 'Not specified'}
      
      Candidate's Resume:
      ${resumeText}
      
      Based on this resume, evaluate the candidate against the job requirements.
      Score each category from 0 to 100. Be fair and accurate.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Overall score from 0 to 100" },
        skillsMatch: { type: Type.INTEGER, description: "Score for skills match from 0 to 100" },
        experienceMatch: { type: Type.INTEGER, description: "Score for experience match from 0 to 100" },
        educationMatch: { type: Type.INTEGER, description: "Score for education match from 0 to 100" },
        keywordsMatch: { type: Type.INTEGER, description: "Score for keyword match from 0 to 100" },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of the candidate's strengths for this role"
        },
        gaps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of gaps or missing qualifications"
        },
        reasons: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              positive: { type: Type.BOOLEAN }
            },
            required: ["text", "positive"]
          },
          description: "Specific reasons for the score, marking each as positive or negative"
        }
      },
      required: ["score", "skillsMatch", "experienceMatch", "educationMatch", "keywordsMatch", "strengths", "gaps", "reasons"],
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
    console.error('[candidate-scorer] Gemini scoring error:', error?.message || error);
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('INVALID_ARGUMENT')) {
      console.error('[candidate-scorer] ⚠️  Gemini API key may be invalid. Check GEMINI_API_KEY in .env — it should start with "AIza".');
    }
    // Return a default low score on error to indicate failure
    return {
      score: 0,
      skillsMatch: 0,
      experienceMatch: 0,
      educationMatch: 0,
      keywordsMatch: 0,
      strengths: [],
      gaps: ['AI analysis failed — please use the Rescore button after verifying the Gemini API key'],
      reasons: [{ text: 'AI Analysis Failed', positive: false }],
      scoredAt: new Date()
    };
  }
}
