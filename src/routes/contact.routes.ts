import { Router } from 'express';
import { submitContactForm } from '../controllers/contact.controller';
import { sanitizeBody } from '../middleware/validate';

const router = Router();

router.use(sanitizeBody);

router.post('/', submitContactForm);

export default router;
