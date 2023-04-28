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

router.post(
  '/signup',
  handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;

    // 內容不可為空
    if (!email || !password || !confirmPassword || !name) {
      return next(appError(400, '註冊失敗，欄位未填寫正確！'));
    }

    // 密碼正確
    if (password !== confirmPassword) {
      return next(appError(400, '註冊失敗，密碼不一致！'));
    }

    // 密碼强度
    if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
      return next(
        appError(400, '註冊失敗，密碼需大於 8 碼，並包含數字、英文字母大小寫')
      );
    }

    // 是否為 Email
    if (!validator.isEmail(email)) {
      return next(appError(400, '註冊失敗，Email 格式不正確'));
    }

    // 確認該 email 為第一次註冊 或 google sso
    const user = await User.findOne({ email: email });
    if (user && user.isGoogleSSO === 0) {
      return next(appError(400, '註冊失敗，此 email 曾註冊過'));
    }
    if (user && user.isGoogleSSO === 1) {
      return next(appError(400, '註冊失敗，此 email 請以 google 第三方登入'));
    }

    // 加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
    generateSendJWT(newUser, 201, res);
  })
);

router.post(
  '/login',
  handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appError(400, '登入失敗，帳號密碼不可為空'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(appError(401, '登入失敗，您的帳號或密碼不正確'));
    }

    if (user.isGoogleSSO === 1) {
      return next(appError(401, '登入失敗，請使用 Google 第三方登入。'));
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return next(appError(401, '登入失敗，您的帳號或密碼不正確'));
    }

    generateSendJWT(user, 201, res); //傳 token
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        let user;
        user = await User.findOne({
          email: profile._json.email
        });
        if (!user) {
          user = await User.create({
            email: profile._json.email,
            name: profile._json.name,
            password: profile.id, //如果是 Google SSO 暫時以 google 帳號之 id 為 password
            isGoogleSSO: 1,
            photot: profile._json.picture
          });
        }
        return callback(null, user);
      } catch (err) {
        return callback(err);
      }
    }
  )
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/',
    failureMessage: true
  }),
  (req, res) => {
    generateSendJWT(req.user, 201, res);
  }
);

module.exports = router;
