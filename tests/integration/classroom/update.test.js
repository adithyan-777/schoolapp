const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const Classroom = require('../../../models/classroom');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');

jest.setTimeout(30000);

describe('Classroom Update API', () => {
  let superAdminToken, schoolAdminToken, schoolId, classroomId;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
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

  it('should allow SuperAdmin to update a classroom', async () => {
    const response = await request(app)
      .put(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Updated Classroom',
      });

    expect(response.status).toBe(200);
    expect(response.body.classroom).toHaveProperty('name', 'Updated Classroom');
  });

  it('should allow SchoolAdmin to update a classroom in their school', async () => {
    const response = await request(app)
      .put(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Updated Classroom by Admin',
      });

    expect(response.status).toBe(200);
    expect(response.body.classroom).toHaveProperty(
      'name',
      'Updated Classroom by Admin',
    );
  });

  it('should not allow SchoolAdmin to update a classroom in another school', async () => {
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
      .put(`/api/classrooms/${otherClassroom._id.toString()}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Unauthorized Update',
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .put(`/api/classrooms/${classroomId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
  });
});
