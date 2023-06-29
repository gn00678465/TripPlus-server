var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const passport = require('passport');

require('dotenv').config({ path: './config.env' });

var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const adminProjectRouter = require('./routes/adminProject');
const adminProductRouter = require('./routes/adminProduct');
const orderRouter = require('./routes/order');
const projectRouter = require('./routes/project');
const proposerRouter = require('./routes/proposer');
const messageRouter = require('./routes/message');
const homeRouter = require('./routes/home');

require('./connections');

var app = express();

//uncaughtException
process.on('uncaughtException', (err) => {
  console.error('Uncaughted Exception！');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

const io = require('socket.io')();
app.io = io;
require('./socket')(io);
app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/test', express.static('public'));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/admin/project', adminProjectRouter);
app.use('/admin/product', adminProductRouter);
app.use('/order', orderRouter);
app.use('/project', projectRouter);
app.use('/proposer', proposerRouter);
app.use(messageRouter);
app.use('/home', homeRouter);

//for test
app.get('/paymentTester', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/paymentTester.html'));
});

// 404 Not Found
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'Error',
    message: '無此路由資訊'
  });
});

//prod error
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'Error',
      message: err.message
    });
  } else {
    console.error('出現重大錯誤', err);
    res.status(500).json({
      status: 'Error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};

//dev error
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'Error',
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// error handler
app.use(function (err, req, res, next) {
  //mongo db users collection email duplicate
  if (err.message?.includes('E11000 duplicate key error collection')) {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = '註冊失敗，此 email 已經申請過帳號';
  }

  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = '登入逾時，請再登入一次';
    err.isOperational = true;
  }

  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 500;
    err.message = 'jwt 資訊錯誤，請聯絡管理員。';
    err.isOperational = true;
  }

  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // prod
  return resErrorProd(err, res);
});

//unhandled rejection
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
