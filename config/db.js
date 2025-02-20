const mongoose = require('mongoose');
require('dotenv').config();  // Load variables from .env file

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);  // Exit if connection fails
    }
};

// Connect to MongoDB
connectDB();
module.exports = mongoose;