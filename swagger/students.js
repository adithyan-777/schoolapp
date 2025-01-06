module.exports = {
  '/api/students': {
    post: {
      summary: 'Create a new student',
      description: 'Create a new student for a specific school. Requires authentication.',
      tags: ['Students'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Student B' },
                school: { type: 'string', example: '60d21b4667d0d8992e610c85' },
              },
              required: ['name', 'school'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Student created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student created successfully' },
                  student: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '60d21b9467d0d8992e610c87' },
                      name: { type: 'string', example: 'Student B' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'School not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'School not found' },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Server error' },
                  error: { type: 'string', example: 'Error details' },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: 'Get all students',
      description: 'Retrieve a list of all students.',
      tags: ['Students'],
      responses: {
        200: {
          description: 'A list of students.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'ID of the student.' },
                    firstName: {
                      type: 'string',
                      description: 'First name of the student.',
                    },
                    lastName: {
                      type: 'string',
                      description: 'Last name of the student.',
                    },
                    email: {
                      type: 'string',
                      description: 'Email of the student.',
                    },
                    classroom: {
                      type: 'object',
                      description: 'Details of the classroom.',
                    },
                    school: {
                      type: 'object',
                      description: 'Details of the school.',
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/students/school/{id}': {
    get: {
      summary: 'Get all students in a school',
      description: 'Retrieve all students for a specific school by school ID.',
      tags: ['Students'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The ID of the school whose students are being retrieved.',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'List of students retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '60d21b9467d0d8992e610c87' },
                    name: { type: 'string', example: 'Student A' },
                    school: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Greenwood High' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'No students found for the school.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No students found for this school',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Server error' },
                  error: { type: 'string', example: 'Error details' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/students/school/{schoolId}/classroom/{classroomId}': {
    get: {
      summary: 'Get students by school and classroom ID',
      description:
        'Retrieve a list of students belonging to a specific school and classroom.',
      tags: ['Students'],
      parameters: [
        {
          name: 'schoolId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the school.',
        },
        {
          name: 'classroomId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the classroom.',
        },
      ],
      responses: {
        200: {
          description:
            'A list of students belonging to the specified school and classroom.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'ID of the student.' },
                    firstName: {
                      type: 'string',
                      description: 'First name of the student.',
                    },
                    lastName: {
                      type: 'string',
                      description: 'Last name of the student.',
                    },
                    email: {
                      type: 'string',
                      description: 'Email of the student.',
                    },
                    classroom: {
                      type: 'object',
                      description: 'Details of the classroom.',
                    },
                    school: {
                      type: 'object',
                      description: 'Details of the school.',
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'No students found for this school and classroom.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/students/{id}': {
    get: {
      summary: 'Get a student by ID',
      description: 'Retrieve a specific student by their ID.',
      tags: ['Students'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The ID of the student to be retrieved.',
          schema: {
            type: 'string',
            example: '60d21b9467d0d8992e610c87',
          },
        },
      ],
      responses: {
        200: {
          description: 'Student retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '60d21b9467d0d8992e610c87' },
                  name: { type: 'string', example: 'Student A' },
                  school: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Greenwood High' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Student not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student not found' },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Server error' },
                  error: { type: 'string', example: 'Error details' },
                },
              },
            },
          },
        },
      },
    },
    put: {
      summary: 'Update a student by ID',
      description: 'Update details of a student by their ID. Requires authentication.',
      tags: ['Students'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The ID of the student to be updated.',
          schema: {
            type: 'string',
            example: '60d21b9467d0d8992e610c87',
          },
        },
      ],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Updated Student Name' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Student updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student updated successfully' },
                  student: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '60d21b9467d0d8992e610c87' },
                      name: { type: 'string', example: 'Updated Student Name' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Student not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student not found' },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Server error' },
                  error: { type: 'string', example: 'Error details' },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      summary: 'Delete a student by ID',
      description: 'Delete a student by their ID. Requires authentication.',
      tags: ['Students'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'The ID of the student to be deleted.',
          schema: {
            type: 'string',
            example: '60d21b9467d0d8992e610c87',
          },
        },
      ],
      responses: {
        200: {
          description: 'Student deleted successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student deleted successfully' },
                },
              },
            },
          },
        },
        404: {
          description: 'Student not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Student not found' },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Server error' },
                  error: { type: 'string', example: 'Error details' },
                },
              },
            },
          },
        },
      },
    },
  },
};
