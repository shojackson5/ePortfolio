// Routes for user registration and login
const express = require('express');
const { register, login } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// User registration
router.post('/register', [
    check('username', 'Username is required and must be alphanumeric with at least 3 characters')
        .isLength({ min: 3 })
        .isAlphanumeric(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next();  // Pass control to register function in authController
}, register);

// User login
router.post('/login', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next();  // Pass control to login function in authController
}, login);

module.exports = router;
