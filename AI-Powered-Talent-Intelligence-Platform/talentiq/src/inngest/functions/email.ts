import { inngest } from '../client';
import { sendEmail } from '@/lib/nodemailer';

export const sendUrgentEmail = inngest.createFunction(
  { 
    id: 'send-urgent-email', 
    name: 'Send Urgent Email',
    triggers: [{ event: 'email/send.urgent' }]
  },
  async ({ event, step }) => {
    const { to, subject, html } = event.data;

    await step.run('send-email', async () => {
      await sendEmail({ to, subject, html });
    });

    return { success: true, to, type: 'urgent' };
  }
);

export const sendStandardEmail = inngest.createFunction(
  { 
    id: 'send-standard-email', 
    name: 'Send Standard Email',
    concurrency: {
      limit: 1, // Send one by one as requested
    },
    triggers: [{ event: 'email/send.standard' }]
  },
  async ({ event, step }) => {
    const { to, subject, html } = event.data;

    await step.run('send-email', async () => {
      await sendEmail({ to, subject, html });
    });

    return { success: true, to, type: 'standard' };
  }
);
