const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./utils/logger'); // Import the logger
const setupSwagger = require('./swagger/swagger'); // Import the Swagger setup
const errorHandler = require('./middlewares/errorHandlerMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(helmet());
app.use(cors());

// Logging for every incoming request
app.use((req, res, next) => {
  logger.debug(`${req.method} request to ${req.url}`);
  next();
});

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

// Error handler middleware
app.use(errorHandler);

// Set up SSL certificate options
const sslOptions = {
  cert: fs.readFileSync('/etc/ssl/certs/mydomain.crt'), // Path to your self-signed certificate
  key: process.env.SSL_KEY, // Path to your private key
};

// Set up the server to listen on a secure HTTPS port
const PORT = process.env.PORT || 443; // Using 443 for HTTPS by default
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`HTTPS Server running on port ${PORT}`);
  logger.info(`API Docs available at https://localhost:${PORT}/api-docs`);
});

module.exports = app;
