const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your Express app is in server.js
const User = require('../models/user'); // Adjust the path to your User model

beforeAll(async () => {
  try {
    // Disconnect the previous connection if it exists
    if (mongoose.connection.readyState !== 0) {
      console.log('Disconnecting existing connection...');
      await mongoose.disconnect();
    }

    // Connect to the new database
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
  }
  // Ensure you're connecting to a test database
  // await mongoose.connect(process.env.MONGO_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // Clean up any existing data to start with a clean slate for each test
  await User.deleteMany({});

  // Create a superuser to authenticate other users
  const superuserData = {
    email: 'superadmin1@example.com',
    password: 'password123',
    name: 'Super Admin1',
    role: 'SuperAdmin',
    school: new mongoose.Types.ObjectId().toString(), // Mock MongoDB ObjectId
  };

  const superuser = await User.create(superuserData);

  // Generate token for superuser
  const response = await request(app).post('/api/auth/login').send({
    email: superuserData.email,
    password: superuserData.password,
  });

  // Store the auth token in a global variable to use it in tests
  global.superuserToken = response.body.token;
});

afterAll(async () => {
  // Close the database connection after tests
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  const userData = {
    email: 'testuser1@example.com',
    password: 'password123',
    name: 'Test User1',
    role: 'SchoolAdmin',
    school: new mongoose.Types.ObjectId().toString(), // Mock MongoDB ObjectId
  };

  it('should register a new user with superuser token', async () => {
    console.log(global.superuserToken);
    const response = await request(app)
      .post('/api/users') // Correct API path for creating user
      .set('Authorization', `Bearer ${global.superuserToken}`) // Set the token in Authorization header
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });

  it('should not register a new user without token', async () => {
    const response = await request(app)
      .post('/api/users') // Correct API path for creating user
      .send(userData);

    expect(response.status).toBe(401); // Unauthorized status code
    expect(response.body.message).toBe('No token provided');
  });
});
