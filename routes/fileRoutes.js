const express = require('express');

const fileController = require('../controller/mediaFile');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/send-file',authenticateMiddleware.authenticate, fileController.postMediaFile)

module.exports = router;