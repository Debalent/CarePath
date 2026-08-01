import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';
import { logger } from '../config/logger';

// Gmail SMTP is optional — if credentials aren't set, log only (useful for local/pilot dev).
// Sending through Google's own servers (vs. a third-party like SES) is required for a
// gmail.com "From" address to pass Gmail's strict DMARC policy and actually be delivered.
let transporter: Transporter | null = null;

if (config.gmailUser && config.gmailAppPassword) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
  });
}

export type SendEmailOptions = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
};

export const sendEmail = async ({ to, subject, body, replyTo }: SendEmailOptions): Promise<void> => {
  if (!transporter) {
    logger.info('[EMAIL DRY-RUN]', { to, subject, body });
    return;
  }

  try {
    await transporter.sendMail({
      from: config.gmailUser,
      to,
      replyTo,
      subject,
      text: body,
    });
    logger.info('Email sent', { to, subject });
  } catch (err) {
    logger.error('Email send failed', { to, subject, err });
    throw err;
  }
};
