const express = require('express');

const userController = require('../controller/userController');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup-user', userController.signup);

router.post('/login-user', userController.login);

module.exports = router;