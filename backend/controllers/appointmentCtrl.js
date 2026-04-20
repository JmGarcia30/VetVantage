// Booking slots, double-booking checks
import Appointment from '../models/Appointment.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { petId, date, timeSlot, reason } = req.body;

    // The Logic: Prevent Double Booking
    const isBooked = await Appointment.findOne({ date, timeSlot, status: { $ne: 'Cancelled' } });
    
    if (isBooked) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      owner: req.user._id,
      pet: petId,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};

// @desc    Get appointments (Staff see all, Owners see their own)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    let appointments;

    // Populate pulls in the actual data from the referenced Pet and User models
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('pet', 'name species breed')
        .populate('owner', 'name contactNumber')
        .sort({ date: 1 }); // Sort chronologically
    } else {
      appointments = await Appointment.find({ owner: req.user._id })
        .populate('pet', 'name species')
        .sort({ date: 1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};