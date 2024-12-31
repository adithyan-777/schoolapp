const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./utils/logger'); // Import the logger
const setupSwagger = require('./swagger/swagger'); // Import the Swagger setup
const errorHandler = require('./middlewares/errorHandlerMiddleware')

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

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
// app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);


app.use(errorHandler);

// Set up the server to listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
});
