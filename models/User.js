const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Reference to Role model
});

module.exports = mongoose.model('User', userSchema);