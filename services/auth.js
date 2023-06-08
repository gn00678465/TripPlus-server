const jwt = require('jsonwebtoken');
const appError = require('../services/appError');
const handleErrorAsync = require('../services/handleErrorAsync');
const User = require('../models/usersModel');
const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '您尚未登入！', next));
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(appError(500, '登入資訊錯誤，找不到使用者', next));
  }

  req.user = currentUser;
  next();
});
const generateSendJWT = (user, statusCode, res, isRememberMe = 0) => {
  const expiresIn =
    isRememberMe == 1
      ? process.env.JWT_EXPIRES_DAY_LONG
      : process.env.JWT_EXPIRES_DAY;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: 'Success',
    message: '成功',
    data: {
      token,
      name: user.name,
      roles: user.roles
    }
  });
};

const generateUrlJWT = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

  res.redirect(
    `${process.env.CLIENT_URL}/google/callback?token=${token}&name=${
      user.name
    }&roles=${JSON.stringify(user.roles)}`
  );
};

const isAdmin = handleErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(appError(401, '您尚未登入！', next));
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);

  if (currentUser?.roles?.includes('admin')) {
    req.user = currentUser;
    next();
  } else {
    return next(appError(403, '您無 admin 權限', next));
  }
});

module.exports = {
  isAuth,
  generateSendJWT,
  isAdmin,
  generateUrlJWT
};
