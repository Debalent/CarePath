import { Router } from 'express';
import { submitTechnicalReport } from '../controllers/technicalReport.controller';
import { sanitizeBody } from '../middleware/validate';

const router = Router();

router.use(sanitizeBody);

router.post('/', submitTechnicalReport);

export default router;
