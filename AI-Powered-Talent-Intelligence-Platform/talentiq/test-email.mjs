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

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"TalentIQ" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email',
      html: '<h1>Test</h1>',
    });
    console.log('Success:', info);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
