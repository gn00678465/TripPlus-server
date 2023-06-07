const mongoose = require('mongoose');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const handleClientResult = handleErrorAsync((req, res, next) => {
  const { RtnCode } = req.body;
  if (RtnCode == 1) {
    res.redirect(process.env.PaymentSuccessURL).end();
  } else {
    res.redirect(process.env.PaymentFailedURL).end();
  }
});

module.exports = handleClientResult;
