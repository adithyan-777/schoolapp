const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

schoolSchema.methods.toJSON = function () {
  const obj = this.toObject(); // Convert Mongoose document to a plain JavaScript object
  delete obj.__v; // Optionally remove the __v field
  return obj;
};

const School = mongoose.model('School', schoolSchema);

module.exports = School;
