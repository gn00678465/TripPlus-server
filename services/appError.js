const appError = (httpStatus, errMessage) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  //next(error);
  return error;
};

module.exports = appError;
