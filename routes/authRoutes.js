const express = require('express');
const { login } = require('../controllers/authController');
const validateSchema = require('../middlewares/validateSchema');
const { loginSchema } = require('../schema/authSchemas');
const router = express.Router();

router.post('/login', validateSchema(loginSchema), login);

module.exports = router;
