const handleErrorAsync = require('../../services/handleErrorAsync');

const handleClientResult = (req, res, next) => {
  const { RtnCode } = req.body;
  if (RtnCode == 1) {
    res.redirect(process.env.PaymentSuccessURL);
    res.end();
  } else {
    res.redirect(process.env.PaymentFailedURL);
    res.end();
  }
};

module.exports = handleClientResult;
