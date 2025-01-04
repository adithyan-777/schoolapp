const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin } = require('../../fixtures/users');

jest.setTimeout(30000);

describe('User Creation API', () => {
  let superAdminToken;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    superAdminToken = await getAuthToken(superAdmin);
  });

  it('should allow SuperAdmin to create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'SchoolAdmin',
      });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
  });

  it('should not allow creating a user with an existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'existinguser@example.com',
      password: 'password123',
      role: 'SchoolAdmin',
    });

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'New User',
        email: 'existinguser@example.com',
        password: 'password123',
        role: 'SchoolAdmin',
      });

    expect(response.status).toBe(400);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: 'invaliduser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(400);
  });
});
