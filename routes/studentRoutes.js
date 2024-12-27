import express from 'express';
import Student from '../models/Student';
import School from '../models/School';
import Classroom from '../models/Classroom';
import checkRole from '../middlewares/checkRole';
import { UserRoles } from '../models/Role';

const router = express.Router();

// Enroll a student
router.post('/enroll', checkRole(UserRoles.SchoolAdmin), async (req, res) => {
    try {
        const { firstName, lastName, email, schoolId, classroomId } = req.body;

        // Check if school and classroom exist
        const school = await School.findById(schoolId);
        const classroom = await Classroom.findById(classroomId);
        if (!school || !classroom) {
            return res.status(400).json({ message: 'School or Classroom not found' });
        }

        // Create new student record
        const newStudent = new Student({
            firstName,
            lastName,
            email,
            schoolId,
            classroomId,
            enrolledBy: req.user._id,  // Enrolled by the authenticated SchoolAdmin
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student enrolled successfully', student: newStudent });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Transfer a student to another classroom
router.put('/transfer/:studentId', checkRole(UserRoles.SchoolAdmin), async (req, res) => {
    try {
        const { studentId } = req.params;
        const { classroomId } = req.body;

        // Check if the new classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(400).json({ message: 'Classroom not found' });
        }

        // Find and update the student record
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.classroomId = classroomId;
        student.status = 'transferred';
        student.transferHistory.push({ classroomId, transferDate: Date.now() });

        await student.save();
        res.status(200).json({ message: 'Student transferred successfully', student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update student information (e.g., status, email, etc.)
router.put('/update/:studentId', checkRole(UserRoles.SchoolAdmin), async (req, res) => {
    try {
        const { studentId } = req.params;
        const updateData = req.body;

        // Find and update the student record
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        Object.assign(student, updateData);
        await student.save();

        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
