const schoolSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    address: {
      type: 'string',
      minLength: 1,
    },
    contactNumber: {
      type: 'string',
      pattern: '^[0-9]{10,15}$',
    },
  },
  required: ['name', 'address', 'contactNumber'],
  additionalProperties: false,
};

const updateSchoolSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    address: {
      type: 'string',
      minLength: 1,
    },
    contactNumber: {
      type: 'string',
      pattern: '^[0-9]{10,15}$',
    },
  },
  additionalProperties: false,
};

module.exports = { schoolSchema, updateSchoolSchema };
