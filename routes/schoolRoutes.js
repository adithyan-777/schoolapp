// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const School = require('../models/Schools');
const checkRole = require('../middlewares/checkRole');

// Create a new school (accessible only to SuperAdmin)
router.post('/', checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const { name, address, contactEmail } = req.body;
        const school = new School({ name, address, contactEmail });
        await school.save();
        res.status(201).json({ message: 'School created successfully', school });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all schools
router.get('/', checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a school
router.put('/:id', checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json({ message: 'School updated successfully', school });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a school
router.delete('/:id', checkRole(['SuperAdmin']), async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) return res.status(404).json({ message: 'School not found' });
        res.json({ message: 'School deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;