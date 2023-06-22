const express = require('express');

const chatController = require('../controller/chatController');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/send-message', authenticateMiddleware.authenticate, chatController.userChats);

router.get('/get-message', chatController.getNewMessage);

module.exports = router;