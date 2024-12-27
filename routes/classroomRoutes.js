const express = require('express');
const { createClassroom, getClassrooms, updateClassroom, deleteClassroom } = require('../controllers/classroomController');
const { authMiddleware, hasRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public: Get all classrooms in a school (anyone can access)
router.get('/:schoolId', getClassrooms);

// Authenticated routes
// Create a classroom (only SchoolAdmin or SuperAdmin can create)
router.post('/', authMiddleware, hasRole(['SchoolAdmin', 'SuperAdmin']), createClassroom);

// Update a classroom (only SchoolAdmin or SuperAdmin can update)
router.put('/:classroomId', authMiddleware, hasRole(['SchoolAdmin', 'SuperAdmin']), updateClassroom);

// Delete a classroom (only SchoolAdmin or SuperAdmin can delete)
router.delete('/:classroomId', authMiddleware, hasRole(['SchoolAdmin', 'SuperAdmin']), deleteClassroom);

module.exports = router;
