const express = require('express');
const Classroom = require('../models/Classroom');
const School = require('../models/School'); // Import the School model to look up the schoolId
const checkAuth = require('../middlewares/checkAuth');
const checkRole = require('../middlewares/checkRole');
const logger = require('../logger');

const router = express.Router();

// Create a new classroom
router.post('/', checkAuth, checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const { name, schoolName, capacity, description } = req.body;

        // Find the school by name
        const school = await School.findOne({ name: schoolName });
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        logger.warn(req.user.id)
        // Ensure the schoolId matches the user's schoolId or is SuperAdmin
        if (req.user.schoolId && req.user.schoolId.toString() !== school._id.toString() && !req.user.roles.includes('SuperAdmin')) {
            return res.status(403).json({ message: 'Access denied: School name mismatch' });
        }

        const classroom = new Classroom({
            name,
            schoolId: school.id,  // Use the actual schoolId
            capacity,
            description,
            createdBy: req.user.id,
            isActive: true // Default to active
        });

        await classroom.save();
        res.status(201).json({ message: 'Classroom created successfully', classroom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get classrooms for a specific school
router.get('/', checkAuth, async (req, res) => {
    try {
        const classrooms = await Classroom.find({
            schoolId: req.user.schoolId // Only classrooms for the user's school
        });

        res.status(200).json({ classrooms });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a single classroom by ID
router.get('/:classroomId', checkAuth, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.classroomId);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Ensure the classroom belongs to the user's school or the user is a SuperAdmin
        if (req.user.schoolId.toString() !== classroom.schoolId.toString() && !req.user.roles.includes('SuperAdmin')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({ classroom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a classroom
router.put('/:classroomId', checkAuth, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.classroomId);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Ensure the classroom belongs to the user's school or the user is a SuperAdmin
        if (req.user.schoolId.toString() !== classroom.schoolId.toString() && !req.user.roles.includes('SuperAdmin')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update classroom details
        const { name, capacity, description, isActive } = req.body;
        classroom.name = name || classroom.name;
        classroom.capacity = capacity || classroom.capacity;
        classroom.description = description || classroom.description;
        classroom.isActive = isActive !== undefined ? isActive : classroom.isActive;

        await classroom.save();
        res.status(200).json({ message: 'Classroom updated successfully', classroom });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a classroom
router.delete('/:classroomId', checkAuth, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.classroomId);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Ensure the classroom belongs to the user's school or the user is a SuperAdmin
        if (req.user.schoolId.toString() !== classroom.schoolId.toString() && !req.user.roles.includes('SuperAdmin')) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await classroom.remove();
        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;