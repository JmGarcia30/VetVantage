// Vets adding clinical notes
import Record from '../models/Record.js';

export const addMedicalRecord = async (req, res) => {
  try {
    const { petId, diagnosis, treatment, prescriptions, notes } = req.body;

    const record = await Record.create({
      pet: petId,
      vet: req.user._id, // Pulled securely from the auth middleware
      diagnosis,
      treatment,
      prescriptions,
      notes
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save record', error: error.message });
  }
};

export const getRecordsByPet = async (req, res) => {
  try {
    const records = await Record.find({ pet: req.params.petId }).populate('vet', 'name');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
};