// Add/edit/view pet profiles
import Pet from '../models/Pet.js';

// @desc    Register a new pet for the logged-in user
// @route   POST /api/pets
export const addPet = async (req, res) => {
  try {
    const { name, species, breed, age, weight } = req.body;

    // Create the pet and link it to the user making the request (req.user._id comes from the protect middleware)
    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      weight,
      owner: req.user._id, 
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add pet', error: error.message });
  }
};

// @desc    Get all pets for the logged-in user (Owners see theirs, Staff see all)
// @route   GET /api/pets
export const getPets = async (req, res) => {
  try {
    let pets;

    // If the user is staff or admin, fetch every pet in the database and include the owner's name
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      pets = await Pet.find().populate('owner', 'name email contactNumber');
    } else {
      // If the user is an owner, only fetch pets linked to their specific ID
      pets = await Pet.find({ owner: req.user._id });
    }

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pets', error: error.message });
  }
};