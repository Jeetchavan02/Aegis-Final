const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_for_viva';

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token') || req.headers.authorization?.split(' ')[1];

    // Check if no token
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, username }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
