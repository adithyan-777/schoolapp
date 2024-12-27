const mongoose = require('mongoose');

// Define the Classroom schema
const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Name of the classroom (e.g., "Room 101")
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },  // Link to School
    capacity: { type: Number, required: true },  // Number of students it can accommodate
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Tracks the user who created the classroom
    description: { type: String },  // Optional description of the classroom
    isActive: { type: Boolean, default: true }  // Indicates if the classroom is active or deactivated
}, {
    timestamps: true  // Automatically add createdAt and updatedAt timestamps
});

// Create the model using the schema
const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
