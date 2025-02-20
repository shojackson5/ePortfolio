require('dotenv').config();  // Load environment variables

// Import required modules
const mongoose = require('./config/db');  // Import MongoDB connection
const express = require('express');
const cors = require('cors');  // Enables Cross-Origin Resource Sharing
const morgan = require('morgan');  // Logs HTTP requests in the console

// Import route handlers
const authRoutes = require('./routes/authRoutes');  
const animalRoutes = require('./routes/animalRoutes');  

// Initialize Express application
const app = express();

// Middleware Setup
app.use(express.json());  // Parses incoming JSON requests
app.use(cors());  // Enables cross-origin requests from the frontend
app.use(morgan('dev'));  // Logs HTTP requests

// Define API routes
app.use('/api/auth', authRoutes);  // User authentication routes
app.use('/api/animals', animalRoutes);  // Shelter data routes

// Set up server to listen on specified PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
