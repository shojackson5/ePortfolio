const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library for hashing passwords

// Define User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,  // Ensures case-insensitive queries
        minlength: [3, "Username must be at least 3 characters"],
        match: [/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"] // Alphanumeric validation
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    }
}, {
    timestamps: true  // Add timestamp
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Only hash if modified
    this.password = await bcrypt.hash(this.password, 10);  // Hash with bcrypt
    next();
});

// Compare passwords securely
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
