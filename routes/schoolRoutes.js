const express = require('express');
const router = express.Router();
const {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} = require('../controllers/schoolController');
const {
  authMiddleware,
  schoolAdminRedirect,
  validateUserAccess,
} = require('../middlewares/authMiddleware');
const validateSchema = require('../middlewares/validateSchema');
const { schoolSchema, updateSchoolSchema } = require('../schema/schoolSchema');
const { objectIdSchema } = require('../schema/paramSchemas');

// Create a new school - SuperAdmin only
router.post(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin'], 'School'),
  validateSchema(schoolSchema),
  createSchool,
);

// Get all schools - accessible by everyone
router.get(
  '/',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'School'),
  schoolAdminRedirect,
  getAllSchools,
);

// Get a specific school by ID - accessible by everyone
router.get(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'School'),
  validateSchema(objectIdSchema),
  getSchoolById,
);

// Update a school - SuperAdmin or SchoolAdmin only
router.put(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'School'),
  validateSchema(objectIdSchema, 'params'),
  validateSchema(updateSchoolSchema),
  updateSchool,
);

// Delete a school - SuperAdmin or SchoolAdmin only
router.delete(
  '/:id',
  authMiddleware,
  validateUserAccess(['SuperAdmin', 'SchoolAdmin'], 'School'),
  validateSchema(objectIdSchema, 'params'),
  deleteSchool,
);

module.exports = router;
