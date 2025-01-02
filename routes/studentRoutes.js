const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  hasRole,
  authMiddleware,
  schoolAdminRedirect,
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
  // hasRole(['SuperAdmin', 'SchoolAdmin']),
  validateSchema(studentSchema),
  studentController.createStudent,
); // Create student
router.get(
  '/',
  authMiddleware,
  schoolAdminRedirect,
  studentController.getAllStudents,
); // Get all students
router.get(
  '/:id',
  authMiddleware,
  validateSchema(objectIdSchema, 'params'),
  studentController.getStudentById,
); // Get student by ID
router.get(
  '/school/:id',
  authMiddleware,
  validateSchema(objectIdSchema, 'params'),
  studentController.getStudentsBySchoolId,
);
router.get(
  '/school/:schoolId/classroom/:classroomId',
  authMiddleware,
  validateSchema(schoolClassroomIdSchema, 'params'),
  studentController.getStudentsBySchoolAndClassroom,
);
router.put(
  '/:id',
  authMiddleware,
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateStudentSchema),
  studentController.updateStudent,
); // Update student
router.delete(
  '/:id',
  // hasRole(['SuperAdmin', 'SchoolAdmin']),
  authMiddleware,
  validateSchema(objectIdSchema, 'params'),
  studentController.deleteStudent,
); // Delete student

module.exports = router;
