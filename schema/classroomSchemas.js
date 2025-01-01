const classroomSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    teacher: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    school: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
  },
  required: ['name', 'school'],
  additionalProperties: false,
};

const updateClassroomSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    teacher: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
    school: {
      type: 'string',
      pattern: '^[a-fA-F0-9]{24}$', // MongoDB ObjectId
    },
  },
  additionalProperties: false,
};

module.exports = { classroomSchema, updateClassroomSchema };
