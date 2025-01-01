const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const validateSchema = (schema) => {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validate.errors,
      });
    }
    next();
  };
};

module.exports = validateSchema;
