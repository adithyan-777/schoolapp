const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');

jest.setTimeout(30000);

describe('User Read API', () => {
  let superAdminToken, schoolAdminToken;

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
  });

  it('should allow SuperAdmin to get all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should allow SuperAdmin to get a user by ID', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'SchoolAdmin',
    });

    const response = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
  });

  it('should not allow SchoolAdmin to get users from other schools', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${schoolAdminToken}`);

    expect(response.status).toBe(403);
  });
});
