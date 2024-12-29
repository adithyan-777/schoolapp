const Student = require('../models/student'); // Import the Student model
const Classroom = require('../models/classroom'); // Import the Classroom model (if you need to validate classrooms)
const School = require('../models/school'); // Import the School model (if you need to validate schools)

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { classroom, school, enrollmentStatus, enrollmentHistory, guardians } = req.body;

    // Validate if classroom and school exist
    const foundClassroom = await Classroom.findById(classroom);
    const foundSchool = await School.findById(school);

    if (!foundClassroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (!foundSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Create the student record
    const student = new Student({
      classroom,
      school,
      enrollmentStatus,
      enrollmentHistory,
      guardians,
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('classroom')
      .populate('school')
      .exec();

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id)
      .populate('classroom')
      .populate('school')
      .exec();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a student by ID
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { classroom, school, enrollmentStatus, enrollmentHistory, guardians } = req.body;

  try {
    // Find the student and update the data
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { classroom, school, enrollmentStatus, enrollmentHistory, guardians },
      { new: true } // Return the updated student
    ).populate('classroom').populate('school').exec();

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
