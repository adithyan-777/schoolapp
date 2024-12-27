const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const logger = require('../utils/logger'); // Import the logger

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log the login attempt
    logger.debug(`Login attempt with email: ${email}`);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info(`User logged in successfully: ${email}`);

    res.json({ token });
  } catch (err) {
    // Log the error
    logger.error(`Error during login: ${err.message}`);

    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };
