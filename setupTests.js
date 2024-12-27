const connectDB = require('./db'); // Adjust the path as needed
const mongoose = require('mongoose');

beforeAll(async () => {
    await connectDB(); // Centralized connection
});

afterAll(async () => {
    await mongoose.disconnect();
    console.log('Database connection closed');
});

afterEach(async () => {
    // Clean up database
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        await mongoose.connection.collections[collectionName].deleteMany({});
    }
});
