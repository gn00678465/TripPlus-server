const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.get('/chatroom', isAuth, messagesController.getUserChatroom);
router.get(
  '/admin/:projectId/chatroom',
  isAdmin,
  messagesController.getAminChatroom
);
router.get(
  '/user/:roomId/message',
  isAuth,
  messagesController.getChatRoomMessages
);
router.get(
  '/project/:projectId/message',
  isAuth,
  messagesController.getProjectMsgOrCreateRoom
);
router.get(
  '/admin_project/:roomId/message',
  isAdmin,
  messagesController.getChatRoomMessages
);

module.exports = router;
