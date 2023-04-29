const express = require('express');
const router = express.Router();
const { isAuth, generateSendJWT } = require('../services/auth');
const UserController = require('../controllers/user');

router.get('/account', isAuth, UserController.getUser);
router.patch('/account', isAuth, UserController.editUser);

module.exports = router;
