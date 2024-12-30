const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { hasRole } = require('../middlewares/authMiddleware'); // Middleware to check roles



// Create a new teacher (Accessible by SuperAdmin only)
router.post('/', hasRole(['SuperAdmin', 'SchoolAdmin']), teacherController.createTeacher);

// Get all teachers (Accessible by everyone)
router.get('/', teacherController.getAllTeachers);

// Get a teacher by ID (Accessible by everyone)
router.get('/:id', teacherController.getTeacherById);

// Update teacher information (Accessible by SuperAdmin, SchoolAdmin, or the Teacher themselves)
router.put('/:id', hasRole(['SuperAdmin', 'SchoolAdmin', 'Teaacher']),
  teacherController.updateTeacher
);

// Delete a teacher (Accessible by SuperAdmin and SchoolAdmin)
router.delete('/:id', hasRole(['SuperAdmin', 'SchoolAdmin']),
  teacherController.deleteTeacher
);

module.exports = router;
