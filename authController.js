const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user and hash password (handled in User model)
        const user = new User({ username, password });
        await user.save();

        // Log for troubleshooting
        console.log(`User registered: ${JSON.stringify(user, null, 2)}`);

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: err.message });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Log for troubleshooting
        console.log(`Attempting to login: ${username}`);

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Log for troubleshooting
        console.log(`User found: ${JSON.stringify(user, null, 2)}`);

        // Compare password with stored hashed
        const isMatch = await user.comparePassword(password);

        // Log for troubleshooting
        console.log(`Comparing input password: ${password}`);
        console.log(`Stored hashed password: ${user.password}`);
        console.log(`Password Match: ${isMatch}`);

        if (!isMatch) {
            console.log('Password does not match!');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: err.message });
    }
};
