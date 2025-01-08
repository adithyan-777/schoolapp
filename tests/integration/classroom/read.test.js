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

logger = require('../../../utils/logger');

jest.setTimeout(600000);

describe('Classroom Read API', () => {
  let superAdminToken, schoolAdminToken, schoolId, classroomId;

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
    schoolId = school._id.toString();

    schoolAdmin.school = schoolId;
    schoolAdminToken = await getAuthToken(schoolAdmin);

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      school: schoolId,
    });
    classroomId = classroom._id.toString();
  });

  it('should allow SuperAdmin to get a classroom by ID', async () => {
    const response = await request(app)
      .get(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Classroom');
  });

  it('should return 404 for non-existent classroom', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/api/classrooms/${nonExistentId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);
    logger.error(JSON.stringify(response.body));
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid classroom ID', async () => {
    const response = await request(app)
      .get('/api/classrooms/invalid-id')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(400);
  });

  it('should not allow SchoolAdmin to get classroom from another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '123 Other St',
      contactNumber: '1234567890',
    });

    const otherClassroom = await Classroom.create({
      name: 'Other Classroom',
      school: otherSchool._id.toString(),
    });

    const response = await request(app)
      .get(`/api/classrooms/${otherClassroom._id.toString()}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });
});
