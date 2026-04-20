// Inventory API routes
import express from 'express';
import { getInventory, deductStock } from '../controllers/inventoryCtrl.js';
import { protect } from '../middleware/authMiddleware.js';
import { staffOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, staffOnly, getInventory)
  .put(protect, staffOnly, deductStock);

export default router;