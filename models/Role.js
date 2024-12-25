const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Role name (e.g., Admin, Teacher, Student)
    permissions: [{ type: String }] // List of permissions as strings (e.g., "create_user", "delete_school")
});

module.exports = mongoose.model('Role', roleSchema);