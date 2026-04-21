// Record API routes
import express from 'express';
import { addRecord, getRecords } from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { staffOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

// Only staff can view and add medical records
router.route('/')
  .post(staffOnly, addRecord)
  .get(staffOnly, getRecords);

export default router;