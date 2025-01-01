const winston = require('winston');

// Create a custom logger
const logger = winston.createLogger({
  level: 'debug', // Set default log level
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [
    // Console transport (prints logs to console)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // File transport (logs are saved to a file)
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

module.exports = logger;
