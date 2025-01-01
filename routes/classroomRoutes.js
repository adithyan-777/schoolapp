const express = require('express');
const {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');
const { authMiddleware, hasRole } = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const { classroomSchema, updateClassroomSchema } = require('../schema/classroomSchemas');
const { schoolIdSchema, classroomIdSchema } = require('../schema/paramSchemas');

const router = express.Router();

// Public: Get all classrooms in a school (anyone can access)
router.get(
  '/:schoolId',
  validateSchema(schoolIdSchema, 'params'),
  getClassrooms,
);

// Authenticated routes
// Create a classroom (only SchoolAdmin or SuperAdmin can create)
router.post(
  '/',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(classroomSchema),
  createClassroom,
);

// Update a classroom (only SchoolAdmin or SuperAdmin can update)
router.put(
  '/:classroomId',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(classroomIdSchema, 'params'),
  validateSchema(updateClassroomSchema),
  updateClassroom,
);

// Delete a classroom (only SchoolAdmin or SuperAdmin can delete)
router.delete(
  '/:classroomId',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(classroomIdSchema, 'params'),
  deleteClassroom,
);

module.exports = router;
