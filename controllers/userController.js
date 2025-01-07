const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler'); // Import asyncHandler utility
const AppError = require('../utils/appError'); // Import AppError class

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, school, createdBy } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    throw new AppError('Name, email, password, and role are required.', 400);
  }

  // Check for duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists.', 400);
  }

  // Only SuperAdmin can assign a school to a SchoolAdmin
  // if (role === 'SchoolAdmin' && !school) {
  //   throw new AppError('School is required for SchoolAdmin role.', 400);
  // }

  // Create user
  const newUser = new User({
    name,
    email,
    password,
    role,
    school,
    createdBy: req.user?._id,
  });
  await newUser.save();

  res.status(201).json({
    message: 'User created successfully.',
    user: { id: newUser._id, email: newUser.email },
  });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('school createdBy', 'name email');
  res.status(200).json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate(
    'school createdBy',
    'name email',
  );
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  res.status(200).json(user);
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Get the user ID from request parameters
  const updates = req.body; // Get the updated fields from request body

  // Validate if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
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
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ message: 'User deleted successfully' });
});

// Export all functions at the end
module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
