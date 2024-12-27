const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    establishedYear: { 
        type: Number 
    },
    principal: { 
        type: String 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Tracks the user who created the school
    adminUsers: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ], // References to users with admin roles in the school
    classrooms: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Classroom' 
        }
    ], // References to classrooms under the school
    students: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student' 
        }
    ], // References to students enrolled in the school
    isActive: { 
        type: Boolean, 
        default: true 
    }, // Indicates whether the school is active
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    }
});

// Pre-save hook to update `updatedAt` field
schoolSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('School', schoolSchema);