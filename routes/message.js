const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.post('/', isAuth, messagesController.createMessages);
module.exports = router;
