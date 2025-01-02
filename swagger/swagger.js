const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./auth');
const studentRoutes = require('./students');
const schoolRoutes = require('./schools');
const classroomsRoutes = require('./classrooms');
const userRoutes = require('./user');

// Base Swagger configuration
const swaggerBase = {
  openapi: '3.0.0',
  info: {
    title: 'School Management API',
    description:
      'API for managing schools, classrooms, and user authentication.',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Unauthorized' },
              },
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Internal Server Error' },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {}, // Will be populated with individual API docs
};

// Merge all API paths
swaggerBase.paths = {
  ...swaggerBase.paths,
  ...authRoutes,
  ...studentRoutes,
  ...classroomsRoutes,
  ...schoolRoutes,
  ...userRoutes,
  // ...teachersRoutes,
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerBase));
};
