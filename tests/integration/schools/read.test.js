const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');

jest.setTimeout(30000);

describe('School Read API', () => {
  let superAdminToken, schoolAdminToken, schoolId;

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
  });

  it('should allow SuperAdmin to get all schools', async () => {
    const response = await request(app)
      .get('/api/schools')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should allow SuperAdmin to get a school by ID', async () => {
    const response = await request(app)
      .get(`/api/schools/${schoolId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', testSchool.name);
  });

  it('should allow SchoolAdmin to get their school', async () => {
    const response = await request(app)
      .get(`/api/schools/${schoolId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', testSchool.name);
  });

  it('should not allow SchoolAdmin to get another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321'
    });

    const response = await request(app)
      .get(`/api/schools/${otherSchool._id.toString()}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });
});