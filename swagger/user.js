module.exports = {
  '/api/users': {
    get: {
      summary: 'Get all users',
      description: 'Retrieve a list of all users.',
      tags: ['Users'],
      responses: {
        200: {
          description: 'A list of users.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '1a2b3c' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    role: { type: 'string', example: 'SuperAdmin' },
                    school: { type: 'string', example: 'XYZ High School' },
                    createdBy: { type: 'string', example: 'AdminUser123' },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2023-01-15T10:00:00Z',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2023-02-01T12:30:00Z',
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Failed to fetch users.',
        },
      },
    },
    post: {
      summary: 'Create a new user',
      description: 'Create a new user (SuperAdmin only).',
      tags: ['Users'],
      // security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                password: { type: 'string', example: 'password123' },
                role: { type: 'string', example: 'SchoolAdmin' },
                school: { type: 'string', example: 'XYZ High School' },
              },
              required: ['name', 'email', 'password', 'role'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1a2b3c' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  role: { type: 'string', example: 'SchoolAdmin' },
                  school: { type: 'string', example: 'XYZ High School' },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-15T10:00:00Z',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'User with this email already exists.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/users/{id}': {
    get: {
      summary: 'Get a specific user',
      description: 'Retrieve a specific user by its ID.',
      tags: ['Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the user to retrieve.',
        },
      ],
      responses: {
        200: {
          description: 'The requested user.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1a2b3c' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  role: { type: 'string', example: 'SchoolAdmin' },
                  school: { type: 'string', example: 'XYZ High School' },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-15T10:00:00Z',
                  },
                  updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-02-01T12:30:00Z',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found.',
        },
        500: {
          description: 'Failed to fetch user.',
        },
      },
    },
    put: {
      summary: 'Update a user',
      description: 'Update a user by its ID (SuperAdmin or SchoolAdmin only).',
      tags: ['Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the user to update.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Jane Doe' },
                email: { type: 'string', example: 'jane.doe@example.com' },
                role: { type: 'string', example: 'SchoolAdmin' },
                school: { type: 'string', example: 'ABC High School' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1a2b3c' },
                  name: { type: 'string', example: 'Jane Doe' },
                  email: { type: 'string', example: 'jane.doe@example.com' },
                  role: { type: 'string', example: 'SchoolAdmin' },
                  school: { type: 'string', example: 'ABC High School' },
                  updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-02-01T12:30:00Z',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'User not found.',
        },
        500: {
          description: 'Failed to update user.',
        },
      },
    },
    delete: {
      summary: 'Delete a user',
      description: 'Delete a user by its ID (SuperAdmin only).',
      tags: ['Users'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the user to delete.',
        },
      ],
      responses: {
        200: {
          description: 'User deleted successfully.',
        },
        404: {
          description: 'User not found.',
        },
        500: {
          description: 'Failed to delete user.',
        },
      },
    },
  },
};
