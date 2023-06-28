const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/add-group', authenticateMiddleware.authenticate, groupController.postGroup);

router.get('/get-groups', authenticateMiddleware.authenticate, groupController.getGroups);

module.exports = router;