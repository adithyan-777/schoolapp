const express = require('express');
const {
  registerUser,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { authMiddleware, hasRole } = require('../middlewares/authMiddleware');
const { userSchema, updateUserSchema } = require('../schema/userSchema');
const validateSchema = require('../middlewares/validateSchema');
const { objectIdSchema } = require('../schema/paramSchemas');

const router = express.Router();

// POST route for user registration
router.post('/', authMiddleware, validateSchema(userSchema), registerUser);

router.get('/', authMiddleware, hasRole(['SuperAdmin']), getAllUsers);

// Get user by ID (SuperAdmin or SchoolAdmin for their school only)
router.get(
  '/:id',
  authMiddleware,
  hasRole(['SuperAdmin', 'SchoolAdmin']),
  validateSchema(objectIdSchema, 'params'),
  getUserById,
);

router.put(
  '/:id',
  authMiddleware,
  hasRole(['SuperAdmin']),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateUserSchema),
  updateUser,
);

router.delete(
  '/:id',
  authMiddleware,
  hasRole(['SuperAdmin', 'SchoolAdmin']),
  validateSchema(objectIdSchema, 'params'),
  deleteUser,
);

module.exports = router;
