// middlewares/checkRole.js
const User = require('../models/User');

const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userId).populate('roles');
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