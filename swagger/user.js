module.exports = {
  '/api/users': {
    get: {
      summary: 'Get all users',
      description: 'Retrieve a list of all users.',
      tags: ['Users'],
      security: [{ BearerAuth: [] }],
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
                    _id: { type: 'string', example: '5f8d0d55b54764421b7156c1' },
                    name: { type: 'string', example: 'Alice Smith' },
                    email: { type: 'string', example: 'alice.smith@example.com' },
                    role: { type: 'string', example: 'SchoolAdmin' },
                    school: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string', example: '5f8d0d55b54764421b7156c2' },
                        name: { type: 'string', example: 'Example School' },
                      },
                      nullable: true,
                    },
                    createdBy: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string', example: '5f8d0d55b54764421b7156c3' },
                        name: { type: 'string', example: 'Admin User' },
                        email: { type: 'string', example: 'admin.user@example.com' },
                      },
                    },
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
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Bob Johnson' },
                email: { type: 'string', example: 'bob.johnson@example.com' },
                password: { type: 'string', example: 'password123' },
                role: { type: 'string', example: 'SchoolAdmin' },
                school: { type: 'string', example: '5f8d0d55b54764421b7156c2' },
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
                  message: { type: 'string', example: 'User created successfully.' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '5f8d0d55b54764421b7156c4' },
                      email: { type: 'string', example: 'bob.johnson@example.com' },
                    },
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
      security: [{ BearerAuth: [] }],
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
                  _id: { type: 'string', example: '5f8d0d55b54764421b7156c5' },
                  name: { type: 'string', example: 'Charlie Brown' },
                  email: { type: 'string', example: 'charlie.brown@example.com' },
                  role: { type: 'string', example: 'SchoolAdmin' },
                  school: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '5f8d0d55b54764421b7156c2' },
                      name: { type: 'string', example: 'Example School' },
                    },
                    nullable: true,
                  },
                  createdBy: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '5f8d0d55b54764421b7156c3' },
                      name: { type: 'string', example: 'Admin User' },
                      email: { type: 'string', example: 'admin.user@example.com' },
                    },
                  },
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
      security: [{ BearerAuth: [] }],
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
                name: { type: 'string', example: 'David Clark' },
                email: { type: 'string', example: 'david.clark@example.com' },
                role: { type: 'string', example: 'SchoolAdmin' },
                school: { type: 'string', example: '5f8d0d55b54764421b7156c2' },
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
                  _id: { type: 'string', example: '5f8d0d55b54764421b7156c6' },
                  name: { type: 'string', example: 'David Clark' },
                  email: { type: 'string', example: 'david.clark@example.com' },
                  role: { type: 'string', example: 'SchoolAdmin' },
                  school: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '5f8d0d55b54764421b7156c2' },
                      name: { type: 'string', example: 'Example School' },
                    },
                    nullable: true,
                  },
                  createdBy: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '5f8d0d55b54764421b7156c3' },
                      name: { type: 'string', example: 'Admin User' },
                      email: { type: 'string', example: 'admin.user@example.com' },
                    },
                  },
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
          description: 'Failed to update user.',
        },
      },
    },
    delete: {
      summary: 'Delete a user',
      description: 'Delete a user by its ID (SuperAdmin only).',
      tags: ['Users'],
      security: [{ BearerAuth: [] }],
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'User deleted successfully' },
                },
              },
            },
          },
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
