// Billing API routes
import express from 'express';
import { generateBill } from '../controllers/billingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { staffOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, staffOnly, generateBill);

export default router;