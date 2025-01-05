const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Student = require('../models/student');
const School = require('../models/school');
const User = require('../models/user');

jest.setTimeout(30000);

let superAdminToken, schoolAdminToken, otherSchoolAdminToken;
let schoolId, otherSchoolId, studentId;

const testStudent = {
  firstName: 'Test',
  lastName: 'Student',
  email: 'test@student.com',
  phone: '1234567890',
  enrollmentStatus: 'Active',
};

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(process.env.MONGO_TEST_URI);

  await Promise.all([
    Student.deleteMany({}),
    School.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Create schools
  const school = await School.create({
    name: 'Test School',
    address: '123 Test St',
    contactNumber: '1234567890',
  });
  schoolId = school._id;

  const otherSchool = await School.create({
    name: 'Other School',
    address: '456 Test Ave',
    contactNumber: '0987654321',
  });
  otherSchoolId = otherSchool._id;

  // Create users and get tokens
  const superAdmin = await User.create({
    email: 'super@test.com',
    password: 'password123',
    name: 'Super Admin',
    role: 'SuperAdmin',
  });

  const schoolAdmin = await User.create({
    email: 'admin@test.com',
    password: 'password123',
    name: 'School Admin',
    role: 'SchoolAdmin',
    school: schoolId,
  });

  const otherSchoolAdmin = await User.create({
    email: 'other@test.com',
    password: 'password123',
    name: 'Other Admin',
    role: 'SchoolAdmin',
    school: otherSchoolId,
  });

  const superAdminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'super@test.com', password: 'password123' });
  superAdminToken = superAdminLogin.body.token;

  const schoolAdminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  schoolAdminToken = schoolAdminLogin.body.token;

  const otherSchoolAdminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'other@test.com', password: 'password123' });
  otherSchoolAdminToken = otherSchoolAdminLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Student API', () => {
  describe('POST /api/students', () => {
    it('should allow SuperAdmin to create student', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          ...testStudent,
          school: schoolId.toString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.student).toHaveProperty(
        'firstName',
        testStudent.firstName,
      );
      studentId = response.body.student._id;
    });

    it('should allow SchoolAdmin to create student in their school', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          ...testStudent,
          email: 'another@test.com',
          school: schoolId.toString(),
        });

      expect(response.status).toBe(201);
    });

    it('should not allow SchoolAdmin to create student in another school', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${otherSchoolAdminToken}`)
        .send({
          ...testStudent,
          email: 'third@test.com',
          school: schoolId.toString(),
        });

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          firstName: 'Test',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/students', () => {
    it('should get all students for SuperAdmin', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get student by ID', async () => {
      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', studentId);
    });

    it('should get students by school', async () => {
      const response = await request(app)
        .get(`/api/students/school/${schoolId}`)
        .set('Authorization', `Bearer ${schoolAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update student', async () => {
      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          firstName: 'Updated Name',
        });

      expect(response.status).toBe(200);
      expect(response.body.student.firstName).toBe('Updated Name');
    });

    it('should not allow unauthorized update', async () => {
      const response = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${otherSchoolAdminToken}`)
        .send({
          firstName: 'Unauthorized Update',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete student', async () => {
      const response = await request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
    });

    it('should verify deletion', async () => {
      const response = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(404);
    });
  });
});
