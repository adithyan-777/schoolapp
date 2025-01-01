const objectIdSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
  },
  required: ['id'],
  additionalProperties: false,
};

const schoolIdSchema = {
  type: 'object',
  properties: {
    schoolId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
  },
  required: ['schoolId'],
  additionalProperties: false,
};

const classroomIdSchema = {
  type: 'object',
  properties: {
    classroomId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
  },
  required: ['classroomId'],
  additionalProperties: false,
};

const schoolClassroomIdSchema = {
  type: 'object',
  properties: {
    schoolId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    classroomId: { type: 'string', pattern: '^[a-f\\d]{24}$' },
  },
  required: ['schoolId', 'classroomId'],
  additionalProperties: false,
};


module.exports = { objectIdSchema, schoolIdSchema, classroomIdSchema, schoolClassroomIdSchema };
