const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const { isAuth, generateSendJWT } = require('../../services/auth');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const User = require('../../models/usersModel');

const handleLogin = handleErrorAsync(async (req, res, next) => {
  const { email, password, isRememberMe = 0 } = req.body; //isRemenberMe 預設 0
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
  generateSendJWT(user, 201, res, isRememberMe); //傳 token
});

module.exports = handleLogin;
