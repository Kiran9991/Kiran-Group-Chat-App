const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/create', authenticateMiddleware.authenticate, groupController.postNewGroup);

router.get('/groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.post('/add', authenticateMiddleware.authenticate, groupController.addUserToGroup);

router.get('/members', groupController.getGroupMembers);

router.delete('/remove', groupController.deleteGroupMember);

router.post('/admin', groupController.updateIsAdmin);

module.exports = router;