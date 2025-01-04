const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');
const mongoose = require('mongoose');

jest.setTimeout(30000);

describe('School Delete API', () => {
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

  it('should allow SuperAdmin to delete a school', async () => {
    const response = await request(app)
      .delete(`/api/schools/${schoolId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
  });

  it('should not allow SchoolAdmin to delete a school', async () => {
    const response = await request(app)
      .delete(`/api/schools/${schoolId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 for non-existent school', async () => {
    const nonExistentSchoolId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/api/schools/${nonExistentSchoolId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
  });
});