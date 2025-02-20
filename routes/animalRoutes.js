const express = require('express');
const { verifyAuth } = require('../middleware/authMiddleware');
const {
    createAnimal,
    getAnimals,
    getAnimalById,
    updateAnimal,
    deleteAnimal
} = require('../controllers/animalController');

const router = express.Router();

router.post('/', verifyAuth, createAnimal);
router.get('/', verifyAuth, getAnimals);
router.get('/:id', verifyAuth, getAnimalById);
router.put('/:id', verifyAuth, updateAnimal);
router.delete('/:id', verifyAuth, deleteAnimal);

module.exports = router;
