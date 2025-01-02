const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Your Express app
const Classroom = require('../models/classroom');
const School = require('../models/school');
const User = require('../models/user');

let adminToken;
let schoolId;

beforeAll(async () => {
try {
    // Disconnect the previous connection if it exists
    if (mongoose.connection.readyState !== 0) {
      console.log('Disconnecting existing connection...');
      await mongoose.disconnect();
    }

    // Connect to the new database
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
  }
  await Classroom.deleteMany({});
  await School.deleteMany({});
  await User.deleteMany({});

  // Create a school
  const school = await School.create({
    name: 'Test School',
    address: '123 Test Address',
    contactNumber: '7788992233'
  });
  schoolId = school._id;


  // Create an admin user and get a token
  const admin = await User.create({
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'SuperAdmin',
    school: schoolId,
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: admin.email,
      password: 'password123',
    });
  adminToken = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Classroom API', () => {
  let classroomId;

  it('should create a classroom', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Classroom',
        school: schoolId,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Classroom created successfully');
    expect(response.body.classroom.name).toBe('Test Classroom');
    classroomId = response.body.classroom._id;
  });

  it('should get all classrooms for a school', async () => {
    const response = await request(app)
      .get(`/api/classrooms/school/${schoolId}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toBe('Test Classroom');
    expect(response.body[0].school.name).toBe('Test School');
  });

  it('should update a classroom', async () => {
    const response = await request(app)
      .put(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Classroom Name',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Classroom updated successfully');
    expect(response.body.classroom.name).toBe('Updated Classroom Name');
  });

  it('should not update a classroom with invalid ID', async () => {
    const response = await request(app)
      .put(`/api/classrooms/invalid-id`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Classroom Name',
      });

    expect(response.status).toBe(400); // Bad request
    expect(response.body.message).toBe('Validation error');
  });

  it('should delete a classroom', async () => {
    const response = await request(app)
      .delete(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Classroom deleted successfully');
  });

  it('should not delete a classroom with invalid ID', async () => {
    const response = await request(app)
      .delete(`/api/classrooms/invalid-id`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(400); // Bad request
    expect(response.body.message).toBe('Validation error');
  });

  it('should not create a classroom without authentication', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .send({
        name: 'Another Classroom',
        school: schoolId,
      });

    expect(response.status).toBe(401); // Unauthorized
    expect(response.body.message).toBe('No token provided');
  });

  it('should return 404 if no classrooms exist for a school', async () => {
    const newSchool = await School.create({
      name: 'Empty School',
      address: '456 Empty Street',
      "contactNumber": "8888833333"
    });

    const response = await request(app)
      .get(`/api/classrooms/${newSchool._id}`);

    expect(response.status).toBe(404); // Not found
    expect(response.body.message).toBe('No classrooms found for this school');
  });
});
