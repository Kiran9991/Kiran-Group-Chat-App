const express = require('express');

const chatController = require('../controller/chatController');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/user-chat', authenticateMiddleware.authenticate, chatController.userChats);

router.get('/users-chats', chatController.getUserChats);

module.exports = router;