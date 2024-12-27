const Classroom = require('../models/classroom');
const User = require('../models/user');
const School = require('../models/school');
const logger = require('../utils/logger');

// Create a new classroom
const createClassroom = async (req, res) => {
  try {
    const { name, teacher, school } = req.body;

    // Check if the school exists
    const schoolExists = await School.findById(school);
    if (!schoolExists) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check if the teacher exists (optional, can be null)
    if (teacher) {
      const teacherExists = await User.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
    }

    // Create the classroom
    const classroom = new Classroom({ name, teacher, school });
    await classroom.save();

    logger.info(`Classroom created: ${name} in school ${school}`);
    return res.status(201).json({ message: 'Classroom created successfully', classroom });
  } catch (error) {
    logger.error(`Error creating classroom: ${error.message}`);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all classrooms for a specific school
const getClassrooms = async (req, res) => {
  try {
    const { schoolId } = req.params;

    // Find classrooms for the given school
    const classrooms = await Classroom.find({ school: schoolId }).populate('teacher', 'name email').populate('school', 'name');

    if (classrooms.length === 0) {
      return res.status(404).json({ message: 'No classrooms found for this school' });
    }

    logger.info(`Retrieved classrooms for school ${schoolId}`);
    return res.status(200).json(classrooms);
  } catch (error) {
    logger.error(`Error retrieving classrooms: ${error.message}`);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a classroom by ID
const updateClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const { name, teacher } = req.body;

    // Find the classroom to update
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Update the classroom details
    if (name) classroom.name = name;
    if (teacher) classroom.teacher = teacher;

    await classroom.save();

    logger.info(`Classroom updated: ${classroomId}`);
    return res.status(200).json({ message: 'Classroom updated successfully', classroom });
  } catch (error) {
    logger.error(`Error updating classroom: ${error.message}`);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a classroom by ID
const deleteClassroom = async (req, res) => {
  try {
    // Find the classroom to delete
    const classroom = await Classroom.findByIdAndDelete(req.params.classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    logger.info(`Classroom deleted: ${req.params.classroomId}`);
    return res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting classroom: ${error.message}`);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
};
