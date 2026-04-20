// Medical notes linked to Pet.js
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The staff member who wrote the record
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    prescriptions: [
      {
        medication: String,
        dosage: String,
        instructions: String,
      }
    ],
    notes: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('Record', recordSchema);
export default Record;