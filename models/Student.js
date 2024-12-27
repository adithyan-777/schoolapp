const mongoose = require('mongoose');

// Define the Student schema
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },  // Link to School
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true }, // Link to Classroom
    enrolledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Tracks the SchoolAdmin who enrolled the student
    status: { type: String, enum: ['enrolled', 'transferred', 'graduated', 'suspended'], default: 'enrolled' }, // Student status
    transferHistory: [{
        classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
        transferDate: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Create the model using the schema
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
