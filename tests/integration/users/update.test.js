const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const { testSchool } = require('../../fixtures/schools');

jest.setTimeout(30000);

describe('User Update API', () => {
  let superAdminToken, schoolAdminToken, schoolId, userId;

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

    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'SchoolAdmin',
      school: schoolId,
    });
    userId = user._id.toString(); // Convert ObjectId to string
  });

  it('should allow SuperAdmin to update a user', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Updated User',
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('name', 'Updated User');
  });

  it('should allow SchoolAdmin to update a user in their school', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Updated User by Admin',
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('name', 'Updated User by Admin');
  });

  it('should not allow SchoolAdmin to update a user in another school', async () => {
    const otherSchool = await School.create({
      name: 'Other School',
      address: '456 Other St',
      contactNumber: '0987654321',
    });

    const otherUser = await User.create({
      name: 'Other User',
      email: 'otheruser@example.com',
      password: 'password123',
      role: 'SchoolAdmin',
      school: otherSchool._id.toString(), // Convert ObjectId to string
    });

    const response = await request(app)
      .put(`/api/users/${otherUser._id.toString()}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Unauthorized Update',
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: '',
      });

    expect(response.status).toBe(400);
  });
});
