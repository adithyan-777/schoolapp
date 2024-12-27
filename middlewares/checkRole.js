// middlewares/checkRole.js
const User = require('../models/User');
const logger = require('../logger');

const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            // logger.warn('Token missing in request');
            const userstr = JSON.stringify(req.user, null, 4)
            logger.warn(userstr)
            // logger.warn('User ID from req:', req.user.id);
            const user = await User.findById(req.user.id).populate('roles');
            if (!user) return res.status(404).json({ message: 'User not found' });

            const userRoles = user.roles.map(role => role.name);
            const hasRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRole) return res.status(403).json({ message: 'Access denied: Insufficient permissions' });

            next();
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = checkRole;