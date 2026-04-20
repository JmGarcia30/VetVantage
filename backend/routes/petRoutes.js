// Pet API routes
import express from 'express';
import { addPet, getPets } from '../controllers/petController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Notice how we inject the `protect` middleware before the controller function!
// This ensures that req.user exists before the controller runs.
router.route('/')
  .post(protect, addPet)
  .get(protect, getPets);

export default router;