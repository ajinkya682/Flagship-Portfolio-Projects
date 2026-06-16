import { ai } from '@/lib/gemini';
import { Type, Schema } from '@google/genai';
import { IJob } from '@/core/database/models/Job';

export async function scoreCandidateWithGemini(resumeText: string, job: IJob) {
  try {
    const prompt = `
      You are an expert technical recruiter evaluating a candidate for the following job:
      Job Title: ${job.title}
      Description: ${job.description}
      Requirements: ${job.requirements.join(', ')}
      Skills needed: ${job.skills.join(', ')}
      
      Candidate's Resume:
      ${resumeText}
      
      Based on this resume, evaluate the candidate against the job requirements.
      Score each category from 0 to 100. Provide a detailed analysis.
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
      model: 'gemini-1.5-pro',
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
  } catch (error) {
    console.error('Gemini scoring error:', error);
    // Return a default low score on error to indicate failure
    return {
      score: 0,
      skillsMatch: 0,
      experienceMatch: 0,
      educationMatch: 0,
      keywordsMatch: 0,
      strengths: [],
      gaps: ['Failed to analyze resume due to AI error'],
      reasons: [{ text: 'AI Analysis Failed', positive: false }],
      scoredAt: new Date()
    };
  }
}
