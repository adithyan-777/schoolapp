const express = require('express');
const {
  registerUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const {
  authMiddleware,
  validateUserAccess,
} = require('../middlewares/authMiddleware');
const { userSchema, updateUserSchema } = require('../schema/userSchema');
const validateSchema = require('../middlewares/validateSchema');
const { objectIdSchema } = require('../schema/paramSchemas');

const router = express.Router();

// POST route for user registration
router.post(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'User'),
  validateSchema(userSchema),
  registerUser,
);

router.get(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin'], 'User'),
  getAllUsers,
);

// Get user by ID (SuperAdmin or SchoolAdmin for their school only)
router.get(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'User'),
  validateSchema(objectIdSchema, 'params'),
  getUserById,
);

router.put(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'User'),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateUserSchema),
  updateUser,
);

router.delete(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin'], 'User'),
  validateSchema(objectIdSchema, 'params'),
  deleteUser,
);

module.exports = router;
