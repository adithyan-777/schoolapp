const express = require('express');
const router = express.Router();
const { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool } = require('../controllers/schoolController');
const { authMiddleware, isSuperAdmin, isSchoolAdmin } = require('../middlewares/authMiddleware');

// Create a new school - SuperAdmin only
router.post('/', authMiddleware, isSuperAdmin, createSchool);

// Get all schools - accessible by everyone
router.get('/', getAllSchools);

// Get a specific school by ID - accessible by everyone
router.get('/:id', getSchoolById);

// Update a school - SchoolAdmin only
router.put('/:id', authMiddleware, isSchoolAdmin, updateSchool);

// Delete a school - SuperAdmin or SchoolAdmin
router.delete('/:id', authMiddleware, isSuperAdmin, deleteSchool);

module.exports = router;
