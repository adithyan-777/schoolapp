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

describe('Classroom Delete API', () => {
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
    schoolId = school._id.toString(); // Convert ObjectId to string

    // Assign the school to the schoolAdmin
    schoolAdmin.school = schoolId;
    schoolAdminToken = await getAuthToken(schoolAdmin);

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      school: schoolId,
    });
    classroomId = classroom._id.toString(); // Convert ObjectId to string
  });

  it('should allow SuperAdmin to delete a classroom', async () => {
    const response = await request(app)
      .delete(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
  });

  it('should allow SchoolAdmin to delete a classroom in their school', async () => {
    const response = await request(app)
      .delete(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(200);
  });

  it('should not allow SchoolAdmin to delete a classroom in another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321',
    });

    const otherClassroom = await Classroom.create({
      name: 'Other Classroom',
      school: otherSchool._id.toString(), // Convert ObjectId to string
    });

    const response = await request(app)
      .delete(`/api/classrooms/${otherClassroom._id.toString()}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 for non-existent classroom', async () => {
    const nonExistentClassroomId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/api/classrooms/${nonExistentClassroomId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
  });
});
