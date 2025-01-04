const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');

jest.setTimeout(30000);

describe('User Update API', () => {
  let superAdminToken, schoolAdminToken, userId;

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

    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'SchoolAdmin',
    });
    userId = user._id;
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

  it('should not allow SchoolAdmin to update a user from another school', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
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
