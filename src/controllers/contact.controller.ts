import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

const CONTACT_EMAIL = 'balentinetechsolutions@gmail.com';

/**
 * POST /api/contact
 * Accepts contact form submissions and logs them.
 * In production, this would send an email via SendGrid / SES / SMTP.
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

    // Build the contact submission payload
    const contactData = {
      to: CONTACT_EMAIL,
      from: email,
      subject: `CarePath Contact Form: ${reason} - ${firstName} ${lastName}`,
      body: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'N/A'}
Reason: ${reason}

Message:
${message}
      `.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Log the submission (in production, send via email service)
    console.log('Contact form submission:', contactData);

    // TODO: Integrate with email service (SendGrid, SES, etc.)
    // Example with SendGrid:
    // await sgMail.send({
    //   to: CONTACT_EMAIL,
    //   from: 'noreply@carepath.com',
    //   replyTo: email,
    //   subject: contactData.subject,
    //   text: contactData.body,
    // });

    res.status(200).json({
      success: true,
      message: 'Your message has been received. Someone from the CarePath team will contact you soon.',
    });
  } catch (err) {
    next(err);
  }
};
