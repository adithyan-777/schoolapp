const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 4 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

module.exports = { loginSchema };
