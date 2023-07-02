const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/add-group', authenticateMiddleware.authenticate, groupController.postNewGroup);

router.get('/get-groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.post('/send-Request', authenticateMiddleware.authenticate, groupController.postRequest);

router.get('/get-Request', authenticateMiddleware.authenticate, groupController.getRequest);

router.get('/get-groupRequest', groupController.getGroupLink);

module.exports = router;