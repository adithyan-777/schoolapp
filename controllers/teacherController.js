const Teacher = require('../models/teacher'); // Import the Teacher model
const logger = require('../utils/logger')

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    // Destructure required fields from request body
    const { name, email, password, school, classrooms, subjects, designation, hireDate } = req.body;

    // Create a new Teacher document (inherits from User model)
    const newTeacher = new Teacher({
      name,
      email,
      password, // Make sure to hash the password if needed
      role: 'Teacher', // Ensure the role is 'Teacher'
      school,
      classrooms,
      subjects,
      designation,
      hireDate,
    });

    // Save the new teacher document to the database
    await newTeacher.save();

    return res.status(201).json({
      message: 'Teacher created successfully',
      teacher: newTeacher, // Return the created teacher
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error creating teacher',
      details: error.message,
    });
  }
};

// Get all teachers (SuperAdmin or SchoolAdmin)
exports.getAllTeachers = async (req, res) => {
  try {
    const userRole = req.user.role; // Assuming you have role stored in `req.user.role`

    let teachers;

    if (userRole === 'SuperAdmin') {
      teachers = await Teacher.find();
      logger.warn(teachers)
    } else if (userRole === 'SchoolAdmin') {
      teachers = await Teacher.find({ school: req.user.school });
    } else {
      return res.status(403).json({ error: 'Permission denied' });
    }

    return res.status(200).json({ teachers });
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving teachers' });
  }
};

// Get a teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('school classrooms');
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    return res.status(200).json({ teacher });
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving teacher' });
  }
};

// Update teacher information
exports.updateTeacher = async (req, res) => {
  try {
    const { school, classrooms, subjects, designation, hireDate } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: { school, classrooms, subjects, designation, hireDate } },
      { new: true } // Return the updated document
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    return res.status(200).json({
      message: 'Teacher updated successfully',
      teacher: updatedTeacher,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating teacher' });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    return res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting teacher' });
  }
};
