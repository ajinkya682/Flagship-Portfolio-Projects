export const dynamic = "force-dynamic";

import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { parseResumeJob, scoreCandidateJob, biasDetectJob } from '@/lib/inngest/functions'
import { sendApplicationReceivedEmailJob, sendInterviewInviteEmailJob } from '@/lib/inngest/emails'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    parseResumeJob,
    scoreCandidateJob,
    biasDetectJob,
    sendApplicationReceivedEmailJob,
    sendInterviewInviteEmailJob
  ]
})
