const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',  // Reference to the assigned classroom
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
          ref: 'School',  // Reference to a school
        },
        enrolledDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
        },
      },
    ],
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;