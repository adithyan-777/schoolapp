const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger = require('../utils/logger');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

const validateSchema = (schema, source = 'body') => {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const data = req[source]; // Validate body, params, or query
    logger.warn('-------------ddd------------------');
    logger.warn(JSON.stringify(data));
    logger.warn('-------------ddd------------------');
    logger.warn(typeof data);
    logger.warn('-------------ddd------------------');
    const valid = validate(data);

    if (!valid) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validate.errors.map((err) => ({
          field: err.instancePath || err.keyword,
          message: err.message,
        })),
      });
    }

    next();
  };
};

module.exports = validateSchema;
