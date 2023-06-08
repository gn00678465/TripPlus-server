const express = require('express');
const { isAuth, generateSendJWT, generateUrlJWT } = require('../services/auth');

const router = express.Router();

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
    generateUrlJWT(req.user, res);
  }
);

module.exports = router;
