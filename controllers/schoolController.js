const School = require('../models/school');
const asyncHandler = require('../utils/asyncHandler'); // Assuming asyncHandler is in utils
const AppError = require('../utils/appError'); // Assuming AppError is in utils

// Create a school (only SuperAdmin)
const createSchool = asyncHandler(async (req, res, next) => {
  const { name, address, contactNumber } = req.body;

  // Check if the school already exists
  const existingSchool = await School.findOne({ name });
  if (existingSchool) {
    return next(new AppError('School with this name already exists.', 400));
  }

  const school = new School({
    name,
    address,
    contactNumber,
  });

  await school.save();
  res.status(201).json({ message: 'School created successfully', school });
});

// Get all schools (everybody can view)
const getAllSchools = asyncHandler(async (req, res, next) => {
  const schools = await School.find();
  res.status(200).json(schools);
});

// Get a specific school (everybody can view)
const getSchoolById = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    return next(new AppError('School not found', 404));
  }
  res.status(200).json(school);
});

// Update a school (only SchoolAdmin)
const updateSchool = asyncHandler(async (req, res, next) => {
  const { name, address, contactNumber } = req.body;
  const updatedSchool = await School.findByIdAndUpdate(
    req.params.id,
    { name, address, contactNumber },
    { new: true },
  );

  if (!updatedSchool) {
    return next(new AppError('School not found', 404));
  }

  res
    .status(200)
    .json({ message: 'School updated successfully', updatedSchool });
});

// Delete a school (only SuperAdmin or SchoolAdmin)
const deleteSchool = asyncHandler(async (req, res, next) => {
  const deletedSchool = await School.findByIdAndDelete(req.params.id);
  if (!deletedSchool) {
    return next(new AppError('School not found', 404));
  }

  res.status(200).json({ message: 'School deleted successfully' });
});

module.exports = {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
};
