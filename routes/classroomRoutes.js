const express = require('express');
const {
  createClassroom,
  getClassroomsBySchool,
  updateClassroom,
  deleteClassroom,
  getClassroomById,
} = require('../controllers/classroomController');
const {
  authMiddleware,
  validateUserAccess,
} = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const {
  classroomSchema,
  updateClassroomSchema,
} = require('../schema/classroomSchemas');
const { classroomIdSchema, objectIdSchema } = require('../schema/paramSchemas');

const router = express.Router();

// Public: Get all classrooms in a school (anyone can access)
router.get(
  '/school/:id',
  authMiddleware,
  validateSchema(objectIdSchema, 'params'),
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Classroom'),
  getClassroomsBySchool,
);

// Authenticated routes
// Create a classroom (only SchoolAdmin or SuperAdmin can create)
router.post(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Classroom'),
  validateSchema(classroomSchema),
  createClassroom,
);

router.get(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Classroom'),
  validateSchema(objectIdSchema, 'params'),
  getClassroomById,
);

// Update a classroom (only SchoolAdmin or SuperAdmin can update)
router.put(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Classroom'),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateClassroomSchema),
  updateClassroom,
);

// Delete a classroom (only SchoolAdmin or SuperAdmin can delete)
router.delete(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'Classroom'),
  validateSchema(objectIdSchema, 'params'),
  deleteClassroom,
);

module.exports = router;
