module.exports = {
  '/api/teachers': {
    get: {
      summary: 'Get all teachers',
      description: 'Retrieve a list of all teachers.',
      tags: ['Teachers'],
      responses: {
        200: {
          description: 'A list of teachers.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '12345' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john.doe@example.com' },
                    school: { type: 'string', example: 'ABC High School' },
                    classrooms: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['Math 101', 'Science 202'],
                    },
                    subjects: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['Mathematics', 'Physics'],
                    },
                    designation: { type: 'string', example: 'Teacher' },
                    hireDate: {
                      type: 'string',
                      format: 'date',
                      example: '2023-01-15',
                    },
                    role: { type: 'string', example: 'Teacher' },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Failed to fetch teachers.',
        },
      },
    },
    post: {
      summary: 'Create a new teacher',
      description: 'Create a new teacher (SuperAdmin only).',
      tags: ['Teachers'],
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
                school: { type: 'string', example: 'ABC High School' },
                classrooms: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Math 101', 'Science 202'],
                },
                subjects: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Mathematics', 'Physics'],
                },
                designation: { type: 'string', example: 'Teacher' },
                hireDate: {
                  type: 'string',
                  format: 'date',
                  example: '2023-01-15',
                },
              },
              required: [
                'name',
                'email',
                'password',
                'school',
                'classrooms',
                'subjects',
                'designation',
                'hireDate',
              ],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Teacher created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '12345' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  school: { type: 'string', example: 'ABC High School' },
                  classrooms: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Math 101', 'Science 202'],
                  },
                  subjects: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Mathematics', 'Physics'],
                  },
                  designation: { type: 'string', example: 'Teacher' },
                  hireDate: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-15',
                  },
                  role: { type: 'string', example: 'Teacher' },
                },
              },
            },
          },
        },
        400: {
          description: 'Teacher with this name already exists.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/teachers/{id}': {
    get: {
      summary: 'Get a specific teacher',
      description: 'Retrieve a specific teacher by its ID.',
      tags: ['Teachers'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the teacher to retrieve.',
        },
      ],
      responses: {
        200: {
          description: 'The requested teacher.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '12345' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  school: { type: 'string', example: 'ABC High School' },
                  classrooms: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Math 101', 'Science 202'],
                  },
                  subjects: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Mathematics', 'Physics'],
                  },
                  designation: { type: 'string', example: 'Teacher' },
                  hireDate: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-15',
                  },
                  role: { type: 'string', example: 'Teacher' },
                },
              },
            },
          },
        },
        404: {
          description: 'Teacher not found.',
        },
        500: {
          description: 'Failed to fetch teacher.',
        },
      },
    },
    put: {
      summary: 'Update a teacher',
      description:
        'Update a teacher by its ID (SuperAdmin, SchoolAdmin, or Teacher only).',
      tags: ['Teachers'],
      // security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the teacher to update.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                school: { type: 'string', example: 'XYZ High School' },
                classrooms: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Math 101', 'Chemistry 202'],
                },
                subjects: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Biology', 'Chemistry'],
                },
                designation: { type: 'string', example: 'Senior Teacher' },
                hireDate: {
                  type: 'string',
                  format: 'date',
                  example: '2023-01-01',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Teacher updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '12345' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  school: { type: 'string', example: 'ABC High School' },
                  classrooms: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Math 101', 'Science 202'],
                  },
                  subjects: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Mathematics', 'Physics'],
                  },
                  designation: { type: 'string', example: 'Teacher' },
                  hireDate: {
                    type: 'string',
                    format: 'date',
                    example: '2023-01-15',
                  },
                  role: { type: 'string', example: 'Teacher' },
                },
              },
            },
          },
        },
        404: {
          description: 'Teacher not found.',
        },
        500: {
          description: 'Failed to update teacher.',
        },
      },
    },
    delete: {
      summary: 'Delete a teacher',
      description:
        'Delete a teacher by its ID (SuperAdmin or SchoolAdmin only).',
      tags: ['Teachers'],
      // security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the teacher to delete.',
        },
      ],
      responses: {
        200: {
          description: 'Teacher deleted successfully.',
        },
        404: {
          description: 'Teacher not found.',
        },
        500: {
          description: 'Failed to delete teacher.',
        },
      },
    },
  },
};
