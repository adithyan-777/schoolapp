const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const Classroom = require('../../../models/classroom');
const Student = require('../../../models/student');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');
const { testStudent } = require('../../fixtures/students');

jest.setTimeout(30000);

describe('Student Read API', () => {
  let superAdminToken, schoolAdminToken, schoolId, classroomId, studentId;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    superAdminToken = await getAuthToken(superAdmin);
    schoolAdminToken = await getAuthToken(schoolAdmin);

    const school = await School.create(testSchool);
    schoolId = school._id;

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      school: schoolId
    });
    classroomId = classroom._id;

    const student = await Student.create({
      ...testStudent,
      school: schoolId,
      classroom: classroomId
    });
    studentId = student._id;
  });

  it('should allow SuperAdmin to get all students', async () => {
    const response = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should allow SuperAdmin to get a student by ID', async () => {
    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testStudent.email);
  });

  it('should allow SchoolAdmin to get students in their school', async () => {
    const response = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should not allow SchoolAdmin to get students from another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321'
    });

    const otherClassroom = await Classroom.create({
      name: 'Other Classroom',
      school: otherSchool._id
    });

    const otherStudent = await Student.create({
      firstName: 'Other',
      lastName: 'Student',
      email: 'other.student@example.com',
      phone: '1122334455',
      school: otherSchool._id,
      classroom: otherClassroom._id,
      enrollmentStatus: 'Enrolled'
    });

    const response = await request(app)
      .get(`/api/students/${otherStudent._id}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });
});