const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, school, createdBy } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Only SuperAdmin can assign a school to a SchoolAdmin
    if (role === 'SchoolAdmin' && !school) {
      return res.status(400).json({ message: 'School is required for SchoolAdmin role.' });
    }

    // Create user
    const newUser = new User({ name, email, password, role, school, createdBy: req.user?._id });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.', user: newUser._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('school createdBy', 'name email');
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('school createdBy', 'name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id; // Get the user ID from request parameters
  const updates = req.body; // Get the updated fields from request body

  try {
    // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Update the user with the new data
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key]; // Update only the fields provided in the request
    });

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'Internal server error',
      details: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting user' });
  }
};


module.exports = { registerUser, getAllUsers, getUserById, deleteUser, updateUser};

