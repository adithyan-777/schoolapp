module.exports = {
  '/api/schools': {
    get: {
      summary: 'Get all schools',
      description: 'Retrieve a list of all schools.',
      tags: ['Schools'],
      responses: {
        200: {
          description: 'A list of schools.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'The ID of the school.',
                    },
                    name: {
                      type: 'string',
                      description: 'The name of the school.',
                    },
                    address: {
                      type: 'string',
                      description: 'The address of the school.',
                    },
                    contactNumber: {
                      type: 'string',
                      description: 'The contact number of the school.',
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Failed to fetch schools.',
        },
      },
    },
    post: {
      summary: 'Create a new school',
      description: 'Create a new school (SuperAdmin only).',
      tags: ['Schools'],
      // security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the school.',
                },
                address: {
                  type: 'string',
                  description: 'The address of the school.',
                },
                contactNumber: {
                  type: 'string',
                  description: 'The contact number of the school.',
                },
              },
              required: ['name', 'address', 'contactNumber'],
            },
          },
        },
      },
      responses: {
        201: {
          description: 'School created successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'The ID of the school.',
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the school.',
                  },
                  address: {
                    type: 'string',
                    description: 'The address of the school.',
                  },
                  contactNumber: {
                    type: 'string',
                    description: 'The contact number of the school.',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'School with this name already exists.',
        },
        500: {
          description: 'Internal server error.',
        },
      },
    },
  },
  '/api/schools/{id}': {
    get: {
      summary: 'Get a specific school',
      description: 'Retrieve a specific school by its ID.',
      tags: ['Schools'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the school to retrieve.',
        },
      ],
      responses: {
        200: {
          description: 'The requested school.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'The ID of the school.',
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the school.',
                  },
                  address: {
                    type: 'string',
                    description: 'The address of the school.',
                  },
                  contactNumber: {
                    type: 'string',
                    description: 'The contact number of the school.',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'School not found.',
        },
        500: {
          description: 'Failed to fetch school.',
        },
      },
    },
    put: {
      summary: 'Update a school',
      description:
        'Update a school by its ID (SuperAdmin or SchoolAdmin only).',
      tags: ['Schools'],
      // security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the school to update.',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the school.',
                },
                address: {
                  type: 'string',
                  description: 'The address of the school.',
                },
                contactNumber: {
                  type: 'string',
                  description: 'The contact number of the school.',
                },
              },
              required: ['name', 'address', 'contactNumber'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'School updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'The ID of the school.',
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the school.',
                  },
                  address: {
                    type: 'string',
                    description: 'The address of the school.',
                  },
                  contactNumber: {
                    type: 'string',
                    description: 'The contact number of the school.',
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'School not found.',
        },
        500: {
          description: 'Failed to update school.',
        },
      },
    },
    delete: {
      summary: 'Delete a school',
      description:
        'Delete a school by its ID (SuperAdmin or SchoolAdmin only).',
      tags: ['Schools'],
      // security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'The ID of the school to delete.',
        },
      ],
      responses: {
        200: {
          description: 'School deleted successfully.',
        },
        404: {
          description: 'School not found.',
        },
        500: {
          description: 'Failed to delete school.',
        },
      },
    },
  },
};
