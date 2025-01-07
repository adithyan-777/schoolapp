const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const Classroom = require('../../../models/classroom');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');
const logger = require('../../../utils/logger');

jest.setTimeout(30000);

describe('Student Creation API', () => {
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
    schoolAdmin.school = schoolId;
    schoolAdminToken = await getAuthToken(schoolAdmin);

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      school: schoolId,
    });
    classroomId = classroom._id.toString(); // Convert ObjectId to string
  });

  it('should allow SuperAdmin to create a new student', async () => {
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        school: schoolId.toString(), // Convert ObjectId to string
        classroom: classroomId,
        enrollmentStatus: 'Enrolled',
      });
    logger.error(JSON.stringify(response.body));
    expect(response.status).toBe(201);
    expect(response.body.student).toHaveProperty(
      'email',
      'john.doe@example.com',
    );
  });

  it('should allow SchoolAdmin to create a new student in their school', async () => {
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '0987654321',
        school: schoolId.toString(), // Convert ObjectId to string
        classroom: classroomId,
        enrollmentStatus: 'Enrolled',
      });

    logger.error(JSON.stringify(response.body));
    expect(response.status).toBe(201);
    expect(response.body.student).toHaveProperty(
      'email',
      'jane.doe@example.com',
    );
  });

  it('should not allow SchoolAdmin to create a student in another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321',
    });

    const otherClassroom = await Classroom.create({
      name: 'Other Classroom',
      school: otherSchool._id,
    });

    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        firstName: 'Jake',
        lastName: 'Doe',
        email: 'jake.doe@example.com',
        phone: '1122334455',
        school: otherSchool._id.toString(), // Convert ObjectId to string
        classroom: otherClassroom._id.toString(), // Convert ObjectId to string
        enrollmentStatus: 'Active',
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        firstName: 'Invalid',
        email: 'invalid@example.com',
      });

    expect(response.status).toBe(400);
  });
});
