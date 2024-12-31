class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message); // Pass the message to the Error constructor
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture the stack trace (optional: exclude this constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
