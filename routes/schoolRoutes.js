const express = require('express');
const School = require('../models/School');
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');

const router = express.Router();

// Create a new school
router.post('/', checkAuth, checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const { name, address, email, phoneNumber, establishedYear, principal } = req.body;
        const createdBy = req.user.id; // Assuming `checkAuth` adds `user` to the request object

        const school = new School({
            name,
            address,
            email,
            phoneNumber,
            establishedYear,
            principal,
            createdBy
        });

        await school.save();
        res.status(201).json({ message: 'School created successfully', school });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all schools
router.get('/', checkAuth, checkRole(['SuperAdmin', 'SchoolAdmin']), async (req, res) => {
    try {
        const schools = await School.find().populate('createdBy', 'name email').populate('adminUsers', 'name email');
        res.status(200).json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single school by ID
router.get('/:id', checkAuth, checkRole(['SuperAdmin', 'SchoolAdmin']), async (req, res) => {
    try {
        const school = await School.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('adminUsers', 'name email')
            .populate('classrooms', 'name')
            .populate('students', 'name email');

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json(school);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a school
router.put('/:id', checkAuth, checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const { name, address, email, phoneNumber, establishedYear, principal, isActive } = req.body;

        const school = await School.findByIdAndUpdate(
            req.params.id,
            { name, address, email, phoneNumber, establishedYear, principal, isActive },
            { new: true, runValidators: true }
        );

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json({ message: 'School updated successfully', school });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a school
router.delete('/:id', checkAuth, checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json({ message: 'School deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
