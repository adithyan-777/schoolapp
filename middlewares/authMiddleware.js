const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
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

// Check if the user is a SuperAdmin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    logger.warn(`Unauthorized attempt to access SuperAdmin route by user: ${req.user.email}`);
    return res.status(403).json({ message: 'Only SuperAdmin can create a school' });
  }
  logger.info(`User ${req.user.email} authorized as SuperAdmin`);
  next();
};

// Check if the user is a SchoolAdmin
const isSchoolAdmin = (req, res, next) => {
  if (req.user.role !== 'SchoolAdmin') {
    logger.warn(`Unauthorized attempt to access SchoolAdmin route by user: ${req.user.email}`);
    return res.status(403).json({ message: 'Only SchoolAdmin can update the school' });
  }
  logger.info(`User ${req.user.email} authorized as SchoolAdmin`);
  next();
};

module.exports = { authMiddleware, isSuperAdmin, isSchoolAdmin };

