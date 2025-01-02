const Student = require('../models/student'); // Import the updated Student model
const Classroom = require('../models/classroom'); // Import the Classroom model
const School = require('../models/school'); // Import the School model
const asyncHandler = require('../utils/asyncHandler'); // Import asyncHandler utility
const AppError = require('../utils/appError'); // Import AppError class

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    classroom,
    school,
    enrollmentStatus,
    enrollmentHistory,
    guardians,
  } = req.body;

  // Validate if classroom and school exist
  const foundClassroom = await Classroom.findById(classroom);
  const foundSchool = await School.findById(school);

  if (!foundClassroom) {
    throw new AppError('Classroom not found', 404);
  }
  if (!foundSchool) {
    throw new AppError('School not found', 404);
  }

  // Check for duplicate email
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new AppError('Student with this email already exists', 400);
  }

  // Create the student record
  const student = new Student({
    firstName,
    lastName,
    email,
    phone,
    classroom,
    school,
    enrollmentStatus,
    enrollmentHistory,
    guardians,
  });

  await student.save();
  res.status(201).json({ message: 'Student created successfully', student });
});

// Controller function to get all students by school ID
const getStudentsBySchoolId = asyncHandler(async (req, res) => {
  const students = await Student.find({ school: req.params.id })
    .populate('classroom')
    .populate('school')
    .exec();

  if (!students.length) {
    throw new AppError('No students found for this school', 404);
  }

  res.status(200).json(students);
});

// Controller function to get students by school ID and classroom ID
const getStudentsBySchoolAndClassroom = asyncHandler(async (req, res) => {
  const { schoolId, classroomId } = req.params;

  const students = await Student.find({
    school: schoolId,
    classroom: classroomId,
  })
    .populate('classroom')
    .populate('school')
    .exec();

  if (!students.length) {
    throw new AppError('No students found for this school and classroom', 404);
  }

  res.status(200).json(students);
});

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .populate('classroom')
    .populate('school')
    .exec();

  res.status(200).json(students);
});

// Get student by ID
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id)
    .populate('classroom')
    .populate('school')
    .exec();

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json(student);
});

// Update a student by ID
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    classroom,
    school,
    enrollmentStatus,
    enrollmentHistory,
    guardians,
  } = req.body;

  // Validate if classroom and school exist
  if (classroom) {
    const foundClassroom = await Classroom.findById(classroom);
    if (!foundClassroom) {
      throw new AppError('Classroom not found', 404);
    }
  }

  if (school) {
    const foundSchool = await School.findById(school);
    if (!foundSchool) {
      throw new AppError('School not found', 404);
    }
  }

  // Update the student data
  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
      phone,
      classroom,
      school,
      enrollmentStatus,
      enrollmentHistory,
      guardians,
    },
    { new: true }, // Return the updated student
  )
    .populate('classroom')
    .populate('school')
    .exec();

  if (!updatedStudent) {
    throw new AppError('Student not found', 404);
  }

  res
    .status(200)
    .json({ message: 'Student updated successfully', student: updatedStudent });
});

// Delete a student by ID
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedStudent = await Student.findByIdAndDelete(id);

  if (!deletedStudent) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({ message: 'Student deleted successfully' });
});

module.exports = {
  createStudent,
  getStudentsBySchoolId,
  getStudentsBySchoolAndClassroom,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
