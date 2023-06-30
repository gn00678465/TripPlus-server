const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const validator = require('validator');

const { isAuth, generateSendJWT } = require('../../services/auth');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const User = require('../../models/usersModel');

const handleSignup = handleErrorAsync(async (req, res, next) => {
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
});

module.exports = handleSignup;
