const request = require('supertest');
const app = require('../../../server');
const dbHandler = require('../../setup/dbHandler');
const User = require('../../../models/user');
const School = require('../../../models/school');
const { getAuthToken } = require('../../utils/authHelpers');
const { superAdmin, schoolAdmin } = require('../../fixtures/users');

jest.setTimeout(30000);

describe('School Creation API', () => {
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

  it('should allow SuperAdmin to create a new school', async () => {
    const response = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'New School',
        address: '123 New St',
        contactNumber: '1234567890'
      });

    expect(response.status).toBe(201);
    expect(response.body.school).toHaveProperty('name', 'New School');
  });

  it('should not allow SchoolAdmin to create a new school', async () => {
    const response = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${schoolAdminToken}`)
      .send({
        name: 'Another School',
        address: '456 Another St',
        contactNumber: '0987654321'
      });

    expect(response.status).toBe(403);
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        address: '789 Missing Name St',
        contactNumber: '1122334455'
      });

    expect(response.status).toBe(400);
  });
});