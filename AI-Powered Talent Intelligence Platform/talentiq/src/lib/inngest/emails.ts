import { inngest } from './client'
import prisma from '@/lib/prisma'
import { sendApplicationReceivedEmail, sendInterviewInviteEmail } from '@/lib/email'

export const sendApplicationReceivedEmailJob = inngest.createFunction(
  { id: 'send-app-received-email', triggers: [{ event: 'app/application.submitted' }] },
  async ({ event, step }) => {
    const { applicationId } = event.data

    const application = await step.run('fetch-application', async () => {
      return prisma.application.findUnique({
        where: { id: applicationId },
        include: { candidate: true, job: true }
      })
    })

    if (!application) return { error: 'Application not found' }

    await step.run('send-email', async () => {
      await sendApplicationReceivedEmail(
        application.candidate.email,
        `${application.candidate.firstName} ${application.candidate.lastName}`,
        application.job.title
      )
    })

    return { success: true }
  }
)

export const sendInterviewInviteEmailJob = inngest.createFunction(
  { id: 'send-interview-invite-email', triggers: [{ event: 'app/interview.scheduled' }] },
  async ({ event, step }) => {
    const { applicationId, interviewDate } = event.data

    const application = await step.run('fetch-application', async () => {
      return prisma.application.findUnique({
        where: { id: applicationId },
        include: { candidate: true, job: true }
      })
    })

    if (!application) return { error: 'Application not found' }

    await step.run('send-email', async () => {
      await sendInterviewInviteEmail(
        application.candidate.email,
        `${application.candidate.firstName} ${application.candidate.lastName}`,
        application.job.title,
        new Date(interviewDate)
      )
    })

    return { success: true }
  }
)
