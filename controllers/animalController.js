// Controller for animal CRUD operations and filters
const Animal = require('../models/Animal');
const {verifyAuth} = require('../middleware/authMiddleware'); // Required authentication before access

// Create new animal record
exports.createAnimal = async (req, res) => {
    try {
        // Ensure required fields
        const { name, breed, age, rescue_type } = req.body;
        if (!name || !breed || !age || !rescue_type) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        // Save new animal
        const newAnimal = new Animal(req.body);
        await newAnimal.save();
        res.status(201).json({ status: 'success', message: 'Animal added successfully', data: newAnimal });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Retrieve all animals or filter based on query
exports.getAnimals = async (req, res) => {
    try {
        // Display 10 entries at a time
        let filter = {};
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter for rescue types
        if (req.query.rescue_type) {
            const rescueTypes = {
                "Water Rescue": ["Labrador Retriever", "Chesapeake Bay Retriever", "Newfoundland"],
                "Mountain/Wilderness Rescue": ["German Shepherd", "Alaskan Malamute", "Old English Sheepdog", "Siberian Husky", "Rottweiler"],
                "Disaster/Tracking": ["Doberman Pinscher", "German Shepherd", "Golden Retriever", "Bloodhound", "Rottweiler"]
            };
            filter.breed = { $in: rescueTypes[req.query.rescue_type] || [] };
        }

        const animals = await Animal.find(filter).skip(skip).limit(limit).populate('rescuer');
        res.json({ status: 'success', count: animals.length, data: animals });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Retrieve single animal by ID
exports.getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ status: 'error', message: 'Animal not found' });

        res.json({ status: 'success', data: animal });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Update animal record by ID
exports.updateAnimal = async (req, res) => {
    try {
        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAnimal) return res.status(404).json({ status: 'error', message: 'Animal not found' });

        res.json({ status: 'success', message: 'Animal updated successfully', data: updatedAnimal });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Delete an animal record by ID
exports.deleteAnimal = async (req, res) => {
    try {
        const deletedAnimal = await Animal.findByIdAndDelete(req.params.id);
        if (!deletedAnimal) return res.status(404).json({ status: 'error', message: 'Animal not found' });

        res.json({ status: 'success', message: 'Animal deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
