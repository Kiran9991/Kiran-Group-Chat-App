const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/add-group', authenticateMiddleware.authenticate, groupController.postGroup);

router.get('/get-groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.post('/send-link', authenticateMiddleware.authenticate, groupController.postLink);

router.get('/get-link', authenticateMiddleware.authenticate, groupController.getLinks);

module.exports = router;