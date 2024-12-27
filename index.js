const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morganMiddleware = require('./middlewares/morganMiddleware');
const logger = require('./logger');

const checkAuth = require('./middlewares/checkAuth');
const checkRole = require('./middlewares/checkRole');
const schoolRoutes = require('./routes/schoolRoutes');
const userRoutes = require('./routes/userRoutes');
const classroomRoutes = require('./routes/classRoomRoutes')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Morgan for HTTP request logging
app.use(morganMiddleware);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error(`MongoDB connection error: ${err.message}`));

// Public Routes (e.g., user login and register)
app.use('/api/users', userRoutes);

// Secured Routes (Require Authentication)
app.use(checkAuth); // Protect routes beyond this point
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);

// Global Error Handler (for uncaught errors)
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ message: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
