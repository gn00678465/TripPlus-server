const successHandler = require('../../services/successHandler');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Banners = require('../../models/bannersModel');

const getBanner = handleErrorAsync(async (req, res, next) => {
  const banners = await Banners.find();
  successHandler(res, '取得 banner 成功', banners);
});

module.exports = getBanner;
