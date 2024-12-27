const School = require('../models/school');

// Create a school (only SuperAdmin)
const createSchool = async (req, res) => {
  try {
    const { name, address, contactNumber } = req.body;

    // Check if the school already exists
    const existingSchool = await School.findOne({ name });
    if (existingSchool) {
      return res.status(400).json({ message: 'School with this name already exists.' });
    }

    const school = new School({
      name,
      address,
      contactNumber,
    });

    await school.save();
    return res.status(201).json({ message: 'School created successfully', school });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all schools (everybody can view)
const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find();
    return res.status(200).json(schools);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch schools' });
  }
};

// Get a specific school (everybody can view)
const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    return res.status(200).json(school);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch school' });
  }
};

// Update a school (only SchoolAdmin)
const updateSchool = async (req, res) => {
  try {
    const { name, address, contactNumber } = req.body;
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      { name, address, contactNumber },
      { new: true }
    );

    if (!updatedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    return res.status(200).json({ message: 'School updated successfully', updatedSchool });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update school' });
  }
};

// Delete a school (only SuperAdmin or SchoolAdmin)
const deleteSchool = async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) {
      return res.status(404).json({ message: 'School not found' });
    }

    return res.status(200).json({ message: 'School deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete school' });
  }
};

module.exports = { createSchool, getAllSchools, getSchoolById, updateSchool, deleteSchool };