const express = require('express');

const groupController = require('../controller/group');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');

router.post('/add-group', authenticateMiddleware.authenticate, groupController.postNewGroup);

router.get('/get-groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.post('/add-user-toGroup', authenticateMiddleware.authenticate, groupController.addUserToGroup);

router.get('/get-groupMembers', groupController.getGroupMembers);

router.delete('/delete-user', groupController.deleteGroupMember);

router.post('/make-admin', groupController.updateIsAdmin);

module.exports = router;