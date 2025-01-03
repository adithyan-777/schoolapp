const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Student = require('../models/student');
const School = require('../models/school');
const Classroom = require('../models/classroom');
const User = require('../models/user');

let adminToken, teacherToken;
let schoolId, classroomId, studentId;

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

  // Create admin user and get token
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'SuperAdmin',
    school: schoolId,
  });

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Student API', () => {
  describe('POST /api/students', () => {
    it('should create student with valid data', async () => {
      const res = await request(app)
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

      expect(res.status).toBe(201);
      expect(res.body.student).toHaveProperty('firstName', 'John');
      studentId = res.body.student._id;
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@test.com',
          classroom: classroomId,
          school: schoolId,
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/students', () => {
    it('should get all students', async () => {
      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get student by ID', async () => {
      const res = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'john@test.com');
    });

    it('should get students by school', async () => {
      const res = await request(app)
        .get(`/api/students/school/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student', async () => {
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Johnny',
          email: 'johnny@test.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.student.firstName).toBe('Johnny');
    });

    it('should reject invalid student ID', async () => {
      const res = await request(app)
        .put('/api/students/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'Test' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete student', async () => {
      const res = await request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should return 404 for deleted student', async () => {
      const res = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
