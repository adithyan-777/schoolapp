const request = require('supertest');
const app = require('../../server');
const User = require('../../models/user');

async function getAuthToken(userDetails) {
  const user = await User.create(userDetails);
  const response = await request(app).post('/api/auth/login').send({
    email: userDetails.email,
    password: userDetails.password,
  });
  return response.body.token;
}

module.exports = { getAuthToken };
