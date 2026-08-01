import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { sendEmail } from '../services/email.service';
import { config } from '../config/env';

/**
 * POST /api/contact
 * Accepts contact form submissions and emails them to the CarePath team.
 */
export const submitContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, reason, message } = req.body;

    if (!firstName || !lastName || !email || !reason || !message) {
      return next(new AppError('Missing required fields', 400));
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Invalid email address', 400));
    }

    const subject = `CarePath Contact Form: ${reason} - ${firstName} ${lastName}`;
    const body = `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'N/A'}
Reason: ${reason}

Message:
${message}
    `.trim();

    await sendEmail({ to: config.contactEmail, subject, body, replyTo: email });

    res.status(200).json({
      success: true,
      message: 'Your message has been received. Someone from the CarePath team will contact you soon.',
    });
  } catch (err) {
    next(err);
  }
};

