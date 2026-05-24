import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
});

export async function sendWelcomeEmail (email, username) {
  const info = await transporter.sendMail({
    from: '"BetterTour" <info@bettertour.com>',
    to: email,
    subject: 'Welcome to BetterTour!',
    text: `Welcome ${username}! We are so happy you joined BetterTour.`,
    html: emailTemplate({
      title: `Welcome, ${username}!`,
      body: `<p>We're so happy you joined BetterTour.</p>
             <p>You can now log in and set up your profile.</p>`
    })
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

export async function sendPasswordRecoveryEmail (email, name, link) {
  const info = await transporter.sendMail({
    from: '"BetterTour" <info@bettertour.com>',
    to: email,
    subject: 'Password Recovery',
    text: `Hi ${name}! Reset your password here: ${link} (valid for 15 minutes)`,
    html: emailTemplate({
      title: `Hi ${name}, reset your password`,
      body: `<p>You requested a password reset. Click the button below to proceed.</p>
             <p style="color:#64748b;font-size:14px;">This link expires in 15 minutes.</p>`,
      buttonText: 'Reset Password',
      buttonUrl: link
    })
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

export async function sendContactEmail (name, email, message) {
  const info = await transporter.sendMail({
    from: '"BetterTour" <info@bettertour.com>',
    to: 'info@bettertour.com',
    replyTo: email,
    subject: `Contact form — ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: emailTemplate({
      title: `Message from ${name}`,
      body: `<p><strong style="color:#f1f5f9;">From:</strong> ${name} &lt;${email}&gt;</p>
             <p style="white-space:pre-wrap;">${message}</p>`
    })
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
