var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('./connections');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/', indexRouter);
app.use('/user', usersRouter);

module.exports = app;
