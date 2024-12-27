const winston = require('winston');

// Create a custom logger
const logger = winston.createLogger({
    level: 'info', // Default log level
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }), // Console output
        new winston.transports.File({ filename: 'logs/app.log', level: 'info' }), // Log to a file
    ],
});

module.exports = logger;
