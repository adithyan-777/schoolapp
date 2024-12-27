const jwt = require('jsonwebtoken');
const logger = require('../logger');

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn('Token missing in request');
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // const userstr = JSON.stringify(req.user, null, 4)
        // logger.warn(userstr)
        // logger.info(`User authenticated: ${req.user.id}`);
        next();
    } catch (err) {
        logger.error(`Token verification failed: ${err.message}`);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = checkAuth;
