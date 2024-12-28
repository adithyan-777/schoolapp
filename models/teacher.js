const mongoose = require('mongoose');
const User = require('./user'); // Import the base User model

// Extend the User schema for Teachers
const teacherSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School', // Reference to the school
      required: true,
    },
    classrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom', // Classrooms the teacher is associated with
      },
    ],
    subjects: [
      {
        type: String, // List of subjects the teacher specializes in
      },
    ],
    designation: {
      type: String, // Teacher's designation
    },
    hireDate: {
      type: Date, // Hire date of the teacher
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Teacher = User.discriminator('Teacher', teacherSchema);

module.exports = Teacher;