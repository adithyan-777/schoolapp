const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger
const AppError = require('../utils/appError')
const asyncHandler = require("../utils/asyncHandler")

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

    logger.debug(`Login attempt with email: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(`User not found with this email: ${email}`, 404, true))
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError(`Invalid credentials`, 400, true))
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info(`User logged in successfully: ${email}`);

    res.json({ token });
});

module.exports = { login };
