import { z } from 'zod'

export const ParseResumeSchema = z.object({
  skills: z.array(z.string()).describe('List of technical and soft skills found in the resume'),
  yearsExperience: z.number().describe('Total years of professional experience'),
  education: z.string().describe('Highest level of education achieved'),
  summary: z.string().describe('A brief 2-3 sentence summary of the candidate'),
})

export const ScoreCandidateSchema = z.object({
  score: z.number().describe('An objective score from 0 to 100 on how well the candidate matches the job description'),
  reasoning: z.string().describe('A 2-3 sentence explanation of the score'),
  strengths: z.array(z.string()).describe('Top 3 strengths of the candidate for this specific role'),
  weaknesses: z.array(z.string()).describe('Potential gaps or weaknesses for this specific role'),
})

export const ProblematicPhraseSchema = z.object({
  phrase: z.string(),
  reason: z.string(),
  suggestion: z.string()
})

export const DetectBiasSchema = z.object({
  biasScore: z.number().describe('A score from 0 to 100 where 100 is completely unbiased and inclusive, and 0 is highly biased.'),
  problematicPhrases: z.array(ProblematicPhraseSchema).describe('List of potentially exclusionary or biased phrases found in the job description'),
  overallFeedback: z.string().describe('General feedback on the inclusivity of the job description')
})

export const SYSTEM_PROMPTS = {
  PARSE_RESUME: `You are an expert technical recruiter and AI resume parser. Your job is to extract structured information from the provided candidate resume text. Be objective and precise.`,
  
  SCORE_CANDIDATE: `You are an expert technical recruiter. You will be provided with a job description and a candidate's resume. Your task is to objectively evaluate the candidate's fit for the role. Be highly critical but fair. Provide a score from 0-100.`,
  
  DETECT_BIAS: `You are a Diversity, Equity, and Inclusion (DEI) expert. Review the provided job description for any biased, exclusionary, or problematic language (e.g., gendered terms, ableist language, unnecessary strict requirements). Provide a bias score and suggest improvements.`
}
