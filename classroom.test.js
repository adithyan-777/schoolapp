const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const Role = require('./models/Role');
const User = require('./models/User');
const School = require('./models/School');
const Classroom = require('./models/Classroom');

// Import the app
const app = require('./index');

// Variables for test data
let superAdminToken;
let superAdminUser;
let testSchool;

beforeEach(async () => {
    // Create roles
    const superAdminRole = await Role.create({ name: 'SuperAdmin', permissions: ['manage_all'] });

    // Create a SuperAdmin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    superAdminUser = await User.create({
        name: 'SuperAdmin User',
        email: 'superadmin@example.com',
        password: hashedPassword,
        roles: [superAdminRole._id],
    });

    // Generate JWT for the SuperAdmin user
    superAdminToken = jwt.sign(
        { _id: superAdminUser._id, roles: ['SuperAdmin'] },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Create a test school
    testSchool = await School.create({
        name: 'Test School',
        address: '123 Test St',
        email: 'school@example.com',
        phoneNumber: '+123456789',
        establishedYear: 2000,
        principal: "testuser",
        createdBy: superAdminUser.id,
    });
});

describe('Classroom Routes', () => {
    it('should create a classroom as SuperAdmin', async () => {
        const payload = {
            name: 'Room 101',
            schoolId: testSchool._id,
            capacity: 30,
            description: 'First-grade classroom',
        };

        const response = await request(app)
            .post('/api/classrooms')
            .set('Authorization', `Bearer ${superAdminToken}`)
            .send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Classroom created successfully');
        expect(response.body.classroom).toHaveProperty('name', payload.name);
        expect(response.body.classroom).toHaveProperty('schoolId', payload.schoolId.toString());
    });

    it('should fetch classrooms by school ID', async () => {
        await Classroom.create({
            name: 'Room 103',
            schoolId: testSchool._id,
            capacity: 40,
            createdBy: superAdminUser._id,
            isActive: true,
        });

        const response = await request(app)
            .get(`/api/classrooms?schoolId=${testSchool._id}`)
            .set('Authorization', `Bearer ${superAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('classrooms');
        expect(response.body.classrooms.length).toBe(1);
    });
});