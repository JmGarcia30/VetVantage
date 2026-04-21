// Vets adding clinical notes
import Record from '../models/Record.js';

// Add a new clinical note
export const addRecord = async (req, res) => {
  try {
    const { petId, diagnosis, treatment, notes } = req.body;
    
    const record = await Record.create({
      pet: petId,
      diagnosis,
      treatment,
      notes
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create record', error: error.message });
  }
};

// Retrieve all clinical notes
export const getRecords = async (req, res) => {
  try {
    const records = await Record.find().populate('pet', 'name species');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
};