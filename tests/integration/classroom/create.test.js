const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const Classroom = require('../../../models/classroom');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');
const mongoose = require('mongoose');

jest.setTimeout(600000);

describe('Classroom Creation API', () => {
  let superAdminToken, schoolAdminToken, schoolId;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.clearDatabase();
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    superAdminToken = await getAuthToken(superAdmin);

    const school = await School.create(testSchool);
    schoolId = school._id.toString(); // Convert ObjectId to string

    // Assign the school to the schoolAdmin
    schoolAdmin.school = schoolId;
    schoolAdminToken = await getAuthToken(schoolAdmin);
  });

  it('should allow SuperAdmin to create a new classroom', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'New Classroom',
        school: schoolId,
      });

    expect(response.status).toBe(201);
    expect(response.body.classroom).toHaveProperty('name', 'New Classroom');
  });

  it('should allow SchoolAdmin to create a new classroom in their school', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Admin Classroom',
        school: schoolId,
      });

    expect(response.status).toBe(201);
    expect(response.body.classroom).toHaveProperty('name', 'Admin Classroom');
  });

  it('should not allow SchoolAdmin to create a classroom in another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321',
    });

    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Unauthorized Classroom',
        school: otherSchool._id.toString(), // Convert ObjectId to string
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/classrooms')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        school: schoolId,
      });

    expect(response.status).toBe(400);
  });
});
