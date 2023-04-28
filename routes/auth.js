const express = require('express');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const validator = require('validator');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { isAuth, generateSendJWT } = require('../services/auth');

const appError = require('../services/appError');
const handleErrorAsync = require('../services/handleErrorAsync');

const User = require('../models/usersModel');

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
