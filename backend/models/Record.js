// Medical notes linked to Pet.js
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
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
    notes: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Record', recordSchema);