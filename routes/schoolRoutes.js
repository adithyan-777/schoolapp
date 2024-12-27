const express = require('express');
const router = express.Router();
const { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } = require('../controllers/schoolController');
const { authMiddleware, hasRole } = require('../middlewares/authMiddleware');

// Create a new school - SuperAdmin only
router.post('/', authMiddleware, hasRole(['SuperAdmin']), createSchool);

// Get all schools - accessible by everyone
router.get('/', getAllSchools);

// Get a specific school by ID - accessible by everyone
router.get('/:id', getSchoolById);

// Update a school - SuperAdmin or SchoolAdmin only
router.put('/:id', authMiddleware, hasRole(['SuperAdmin', 'SchoolAdmin']), updateSchool);

// Delete a school - SuperAdmin or SchoolAdmin only
router.delete('/:id', authMiddleware, hasRole(['SuperAdmin', 'SchoolAdmin']), deleteSchool);

module.exports = router;
