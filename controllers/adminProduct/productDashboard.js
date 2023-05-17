const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');

const getProductIndex = handleErrorAsync(async (req, res, next) => {
  if (!req.params.productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  product = await Product.findById(req.params.productId).populate({
    path: 'comments'
  });
  if (!product) {
    return next(appError(400, '取得商品資料失敗，查無商品'));
  }
  successHandler(res, '取得商品資料成功', product);
});

module.exports = getProductIndex;
