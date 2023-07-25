const express = require('express');

const userController = require('../controller/userController');

const router = express.Router();

router.get('/signup-user', userController.signup);

router.post('/login-user', userController.login);

router.get('/get-users', userController.getUsers);

module.exports = router;