const Student = require('../models/student'); // Import the updated Student model
const Classroom = require('../models/classroom'); // Import the Classroom model
const School = require('../models/school'); // Import the School model

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, classroom, school, enrollmentStatus, enrollmentHistory, guardians } = req.body;

    // Validate if classroom and school exist
    const foundClassroom = await Classroom.findById(classroom);
    const foundSchool = await School.findById(school);

    if (!foundClassroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (!foundSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Check for duplicate email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get all students by school ID
exports.getStudentsBySchoolId = async (req, res) => {
    const { schoolId } = req.params;

    try {
        const students = await Student.find({ school: schoolId })
            .populate('classroom')
            .populate('school')
            .exec();

        if (!students.length) {
            return res.status(404).json({ message: 'No students found for this school.' });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to get students by school ID and classroom ID
exports.getStudentsBySchoolAndClassroom = async (req, res) => {
    const { schoolId, classroomId } = req.params;

    try {
        const students = await Student.find({ school: schoolId, classroom: classroomId })
            .populate('classroom')
            .populate('school')
            .exec();

        if (!students.length) {
            return res.status(404).json({ message: 'No students found for this school and classroom.' });
        }

        res.status(200).json(students);
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
  const { firstName, lastName, email, phone, classroom, school, enrollmentStatus, enrollmentHistory, guardians } = req.body;

  try {
    // Validate if classroom and school exist
    if (classroom) {
      const foundClassroom = await Classroom.findById(classroom);
      if (!foundClassroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
    }

    if (school) {
      const foundSchool = await School.findById(school);
      if (!foundSchool) {
        return res.status(404).json({ message: 'School not found' });
      }
    }

    // Update the student data
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, classroom, school, enrollmentStatus, enrollmentHistory, guardians },
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
