import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { sendEmail } from '../services/email.service';
import { config } from '../config/env';

/**
 * POST /api/technical-reports
 * Accepts "report a problem" submissions and emails them to the CarePath team.
 */
export const submitTechnicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      userType,
      pageName,
      issueType,
      problemDescription,
      expectedResult,
      actualResult,
      deviceType,
      browser,
      mayContact,
    } = req.body;

    if (!firstName || !lastName || !email || !issueType || !problemDescription) {
      return next(new AppError('Missing required fields', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Invalid email address', 400));
    }

    const subject = `CarePath Problem Report: ${issueType} - ${firstName} ${lastName}`;
    const body = `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'N/A'}
User type: ${userType || 'N/A'}
Page: ${pageName || 'N/A'}
Issue type: ${issueType}
Device: ${deviceType || 'N/A'}
Browser: ${browser || 'N/A'}
May contact: ${mayContact ? 'Yes' : 'No'}

Problem description:
${problemDescription}

Expected result:
${expectedResult || 'N/A'}

Actual result:
${actualResult || 'N/A'}
    `.trim();

    await sendEmail({ to: config.contactEmail, subject, body, replyTo: email });

    res.status(200).json({
      success: true,
      message: 'Your report has been received. Someone from the CarePath team will follow up soon.',
    });
  } catch (err) {
    next(err);
  }
};
