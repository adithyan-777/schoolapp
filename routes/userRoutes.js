const express = require('express');
const { registerUser, getAllUsers, deleteUser, getUserById, updateUser } = require('../controllers/userController');
const {authMiddleware, hasRole } = require('../middlewares/authMiddleware');
const router = express.Router();


// POST route for user registration
router.post('/', registerUser);

router.get('/', authMiddleware, hasRole(['SuperAdmin']), getAllUsers);

// Get user by ID (SuperAdmin or SchoolAdmin for their school only)
router.get('/:id', authMiddleware, hasRole(['SuperAdmin', 'SchoolAdmin']), getUserById);

router.put('/:id', authMiddleware, hasRole(['SuperAdmin']), updateUser);

router.delete('/:id', authMiddleware, hasRole(['SuperAdmin', 'SchoolAdmin']), deleteUser);

module.exports = router;
