const Animal = require('../models/animalModel'); // Import animalModel with data schema

// Create new animal
exports.createAnimal = async (req, res) => {
  try {
    const animal = new Animal(req.body); // Create new Animal instance 
    await animal.save(); // Save animal to database
    res.status(201).json(animal); // Return saved animal with 201 Created status
  } catch {
    res.status(400).json({message: 'Error creating animal. Please verify correct input.'}); // Error message for create function
  }
};

// Retrieve animals with filters
exports.getAnimals = async (req, res) => {
  try {
    const filters = req.query; // Retrieve filters from the query parameters
    const animals = await Animal.find(filters); // Find animals matching filter
    res.status(200).json(animals); // Retrieve animals with 200 OK status
  } catch {
    res.status(500).json({message: 'Error retrieving. Please try again.'}); // Error message for retrieve function
  }
};

// Update animal by ID
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {new: true}); // Update animal
    if (!animal) return res.status(404).json({message: 'Animal not found. Please verify correct animal ID and try again.'}); // Error message animal ID not found
    res.status(200).json(animal); // Return updated animal with 200 OK status
  } catch {
    res.status(400).json({message: 'Error updating. Please verify and try again.'}); // Error message for update function
  }
};

// Delete animal by ID
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id); // Delete the animal by its ID
    if (!animal) return res.status(404).json({message: 'Animal not found. Please verify correct animal ID and try again.'}); // Error message animal ID not found
    res.status(200).json({message: 'Animal deleted successfully.'}); // Successful delete message
  } catch {
    res.status(500).json({message: 'Error deleting. Please verify correct animal ID and try again.'}); // Error message for delete function
  }
};
