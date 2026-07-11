import { Router } from 'express';
import { validatePreparednessBody } from '../middleware/validation.js';
import { createPreparedness } from '../controllers/preparednessController.js';

const router = Router();

router.post('/preparedness-plan', validatePreparednessBody, createPreparedness);

export default router;
