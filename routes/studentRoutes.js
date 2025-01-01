const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  hasRole,
  authMiddleware,
  schoolAdminRedirect,
} = require('../middlewares/authMiddleware');

// Define routes for student-related operations
router.post(
  '/',
  authMiddleware,
  hasRole(['SuperAdmin', 'SchoolAdmin']),
  studentController.createStudent,
); // Create student
router.get(
  '/',
  authMiddleware,
  schoolAdminRedirect,
  studentController.getAllStudents,
); // Get all students
router.get('/:id', studentController.getStudentById); // Get student by ID
router.get(
  '/school/:schoolId',
  authMiddleware,
  studentController.getStudentsBySchoolId,
);
router.get(
  '/school/:schoolId/classroom/:classroomId',
  authMiddleware,
  studentController.getStudentsBySchoolAndClassroom,
);
router.put(
  '/:id',
  hasRole(['SuperAdmin', 'SchoolAdmin', 'Teaacher']),
  authMiddleware,
  studentController.updateStudent,
); // Update student
router.delete(
  '/:id',
  hasRole(['SuperAdmin', 'SchoolAdmin']),
  authMiddleware,
  studentController.deleteStudent,
); // Delete student

module.exports = router;
