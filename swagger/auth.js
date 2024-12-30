module.exports = {
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User login',
      description: 'Logs in a user and returns a JWT token if the credentials are valid.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'The email address of the user.',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  description: 'The password of the user.',
                  example: 'password123',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful. Returns a JWT token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'JWT token for the authenticated user.',
                  },
                },
                example: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/Unauthorized',
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
                example: {
                  message: 'User not found',
                },
              },
            },
          },
        },
        500: {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
