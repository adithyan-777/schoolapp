const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const { superAdmin } = require('../../fixtures/users');

jest.setTimeout(30000);

describe('Auth API - Login', () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    await dbHandler.clearDatabase();
    await User.create(superAdmin);
  });

  it('should login with valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: superAdmin.email,
      password: superAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: superAdmin.email,
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
  });

  it('should not login with non-existent user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(401);
  });
});
