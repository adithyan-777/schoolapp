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

describe('Student Update API', () => {
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

    const school = await School.create(testSchool);
    schoolId = school._id.toString(); // Convert ObjectId to string

    // Assign the school to the schoolAdmin
    schoolAdmin.school = schoolId;
    schoolAdminToken = await getAuthToken(schoolAdmin);

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      school: schoolId
    });
    classroomId = classroom._id.toString(); // Convert ObjectId to string

    const student = await Student.create({
      ...testStudent,
      school: schoolId,
      classroom: classroomId
    });
    studentId = student._id.toString(); // Convert ObjectId to string
  });

  it('should allow SuperAdmin to update a student', async () => {
    const response = await request(app)
      .put(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        firstName: 'Updated John',
        lastName: 'Updated Doe'
      });

    expect(response.status).toBe(200);
    expect(response.body.student).toHaveProperty('firstName', 'Updated John');
  });

  it('should allow SchoolAdmin to update a student in their school', async () => {
    const response = await request(app)
      .put(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        firstName: 'Updated Jane',
        lastName: 'Updated Doe'
      });

    expect(response.status).toBe(200);
    expect(response.body.student).toHaveProperty('firstName', 'Updated Jane');
  });

  it('should not allow SchoolAdmin to update a student in another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321'
    });

    const otherClassroom = await Classroom.create({
      name: 'Other Classroom',
      school: otherSchool._id.toString() // Convert ObjectId to string
    });

    const otherStudent = await Student.create({
      firstName: 'Other',
      lastName: 'Student',
      email: 'other.student@example.com',
      phone: '1122334455',
      school: otherSchool._id.toString(), // Convert ObjectId to string
      classroom: otherClassroom._id.toString(), // Convert ObjectId to string
      enrollmentStatus: 'Enrolled'
    });

    const response = await request(app)
      .put(`/api/students/${otherStudent._id}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        firstName: 'Unauthorized Update'
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .put(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: ''
      });

    expect(response.status).toBe(400);
  });
});