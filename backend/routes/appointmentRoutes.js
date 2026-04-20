// Appointment API routes
import express from 'express';
import { createAppointment, getAppointments } from '../controllers/appointmentCtrl.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAppointments);

export default router;