require("dotenv").config(); // Load environment variables

module.exports = {
    secret: process.env.JWT_SECRET || "your-secret-key",  // JWT_SECRET is set in .env
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",       // Configurable token expiration
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10, // Ensure bcrypt salt rounds are consistent
};