// Links to User.js (owner)
import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String, // e.g., Dog, Cat, Bird
      required: true,
    },
    breed: {
      type: String,
    },
    age: {
      type: Number, // Stored in years or months depending on your preference
    },
    weight: {
      type: Number, // Stored in kg
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This creates the relational link to the User model
      required: true,
    },
    medicalHistory: [
      {
        type: String, // A simple array of strings for quick notes, or we can expand this later
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);
export default Pet;