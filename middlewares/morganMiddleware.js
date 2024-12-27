const morgan = require('morgan');
const logger = require('../logger');  // Import the winston logger

// Set up Morgan to use winston as the log stream
const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),  // Log HTTP request details using winston
    },
});

module.exports = morganMiddleware;