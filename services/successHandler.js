const successHandler = (res, message, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'Success',
    message: message,
    data: data
  });
};

module.exports = successHandler;
