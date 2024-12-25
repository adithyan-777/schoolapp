// middlewares/checkAuth.js
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
    // Extract the token from the Authorization header (e.g., "Bearer <token>")
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
        // Verify the token using the secret from your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach decoded data to request object (user's id and roles)
        req.user = decoded;
        
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        // If token verification fails, respond with an error
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = checkAuth;
