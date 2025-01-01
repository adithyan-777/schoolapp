module.exports = {
  '/api/classrooms/{schoolId}': {
    get: {
      summary: 'Get all classrooms in a school',
      description:
        'Retrieve all classrooms for a specific school by school ID.',
      tags: ['Classrooms'],
      parameters: [
        {
          name: 'schoolId',
          in: 'path',
          required: true,
          description:
            'The ID of the school whose classrooms are being retrieved.',
          schema: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85',
          },
        },
      ],
      responses: {
        200: {
          description: 'List of classrooms retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '60d21b9467d0d8992e610c87' },
                    name: { type: 'string', example: 'Classroom A' },
                    teacher: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'John Doe' },
                        email: {
                          type: 'string',
                          example: 'johndoe@example.com',
                        },
                      },
                    },
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
          description: 'No classrooms found for the school.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No classrooms found for this school',
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
  '/api/classrooms': {
    post: {
      summary: 'Create a new classroom',
      description:
        'Create a new classroom for a specific school. Requires authentication.',
      tags: ['Classrooms'],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Classroom B' },
                teacher: {
                  type: 'string',
                  example: '60d21b4667d0d8992e610c80',
                },
                school: { type: 'string', example: '60d21b4667d0d8992e610c85' },
              },
              required: ['name', 'school'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Classroom created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Classroom created successfully',
                  },
                  classroom: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '60d21b9467d0d8992e610c87',
                      },
                      name: { type: 'string', example: 'Classroom B' },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'School or teacher not found.',
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
  },
  '/api/classrooms/{classroomId}': {
    put: {
      summary: 'Update a classroom by ID',
      description:
        'Update details of a classroom by its ID. Requires authentication.',
      tags: ['Classrooms'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'classroomId',
          in: 'path',
          required: true,
          description: 'The ID of the classroom to be updated.',
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
                name: { type: 'string', example: 'Updated Classroom Name' },
                teacher: {
                  type: 'string',
                  example: '60d21b4667d0d8992e610c80',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Classroom updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Classroom updated successfully',
                  },
                  classroom: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '60d21b9467d0d8992e610c87',
                      },
                      name: {
                        type: 'string',
                        example: 'Updated Classroom Name',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Classroom not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Classroom not found' },
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
      summary: 'Delete a classroom by ID',
      description: 'Delete a classroom by its ID. Requires authentication.',
      tags: ['Classrooms'],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'classroomId',
          in: 'path',
          required: true,
          description: 'The ID of the classroom to be deleted.',
          schema: {
            type: 'string',
            example: '60d21b9467d0d8992e610c87',
          },
        },
      ],
      responses: {
        200: {
          description: 'Classroom deleted successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Classroom deleted successfully',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'Classroom not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Classroom not found' },
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
