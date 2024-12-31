module.exports = {
  '/api/students': {
    post: {
      summary: 'Create a new student',
      description: 'Create a new student (SuperAdmin or SchoolAdmin only).',
      tags: ['Students'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string', description: 'First name of the student.' },
                lastName: { type: 'string', description: 'Last name of the student.' },
                email: { type: 'string', description: 'Email of the student.' },
                phone: { type: 'string', description: 'Phone number of the student.' },
                classroom: { type: 'string', description: 'ID of the classroom.' },
                school: { type: 'string', description: 'ID of the school.' },
                enrollmentStatus: { type: 'string', description: 'Enrollment status of the student.' },
                enrollmentHistory: { type: 'array', items: { type: 'string' }, description: 'Enrollment history of the student.' },
                guardians: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Guardian name.' },
                      contact: { type: 'string', description: 'Guardian contact.' },
                    },
                  },
                  description: 'Details of guardians.',
                },
              },
              required: ['firstName', 'lastName', 'email', 'classroom', 'school'],
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
                  id: { type: 'string', description: 'ID of the student.' },
                  firstName: { type: 'string', description: 'First name of the student.' },
                  lastName: { type: 'string', description: 'Last name of the student.' },
                },
              },
            },
          },
        },
        400: {
          description: 'Student with this email already exists.',
        },
        404: {
          description: 'Classroom or school not found.',
        },
        500: {
          description: 'Internal server error.',
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
                    firstName: { type: 'string', description: 'First name of the student.' },
                    lastName: { type: 'string', description: 'Last name of the student.' },
                    email: { type: 'string', description: 'Email of the student.' },
                    classroom: { type: 'object', description: 'Details of the classroom.' },
                    school: { type: 'object', description: 'Details of the school.' },
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
  '/api/students/school/{schoolId}': {
    get: {
      summary: 'Get students by school ID',
      description: 'Retrieve a list of students belonging to a specific school.',
      tags: ['Students'],
      parameters: [
        {
          name: 'schoolId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the school.',
        },
      ],
      responses: {
        200: {
          description: 'A list of students belonging to the specified school.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'ID of the student.' },
                    firstName: { type: 'string', description: 'First name of the student.' },
                    lastName: { type: 'string', description: 'Last name of the student.' },
                    email: { type: 'string', description: 'Email of the student.' },
                    classroom: { type: 'object', description: 'Details of the classroom.' },
                    school: { type: 'object', description: 'Details of the school.' },
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'No students found for this school.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/students/school/{schoolId}/classroom/{classroomId}': {
    get: {
      summary: 'Get students by school and classroom ID',
      description: 'Retrieve a list of students belonging to a specific school and classroom.',
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
          description: 'A list of students belonging to the specified school and classroom.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'ID of the student.' },
                    firstName: { type: 'string', description: 'First name of the student.' },
                    lastName: { type: 'string', description: 'Last name of the student.' },
                    email: { type: 'string', description: 'Email of the student.' },
                    classroom: { type: 'object', description: 'Details of the classroom.' },
                    school: { type: 'object', description: 'Details of the school.' },
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
    put: {
      summary: 'Update a student by ID',
      description: 'Update details of a specific student (SuperAdmin, SchoolAdmin, or Teacher only).',
      tags: ['Students'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the student.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string', description: 'First name of the student.' },
                lastName: { type: 'string', description: 'Last name of the student.' },
                email: { type: 'string', description: 'Email of the student.' },
                phone: { type: 'string', description: 'Phone number of the student.' },
                classroom: { type: 'string', description: 'ID of the classroom.' },
                school: { type: 'string', description: 'ID of the school.' },
                enrollmentStatus: { type: 'string', description: 'Enrollment status of the student.' },
                enrollmentHistory: { type: 'array', items: { type: 'string' }, description: 'Enrollment history of the student.' },
                guardians: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', description: 'Guardian name.' },
                      contact: { type: 'string', description: 'Guardian contact.' },
                    },
                  },
                  description: 'Details of guardians.',
                },
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
                  id: { type: 'string', description: 'ID of the student.' },
                  firstName: { type: 'string', description: 'First name of the student.' },
                  lastName: { type: 'string', description: 'Last name of the student.' },
                },
              },
            },
          },
        },
        404: {
          description: 'Student not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
    delete: {
      summary: 'Delete a student by ID',
      description: 'Delete a specific student by ID (SuperAdmin or SchoolAdmin only).',
      tags: ['Students'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'The ID of the student.',
        },
      ],
      responses: {
        200: {
          description: 'Student deleted successfully.',
        },
        404: {
          description: 'Student not found.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
};
