import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
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
  // If OAuth2 env vars are not set, log the email instead of throwing an error
  if (!process.env.EMAIL_USER || !process.env.CLIENT_ID || !process.env.REFRESH_TOKEN) {
    console.warn('\n====== NO SMTP CONFIGURATION ======');
    console.warn(`Simulating email to: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(`Body: ${html}`);
    console.warn('===================================\n');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"TalentIQ" <${process.env.EMAIL_USER}>`,
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
