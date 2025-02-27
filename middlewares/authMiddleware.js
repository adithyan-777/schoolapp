const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger
const mongoose = require('mongoose');

// Middleware to authenticate the user
const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
    token = token.replace('Bearer ', '');
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

const validateUserAccess = (allowedRoles, modelName) => {
  const validateSchoolAccess = async (req, resource) => {
    const userSchoolId = req.user.school?.toString();
    const resourceSchoolId =
      modelName === 'School'
        ? resource._id.toString()
        : resource.school?.toString();

    if (userSchoolId !== resourceSchoolId) {
      logger.warn(
        `SchoolAdmin ${req.user.email} attempted to access ${modelName} from a different school. User School: ${userSchoolId}, Resource School: ${resourceSchoolId}`,
      );
      return false;
    }
    return true;
  };

  return async (req, res, next) => {
    try {
      logger.debug(`User Info: ${JSON.stringify(req.user)}`);

      // SuperAdmin Bypass
      if (req.user.role === 'SuperAdmin') {
        logger.info(
          `SuperAdmin ${req.user.email} granted access to ${modelName}`,
        );
        return next();
      }

      // Check if the user has a school ID
      if (!req.user.school) {
        logger.warn(
          `User ${req.user.email} with role ${req.user.role} attempted access without a school ID`,
        );
        return res
          .status(403)
          .json({ message: 'Access denied: User has no assigned school' });
      }

      // Role Validation
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Unauthorized access attempt by ${req.user.email} with role ${req.user.role}`,
        );
        return res.status(403).json({
          message: `Access denied. Allowed roles: ${allowedRoles.join(', ')}`,
        });
      }

      // SchoolAdmin-Specific Checks
      if (req.user.role === 'SchoolAdmin') {
        const { method, body, params, query } = req;

        // For POST requests, validate school ownership
        if (method === 'POST' && body.school) {
          const userSchoolId = req.user.school?.toString();
          if (body.school.toString() !== userSchoolId) {
            logger.warn(
              `SchoolAdmin ${req.user.email} attempted to create ${modelName} for another school`,
            );
            return res.status(403).json({
              message: 'You can only create entities for your assigned school',
            });
          }
          logger.info(
            `SchoolAdmin ${req.user.email} authorized to create ${modelName}`,
          );
          return next();
        }

        // For GET/PUT/DELETE requests with a specific resource ID
        if (params.id) {
          const Model = mongoose.model(modelName);
          const resource = await Model.findById(params.id);

          if (!resource) {
            logger.warn(`${modelName} with ID ${params.id} not found`);
            return res.status(404).json({ message: `${modelName} not found` });
          }

          if (!(await validateSchoolAccess(req, resource))) {
            return res.status(403).json({ message: 'Access denied' });
          }
          logger.info(
            `SchoolAdmin ${req.user.email} authorized to access ${modelName} with ID ${params.id}`,
          );
          return next();
        }

        // For list routes (no specific ID), apply school filter
        if (!params.id) {
          query.school = req.user.school;
          logger.info(
            `SchoolAdmin ${req.user.email} authorized for ${modelName} list with school filter`,
          );
          return next();
        }
      }

      // If no conditions matched, proceed with default behavior
      logger.warn(`Unhandled access case for ${req.user.email}`);
      return res.status(403).json({ message: 'Access denied' });
    } catch (error) {
      logger.error(`Error in validateUserAccess middleware: ${error.message}`);
      next(error);
    }
  };
};

const getRedirectUrlForSchoolAdmin = (originalUrl, id) => {
  const redirectionRules = {
    '/api/schools': `/api/schools/${id}`,
    '/api/students': `/api/students/school/${id}`,
  };

  return Object.keys(redirectionRules).find((route) =>
    originalUrl.startsWith(route),
  )
    ? redirectionRules[originalUrl.split('?')[0]] // Handle query strings gracefully
    : null;
};

// Middleware for redirection based on SchoolAdmin role
const schoolAdminRedirect = (req, res, next) => {
  if (req.user.role === 'SchoolAdmin' && req.params) {
    logger.info(JSON.stringify(req.user));

    const redirectUrl = getRedirectUrlForSchoolAdmin(
      req.originalUrl,
      req.user.school,
    );

    if (redirectUrl) {
      logger.info(
        `Redirecting SchoolAdmin (${req.user.email}) to: ${redirectUrl}`,
      );
      return res.redirect(redirectUrl);
    }
  }
  next();
};

module.exports = { authMiddleware, validateUserAccess, schoolAdminRedirect };
