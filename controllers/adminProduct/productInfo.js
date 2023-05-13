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
  const { productId } = req.params;
  if (!productId) {
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
  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedProduct) {
    return next(appError(500, '編輯主視覺資料失敗'));
  }
  const editImage = await Product.findById(productId);
  successHandler(res, '編輯主視覺資料成功', editImage);
});
const editProductSetting = handleErrorAsync(async (req, res, next) => {
  const {
    title,
    category,
    summary,
    price,
    location,
    material,
    size,
    weight,
    url,
    isLimit,
    seoDescription,
    isAbled
  } = req.body;
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  if (!title || !(category === 0 ? '0' : category)) {
    return next(appError(400, '以下欄位不可爲空：商品名稱、商品類型'));
  }
  const errMsgAry = [];
  if (!validator.isIn(category.toString(), ['0', '1', '2'])) {
    errMsgAry.push('商品類型格式不正確');
  }
  if (
    (isLimit === 0 ? '0' : isLimit) &&
    !validator.isIn(isLimit.toString(), ['0', '1'])
  ) {
    errMsgAry.push('庫存限量是否顯示格式不正確');
  }

  if (
    (isAbled === 0 ? '0' : isAbled) &&
    !validator.isIn(isAbled.toString(), ['0', '1'])
  ) {
    errMsgAry.push('是否啓用格式不正確');
  }
  if (
    url &&
    !validator.isURL(url, {
      protocals: [],
      require_tld: false,
      require_protocal: false,
      require_host: false,
      require_valid_protocal: false
    })
  ) {
    errMsgAry.push('url 格式錯誤');
  }

  if (seoDescription && !validator.isLength(seoDescription, { max: 100 })) {
    errMsgAry.push('seo描述最多100字');
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join('&')));
  }
  const updatedSetting = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedSetting) {
    return next(appError(500, '編輯商品基本資料失敗'));
  }
  const product = await Product.findById(req.params.productId);

  successHandler(res, '編輯商品基本資料成功', product);
});
const editProductPayment = handleErrorAsync(async (req, res, next) => {
  const { payment, isAllowInstallment, atmDeadline, csDeadline } = req.body;
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const errMsgAry = [];
  if (
    (payment === 0 ? '0' : payment) &&
    !validator.isIn(payment.toString(), ['0', '1'])
  ) {
    errMsgAry.push('付款方式格式錯誤，請聯絡管理員');
  }
  if (
    (isAllowInstallment === 0 ? '0' : isAllowInstallment) &&
    !validator.isIn(isAllowInstallment.toString(), ['0', '1'])
  ) {
    errMsgAry.push('開啓分期付款格式錯誤，請聯絡管理員');
  }
  if (
    (atmDeadline === 0 ? '0' : atmDeadline) &&
    !validator.isInt(atmDeadline.toString(), { gt: 0 })
  ) {
    errMsgAry.push('ATM 付款期限應爲大於 0 的整數數值');
  }
  if (
    (csDeadline === 0 ? '0' : csDeadline) &&
    !validator.isInt(csDeadline.toString(), { gt: 0 })
  ) {
    errMsgAry.push('超商付款期限應爲大於 0 的整數數值');
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join('&')));
  }
  const updatePayment = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatePayment) {
    return next(appError(500, '編輯付款資料失敗'));
  }
  const product = await Product.findById(productId);

  successHandler(res, '編輯付款資料成功', product);
});
module.exports = {
  getProduct,
  editProductImage,
  editProductSetting,
  editProductPayment
};
