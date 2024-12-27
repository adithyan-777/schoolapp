const express = require('express');
const { registerUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// POST route for user registration
router.post('/register', registerUser);
// Admin routes
// router.post('/', authMiddleware(['SuperAdmin', 'SchoolAdmin']), createUser);

module.exports = router;