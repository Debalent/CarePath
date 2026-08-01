import { config } from '../config/env';
import { logger } from '../config/logger';

// SES is optional — if SES_FROM_EMAIL isn't set, log only (useful for local/pilot dev)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sesClient: any = null;

if (config.sesFromEmail) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SESv2Client } = require('@aws-sdk/client-sesv2');
  sesClient = new SESv2Client({ region: config.sesRegion });
}

export type SendEmailOptions = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
};

export const sendEmail = async ({ to, subject, body, replyTo }: SendEmailOptions): Promise<void> => {
  if (!sesClient) {
    logger.info('[EMAIL DRY-RUN]', { to, subject, body });
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SendEmailCommand } = require('@aws-sdk/client-sesv2');
    await sesClient.send(new SendEmailCommand({
      FromEmailAddress: config.sesFromEmail,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: body } },
        },
      },
    }));
    logger.info('Email sent', { to, subject });
  } catch (err) {
    logger.error('Email send failed', { to, subject, err });
    throw err;
  }
};
