const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School', // Reference to a school
      required: true,
    },
  },
  { timestamps: true },
);

classroomSchema.methods.toJSON = function () {
  const obj = this.toObject(); // Convert Mongoose document to a plain JavaScript object
  delete obj.__v; // Optionally remove the __v field
  return obj;
};

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
