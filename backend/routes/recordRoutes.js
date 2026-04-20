// Record API routes
import express from 'express';
import { addMedicalRecord, getRecordsByPet } from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { staffOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, staffOnly, addMedicalRecord);
router.get('/:petId', protect, getRecordsByPet); // Owners can view, but only staff can POST

export default router;