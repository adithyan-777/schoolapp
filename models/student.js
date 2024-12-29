const mongoose = require('mongoose');
const User = require('./user'); // Import the base User model

// Extend the User schema for Students
const studentSchema = new mongoose.Schema(
  {
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom', // Reference to the current classroom
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School', // Reference to the current school
      required: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
      default: 'Enrolled',
    },
    enrollmentHistory: [
      {
        school: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'School', // Reference to a previous school
        },
        classroom: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Classroom', // Reference to a previous classroom
        },
        enrolledDate: {
          type: Date, // Enrollment date
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
        },
      },
    ],
    guardians: [
      {
        name: {
          type: String, // Guardian's name
        },
        contactInfo: {
          phone: {
            type: String, // Guardian's phone
          },
          email: {
            type: String, // Guardian's email
          },
        },
        relationship: {
          type: String, // Relationship to the student
        },
      },
    ],
    enrollmentDate: {
      type: Date, // Enrollment date in the current school
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Student = User.discriminator('Student', studentSchema);

module.exports = Student;