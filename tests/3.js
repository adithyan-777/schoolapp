const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Student = require('../models/student');
const School = require('../models/school');
const Classroom = require('../models/classroom');
const User = require('../models/user');

let adminToken;
let schoolId;
let classroomId;
let studentId;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(process.env.MONGO_TEST_URI);

  // Clear test data
  await Promise.all([
    Student.deleteMany({}),
    School.deleteMany({}),
    Classroom.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Create test school
  const school = await School.create({
    name: 'Test School',
    address: '123 Test St',
    contactNumber: '1234567890',
  });
  schoolId = school._id;

  // Create test classroom
  const classroom = await Classroom.create({
    name: 'Test Class',
    school: schoolId,
  });
  classroomId = classroom._id;

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'SuperAdmin',
    school: schoolId,
  });

  // Get admin token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Student API Tests', () => {
  describe('POST /api/students', () => {
    it('should create a new student with valid data', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@test.com',
          phone: '1234567890',
          classroom: classroomId,
          school: schoolId,
          enrollmentStatus: 'Enrolled',
        });

      expect(response.status).toBe(201);
      expect(response.body.student).toHaveProperty('firstName', 'John');
      studentId = response.body.student._id;
    });

    it('should fail without authentication', async () => {
      const response = await request(app).post('/api/students').send({
        firstName: 'Jane',
        lastName: 'Doe',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/students', () => {
    it('should get all students', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get student by ID', async () => {
      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('firstName', 'John');
    });

    it('should get students by school ID', async () => {
      const response = await request(app)
        .get(`/api/students/school/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student details', async () => {
      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'John Updated',
          lastName: 'Doe Updated',
        });

      expect(response.status).toBe(200);
      expect(response.body.student.firstName).toBe('John Updated');
    });

    it('should fail with invalid student ID', async () => {
      const response = await request(app)
        .put('/api/students/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'John',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete student', async () => {
      const response = await request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student deleted successfully');
    });

    it('should return 404 for non-existent student', async () => {
      const response = await request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
