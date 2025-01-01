const studentSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
    },
    lastName: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10,15}$',
    },
    classroom: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    school: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    enrollmentStatus: {
      type: 'string',
      enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
      default: 'Enrolled',
    },
    enrollmentHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          school: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
          },
          classroom: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
          },
          enrolledDate: {
            type: 'string',
            format: 'date-time',
          },
          status: {
            type: 'string',
            enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
          },
        },
        required: ['school', 'classroom', 'enrolledDate', 'status'],
      },
    },
    guardians: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
          },
          contactInfo: {
            type: 'object',
            properties: {
              phone: {
                type: 'string',
                pattern: '^[0-9]{10,15}$',
              },
              email: {
                type: 'string',
                format: 'email',
              },
            },
            required: ['phone', 'email'],
          },
          relationship: {
            type: 'string',
            minLength: 1,
          },
        },
        required: ['name', 'contactInfo', 'relationship'],
      },
    },
    enrollmentDate: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: [
    'firstName',
    'lastName',
    'email',
    'classroom',
    'school',
    'enrollmentStatus',
  ],
  additionalProperties: false,
};

const updateStudentSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
    },
    lastName: {
      type: 'string',
      minLength: 1,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10,15}$',
    },
    classroom: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    school: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    enrollmentStatus: {
      type: 'string',
      enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
      default: 'Enrolled',
    },
    enrollmentHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          school: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
          },
          classroom: {
            type: 'string',
            pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
          },
          enrolledDate: {
            type: 'string',
            format: 'date-time',
          },
          status: {
            type: 'string',
            enum: ['Enrolled', 'Transferred', 'Graduated', 'Dropped'],
          },
        },
        required: ['school', 'classroom', 'enrolledDate', 'status'],
      },
    },
    guardians: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
          },
          contactInfo: {
            type: 'object',
            properties: {
              phone: {
                type: 'string',
                pattern: '^[0-9]{10,15}$',
              },
              email: {
                type: 'string',
                format: 'email',
              },
            },
            required: ['phone', 'email'],
          },
          relationship: {
            type: 'string',
            minLength: 1,
          },
        },
        required: ['name', 'contactInfo', 'relationship'],
      },
    },
    enrollmentDate: {
      type: 'string',
      format: 'date-time',
    },
  },
  additionalProperties: false,
};

module.exports = { studentSchema, updateStudentSchema };
