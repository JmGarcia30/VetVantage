// Inventory API routes
import express from 'express';
import { getInventory, deductStock, addItem } from '../controllers/inventoryCtrl.js';
import { protect } from '../middleware/authMiddleware.js';
import { staffOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, staffOnly, getInventory)
  .post(protect, staffOnly, addItem)
  .put(protect, staffOnly, deductStock);

export default router;