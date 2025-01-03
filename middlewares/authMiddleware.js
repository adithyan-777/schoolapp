const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger

// Middleware to authenticate the user
const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    // logger.warn(token);
    if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
    token = token.replace('Bearer ', '');
    // logger.warn(token);
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
// const hasRole = (allowedRoles) => {
//   return (req, res, next) => {
//     logger.warn(JSON.stringify(req.user));
//     if (!allowedRoles.includes(req.user.role)) {
//       logger.warn(
//         `Unauthorized attempt by user ${req.user.email} with role ${req.user.role}`,
//       );
//       return res.status(403).json({
//         message: `Only users with one of the following roles can access this route: ${allowedRoles.join(', ')}`,
//       });
//     }
//     logger.info(
//       `User ${req.user.email} authorized with role: ${req.user.role}`,
//     );
//     next();
//   };
// };
const validateUserAccess = (allowedRoles, modelName) => {
  return async (req, res, next) => {
    logger.warn(JSON.stringify(req.user));

    // First check roles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized attempt by user ${req.user.email} with role ${req.user.role}`,
      );
      return res.status(403).json({
        message: `Only users with one of the following roles can access this route: ${allowedRoles.join(', ')}`,
      });
    }

    // If SuperAdmin, proceed
    if (req.user.role === 'SuperAdmin') {
      logger.info(
        `SuperAdmin ${req.user.email} authorized with role: ${req.user.role}`,
      );
      return next();
    }

    // For SchoolAdmin, check school access
    if (req.user.role === 'SchoolAdmin') {
      const resourceId = req.params.id;

      // For list routes (no specific ID), add school filter
      if (!resourceId) {
        req.query.school = req.user.school;
        logger.info(
          `SchoolAdmin ${req.user.email} authorized for ${modelName} list with school filter`,
        );
        return next();
      }

      try {
        // Get the resource and check school
        const Model = mongoose.model(modelName);
        const resource = await Model.findById(resourceId);

        if (!resource) {
          logger.warn(`${modelName} with ID ${resourceId} not found`);
          return res.status(404).json({ message: `${modelName} not found` });
        }

        if (resource.school.toString() !== req.user.school.toString()) {
          logger.warn(
            `SchoolAdmin ${req.user.email} attempted to access ${modelName} from different school`,
          );
          return res.status(403).json({ message: 'Access denied' });
        }

        logger.info(
          `SchoolAdmin ${req.user.email} authorized for ${modelName} with ID ${resourceId}`,
        );
        next();
      } catch (error) {
        logger.error(`Error checking school access: ${error.message}`);
        next(error);
      }
    }
  };
};

const getRedirectUrlForSchoolAdmin = (originalUrl, schoolId) => {
  const redirectionRules = {
    '/api/schools': `/api/schools/${schoolId}`,
    '/api/students': `/api/students/school/${schoolId}`,
  };

  return Object.keys(redirectionRules).find((route) =>
    originalUrl.startsWith(route),
  )
    ? redirectionRules[originalUrl.split('?')[0]] // Handle query strings gracefully
    : null;
};

// Middleware for redirection based on SchoolAdmin role
const schoolAdminRedirect = (req, res, next) => {
  if (req.user.role === 'SchoolAdmin') {
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
