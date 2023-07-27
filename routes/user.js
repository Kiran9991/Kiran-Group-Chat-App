const express = require('express');

const userController = require('../controller/user');

const router = express.Router();

router.get('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/users', userController.getUsers);

module.exports = router;