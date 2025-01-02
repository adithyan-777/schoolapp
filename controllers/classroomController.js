const Classroom = require('../models/classroom');
const User = require('../models/user');
const School = require('../models/school');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError'); // Assuming you have the AppError class

// Create a new classroom
const createClassroom = asyncHandler(async (req, res, next) => {
  const { name, teacher, school } = req.body;

  // Check if the school exists
  const schoolExists = await School.findById(school);
  if (!schoolExists) {
    return next(new AppError('School not found', 404));
  }

  // Check if the teacher exists (optional, can be null)
  if (teacher) {
    const teacherExists = await User.findById(teacher);
    if (!teacherExists) {
      return next(new AppError('Teacher not found', 404));
    }
  }

  // Create the classroom
  const classroom = new Classroom({ name, teacher, school });
  await classroom.save();

  logger.info(`Classroom created: ${name} in school ${school}`);
  res
    .status(201)
    .json({ message: 'Classroom created successfully', classroom });
});

// Get all classrooms for a specific school
const getClassrooms = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  // Find classrooms for the given school
  const classrooms = await Classroom.find({ school: id })
    .populate('school', 'name');

  if (classrooms.length === 0) {
    return next(new AppError('No classrooms found for this school', 404));
  }

  logger.info(`Retrieved classrooms for school ${id}`);
  res.status(200).json(classrooms);
});

const getClassroomById = asyncHandler(async (req, res, next) => {
  const id  = req.params.id;

  // Find classrooms for the given school
  const classrooms = await Classroom.findById(id)
    .populate('school', 'name');

  if (classrooms.length === 0) {
    return next(new AppError('No classrooms found for this id', 404));
  }
  res.status(200).json(classrooms);
});

// Update a classroom by ID
const updateClassroom = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { name, teacher } = req.body;

  // Find the classroom to update
  const classroom = await Classroom.findById(id);
  if (!classroom) {
    return next(new AppError('Classroom not found', 404));
  }

  // Update the classroom details
  if (name) classroom.name = name;
  if (teacher) classroom.teacher = teacher;

  await classroom.save();

  logger.info(`Classroom updated: ${id}`);
  res
    .status(200)
    .json({ message: 'Classroom updated successfully', classroom });
});

// Delete a classroom by ID
const deleteClassroom = asyncHandler(async (req, res, next) => {
  // Find the classroom to delete
  const classroom = await Classroom.findByIdAndDelete(req.params.id);
  if (!classroom) {
    return next(new AppError('Classroom not found', 404));
  }

  logger.info(`Classroom deleted: ${req.params.id}`);
  res.status(200).json({ message: 'Classroom deleted successfully' });
});

module.exports = {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
  getClassroomById
};
