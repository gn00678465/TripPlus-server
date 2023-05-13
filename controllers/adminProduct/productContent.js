const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');

const editProductContent = handleErrorAsync(async (req, res, next) => {
  if (!req.params.productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(appError(400, '取得商品内文失敗，查無專案'));
  }
  successHandler(res, '取得專案内文成功', { content: product.content || '' });
});

module.exports = editProductContent;
