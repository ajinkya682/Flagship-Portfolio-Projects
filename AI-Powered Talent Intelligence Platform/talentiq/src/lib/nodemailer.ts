import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
  // If SMTP env vars are not set, log the email instead of throwing an error to prevent breaking demo environments
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('\n====== NO SMTP CONFIGURATION ======');
    console.warn(`Simulating email to: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(`Body: ${html}`);
    console.warn('===================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"TalentIQ" <${process.env.SMTP_USER}>`,
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
