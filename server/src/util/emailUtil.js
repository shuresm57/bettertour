import nodemailer from 'nodemailer';

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
    html: `<p>Welcome, ${username}!</p><p>We're so happy you joined BetterTour. You can now log in and set up your profile.</p>`
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
    html: `<p>Hi ${name}, reset your password</p><p>You requested a password reset. <a href="${link}">Click here to proceed</a> (expires in 15 minutes).</p>`
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
    html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message}</p>`
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
