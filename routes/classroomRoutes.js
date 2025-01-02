const express = require('express');
const {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
  getClassroomById
} = require('../controllers/classroomController');
const { authMiddleware, hasRole } = require('../middlewares/authMiddleware');
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

router.get(
  '/:id',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(objectIdSchema, 'params'),
  getClassroomById,
);

// Update a classroom (only SchoolAdmin or SuperAdmin can update)
router.put(
  '/:id',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateClassroomSchema),
  updateClassroom,
);

// Delete a classroom (only SchoolAdmin or SuperAdmin can delete)
router.delete(
  '/:id',
  authMiddleware,
  hasRole(['SchoolAdmin', 'SuperAdmin']),
  validateSchema(objectIdSchema, 'params'),
  deleteClassroom,
);

module.exports = router;
