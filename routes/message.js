const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.post('/', isAuth, messagesController.createMessages);
router.get('/member', isAuth, messagesController.getMemberMessages);
router.get('/:projectId', isAuth, messagesController.getProjectMessages);
router.get(
  '/project/:projectId',
  isAdmin,
  messagesController.getAdminProjectMessages
);
module.exports = router;
