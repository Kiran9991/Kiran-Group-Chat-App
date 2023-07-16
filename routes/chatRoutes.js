const express = require('express');

const chatController = require('../controller/chatController');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/send-message', authenticateMiddleware.authenticate, chatController.postMessage);

router.get('/get-message', chatController.getOldMessages);

module.exports = router;