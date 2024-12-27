const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Use an absolute path to resolve swagger.yaml
const swaggerDocument = yaml.load(fs.readFileSync(path.resolve(__dirname, 'swagger.yaml'), 'utf8'));

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
