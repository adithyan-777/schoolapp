const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const https = require('https');
const http = require('http');
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
const rateLimit = require('express-rate-limit');

// Apply a rate limit to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.MAX_REQUESTS, // Limit each IP to 500 requests per `window` (15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Apply the rate limiter to all requests
dotenv.config();
connectDB();

const app = express();

app.use(limiter);

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(helmet());

const corsOptions = {
  origin: '*', // Allow all domains (can be changed to specific domains if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Logging for every incoming request
app.use((req, res, next) => {
  logger.debug(`${req.method} request to ${req.url}`);
  next();
});

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.get('/', (req, res) => {
  res.send('School Management API');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

// Error handler middleware
app.use(errorHandler);

// Determine the environment
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || (ENV === 'production' ? 443 : 3000);

if (ENV === 'production') {
  // Set up SSL certificate options for production
  const sslOptions = {
    cert: fs.readFileSync('/etc/ssl/certs/mydomain.crt'), // Path to your self-signed certificate
    key: process.env.SSL_KEY, // Path to your private key
  };

  // Start HTTPS server
  https.createServer(sslOptions, app).listen(PORT, () => {
    logger.info(`HTTPS Server running on port ${PORT}`);
    logger.info(`API Docs available at https://localhost:${PORT}/api-docs`);
  });
} else {
  // Start HTTP server for development
  http.createServer(app).listen(PORT, () => {
    logger.info(`HTTP Server running on port ${PORT}`);
    logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
