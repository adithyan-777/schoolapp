// models/School.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Tracks the user who created the school
});

module.exports = mongoose.model('School', schoolSchema);