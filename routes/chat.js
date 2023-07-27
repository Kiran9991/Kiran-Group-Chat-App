const express = require('express');

const chatController = require('../controller/chat');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/send', authenticateMiddleware.authenticate, chatController.postMessage);

router.get('/messages', chatController.getMessages);

module.exports = router;