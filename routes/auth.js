const express = require('express');
const { isAuth, generateSendJWT } = require('../services/auth');

const router = express.Router();
require('dotenv').config({ path: './config.env' });

const AuthController = require('../controllers/auth');
const googlePassport = AuthController.googlePassport;

router.post('/signup', AuthController.handleSignup);

router.post('/login', AuthController.handleLogin);

router.get(
  '/google',
  googlePassport.authenticate('google', {
    scope: ['email', 'profile']
  })
);

router.get(
  '/google/callback',
  googlePassport.authenticate('google', {
    session: false,
    failureRedirect: '/',
    failureMessage: true
  }),
  (req, res) => {
    generateSendJWT(req.user, 201, res);
  }
);

module.exports = router;
