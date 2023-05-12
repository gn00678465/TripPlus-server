const validator = require('validator');
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');

const getProduct = handleErrorAsync(async (req, res, next) => {
  if (!req.params.productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  product = await Product.findById(req.params.productId);
  if (!product) {
    return next(appError(400, '取得商品資料失敗，查無商品'));
  }
  successHandler(res, '取得商品資料成功', product);
});

const editProductImage = handleErrorAsync(async (req, res, next) => {
  const { keyVision, video } = req.body;
  if (!req.params.productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const errMsgAry = [];
  if (keyVision && !validator.isURL(keyVision)) {
    errMsgAry.push('主視覺連結錯誤');
  }
  if (video && !validator.isURL(video)) {
    errMsgAry.push('商品影片連結錯誤');
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join('&')));
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedProduct) {
    return next(appError(500, '編輯主視覺資料失敗'));
  }
  const editImage = await Product.findById(req.params.productId);
  successHandler(res, '編輯主視覺資料成功', editImage);
});

module.exports = { getProduct, editProductImage };
