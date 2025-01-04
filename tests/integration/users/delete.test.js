const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');
const mongoose = require('mongoose');

jest.setTimeout(30000);

describe('User Delete API', () => {
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

  it('should allow SuperAdmin to delete a user', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
  });

  it('should not allow SchoolAdmin to delete a user from another school', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/users/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
  });
});
