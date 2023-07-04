const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/add-group', authenticateMiddleware.authenticate, groupController.postNewGroup);

router.get('/get-groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.post('/add-user-toGroup', authenticateMiddleware.authenticate, groupController.postRequest);

router.get('/get-groupMembers', groupController.getGroupMembers);

module.exports = router;