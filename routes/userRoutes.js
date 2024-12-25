// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role')
const checkRole = require('../middlewares/checkRole');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, roles } = req.body;

        // Validate email format (optional but recommended)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Convert role names to their corresponding IDs
        const roleDocuments = await Role.find({ name: { $in: roles } });
        const roleIds = roleDocuments.map(role => role._id);

        if (roleIds.length !== roles.length) {
            return res.status(400).json({ message: 'One or more roles are invalid' });
        }

        // Create a new user with the role IDs
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            roles: roleIds,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email }).populate('roles');
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                roles: user.roles.map(role => role.name),
            },
            process.env.JWT_SECRET, // Your secret key
            { expiresIn: '1h' } // Token expiration
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all users (Admin only)
router.get('/', checkRole(['Admin']), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a user (Admin only)
router.put('/:id', checkRole(['Admin']), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a user (Admin only)
router.delete('/:id', checkRole(['Admin']), async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
