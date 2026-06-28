import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  // If app password env vars are not set, log the email instead of throwing an error
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('\n====== NO SMTP CONFIGURATION ======');
    console.warn(`Simulating email to: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(`Body: ${html}`);
    console.warn('===================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"TalentIQ" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email via nodemailer:', error);
    throw error;
  }
};
