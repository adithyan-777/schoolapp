const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['SuperAdmin', 'SchoolAdmin'],
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.toJSON = function () {
  const user = this.toObject(); // Convert Mongoose document to a plain JavaScript object
  delete user.password; // Remove the password field
  delete user.__v; // Optionally remove the __v field
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
