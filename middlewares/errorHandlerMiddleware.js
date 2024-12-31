const logger = require("../utils/logger")
const AppError = require("../utils/appError");



const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    logger.error({
      timestamp: new Date().toISOString(),
      statusCode: err.statusCode,
      message: err.message,
    });
    res.status(err.statusCode).json({ message: err.message });
  } else {
    logger.error({
      timestamp: new Date().toISOString(),
      statusCode: 500,
      message: 'Internal Server Error',
      stack: err.stack,
    });
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

module.exports = errorHandler