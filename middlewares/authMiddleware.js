const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger

// Middleware to authenticate the user
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      logger.warn(`User not found with ID: ${decoded.userId}`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    logger.info(`User authenticated: ${user.email} with role: ${user.role}`);
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if the user has one of the allowed roles
const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized attempt by user ${req.user.email} with role ${req.user.role}`);
      return res.status(403).json({ message: `Only users with one of the following roles can access this route: ${allowedRoles.join(', ')}` });
    }
    logger.info(`User ${req.user.email} authorized with role: ${req.user.role}`);
    next();
  };
};

module.exports = { authMiddleware, hasRole };
