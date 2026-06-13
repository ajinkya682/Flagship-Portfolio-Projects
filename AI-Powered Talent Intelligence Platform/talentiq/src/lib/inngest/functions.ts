import { inngest } from './client'
import prisma from '@/lib/prisma'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ParseResumeSchema, ScoreCandidateSchema, DetectBiasSchema, SYSTEM_PROMPTS } from '@/lib/ai/prompts'
const pdfParse = require('pdf-parse')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
})

export const parseResumeJob = inngest.createFunction(
  { id: 'parse-resume', triggers: [{ event: 'app/resume.uploaded' }] },
  async ({ event, step }) => {
    const { applicationId, resumeUrl } = event.data

    // 1. Download Resume PDF
    const resumeText = await step.run('download-and-parse-pdf', async () => {
      try {
        const response = await fetch(resumeUrl)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const data = await pdfParse(buffer)
        return data.text
      } catch (err) {
        console.error('Failed to parse PDF:', err)
        return ''
      }
    })

    if (!resumeText) {
      return { error: 'Could not extract text from resume' }
    }

    // 2. Analyze with OpenAI
    const parsedData = await step.run('analyze-resume', async () => {
      // @ts-ignore
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.PARSE_RESUME },
          { role: 'user', content: `Extract the requested information from this candidate's resume:\n\n${resumeText.substring(0, 8000)}` },
        ],
        response_format: zodResponseFormat(ParseResumeSchema, 'resume_parsing'),
      })
      
      return completion.choices[0].message.parsed
    })

    // 3. Save to database
    await step.run('update-application', async () => {
      await prisma.application.update({
        where: { id: applicationId },
        data: { resumeParsed: true } // We should ideally save the parsed data somewhere, maybe in a JSON column or MongoDB
      })
    })

    return { parsedData }
  }
)

export const scoreCandidateJob = inngest.createFunction(
  { id: 'score-candidate', triggers: [{ event: 'app/candidate.score' }] },
  async ({ event, step }) => {
    const { applicationId, jobId } = event.data

    // Fetch Job and Application data
    const { job, application } = await step.run('fetch-data', async () => {
      const app = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { candidate: true }
      })
      const jb = await prisma.job.findUnique({
        where: { id: jobId }
      })
      return { job: jb, application: app }
    }) as { job: any; application: any }

    if (!job || !application) return { error: 'Not found' }

    // Mock fetching resume text (in a real app, this would be fetched from DB or parsed again)
    const resumeText = `${application.candidate.firstName} ${application.candidate.lastName}'s resume text...`

    const aiResult = await step.run('score-with-ai', async () => {
      // @ts-ignore
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.SCORE_CANDIDATE },
          { role: 'user', content: `Job Description:\n${job.description}\n\nCandidate Resume:\n${resumeText}` },
        ],
        response_format: zodResponseFormat(ScoreCandidateSchema, 'candidate_scoring'),
      })
      return completion.choices[0].message.parsed
    })

    if (!aiResult) return { error: 'AI scoring failed' }

    await step.run('save-score', async () => {
      await prisma.application.update({
        where: { id: applicationId },
        data: { aiScore: aiResult.score, aiScoreComputedAt: new Date() }
      })
    })

    // TODO: Send Pusher event to frontend to update UI in real-time

    return { aiResult }
  }
)

export const biasDetectJob = inngest.createFunction(
  { id: 'detect-bias', triggers: [{ event: 'app/job.bias.detect' }] },
  async ({ event, step }) => {
    const { jobId, description } = event.data

    const aiResult = await step.run('scan-bias', async () => {
      // @ts-ignore
      const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.DETECT_BIAS },
          { role: 'user', content: `Job Description:\n${description}` },
        ],
        response_format: zodResponseFormat(DetectBiasSchema, 'bias_detection'),
      })
      return completion.choices[0].message.parsed
    })

    if (!aiResult) return { error: 'AI scan failed' }

    await step.run('save-bias-check', async () => {
      // Safe stringify for JSON column
      const biasCheckResults = JSON.parse(JSON.stringify({
        problematicPhrases: aiResult.problematicPhrases,
        overallFeedback: aiResult.overallFeedback
      }))

      await prisma.job.update({
        where: { id: jobId },
        data: { biasCheckScore: aiResult.biasScore, biasCheckResults }
      })
    })

    return { aiResult }
  }
)
