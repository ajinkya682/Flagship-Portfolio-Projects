import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');
const FROM_EMAIL = 'TalentIQ <onboarding@resend.dev>'; // Should be a verified domain in production

export async function sendApplicationReceivedEmail(candidateEmail: string, candidateName: string, roleTitle: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: candidateEmail,
      subject: `Application Received: ${roleTitle}`,
      html: `
        <div>
          <h1>Hi ${candidateName},</h1>
          <p>We've successfully received your application for the <strong>${roleTitle}</strong> position.</p>
          <p>Our team will review your application and get back to you shortly.</p>
          <p>Best,<br/>The Hiring Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendInterviewInviteEmail(candidateEmail: string, candidateName: string, roleTitle: string, interviewDate: Date) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: candidateEmail,
      subject: `Interview Invitation: ${roleTitle}`,
      html: `
        <div>
          <h1>Hi ${candidateName},</h1>
          <p>We'd love to invite you to an interview for the <strong>${roleTitle}</strong> position.</p>
          <p>Your interview is scheduled for: <strong>${interviewDate.toLocaleString()}</strong></p>
          <p>We will send you a calendar invite with the video link shortly.</p>
          <p>Best,<br/>The Hiring Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send interview email:', error);
  }
}
