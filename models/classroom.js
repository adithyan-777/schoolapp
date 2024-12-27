const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Teacher (User model) reference
      required: false,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School', // Reference to a school
      required: true,
    },
  },
  { timestamps: true }
);

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;