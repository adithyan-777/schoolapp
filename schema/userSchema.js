const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 50 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    role: { 
      type: 'string', 
      enum: ['SuperAdmin', 'SchoolAdmin'] 
    },
    school: { 
      type: 'string', 
      pattern: '^[a-fA-F0-9]{24}$' // Matches MongoDB ObjectId
    },
  },
  required: ['name', 'email', 'password', 'role'], // Required fields for the payload
  additionalProperties: false, // Prevent extra fields
};

module.exports = userSchema;