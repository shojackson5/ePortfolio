// Verifies authenication before access 
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyAuth = (req, res, next) => {
    const token = req.header('Authorization');
    // Check for valid token
    if (!token) return res.status(401).json({ message: 'Unauthorized access' });

    try {
        // Check for token expiration
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired, please login again" });
        }
        res.status(401).json({ message: "Invalid token" });
    }
};