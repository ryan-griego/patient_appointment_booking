// email.actions.ts

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string; // Optional: For HTML formatted emails
}

export const sendEmailNotification = async (message: EmailMessage) => {
  try {
    const msg: sgMail.MailDataRequired = {
      to: message.to,
      from: process.env.SENDGRID_SENDER_EMAIL!, // Verified sender
      subject: message.subject,
      text: message.text,
      html: message.html || undefined,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${message.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error; // Rethrow if you want to handle it upstream
  }
}
