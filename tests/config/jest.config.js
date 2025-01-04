module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['../setup/setupTests.js'],
  testMatch: ['../**/*.test.js'],
  verbose: true,
};
