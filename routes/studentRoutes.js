const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  authMiddleware,
  schoolAdminRedirect,
  validateUserAccess,
} = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const { schoolSchema } = require('../schema/schoolSchema');
const {
  objectIdSchema,
  schoolIdSchema,
  schoolClassroomIdSchema,
} = require('../schema/paramSchemas');
const {
  updateStudentSchema,
  studentSchema,
} = require('../schema/studentSchemas');

// Define routes for student-related operations
router.post(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(studentSchema),
  studentController.createStudent,
); // Create student
router.get(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  schoolAdminRedirect,
  studentController.getAllStudents,
); // Get all students
router.get(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(objectIdSchema, 'params'),
  studentController.getStudentById,
); // Get student by ID
router.get(
  '/school/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(objectIdSchema, 'params'),
  studentController.getStudentsBySchoolId,
);
router.get(
  '/school/:schoolId/classroom/:classroomId',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(schoolClassroomIdSchema, 'params'),
  studentController.getStudentsBySchoolAndClassroom,
);
router.put(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateStudentSchema),
  studentController.updateStudent,
); // Update student
router.delete(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Student'),
  validateSchema(objectIdSchema, 'params'),
  studentController.deleteStudent,
); // Delete student

module.exports = router;
