const validator = require('validator');
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');
const Faqs = require('../../models/faqsModel');

const getProductFaqs = handleErrorAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無商品'));
  }
  const productFaqs = await Faqs.find({ productId });

  successHandler(res, '取得商品常見問題成功', productFaqs);
});
const createProductFaq = handleErrorAsync(async (req, res, next) => {
  const { question, answer, isPublish } = req.body;
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無商品'));
  }
  if (!question || !answer) {
    return next(appError(400, '問題與回答為必填欄位'));
  }
  if (
    !(isPublish === 0 ? '0' : isPublish) ||
    !validator.isIn(isPublish.toString(), ['0', '1'])
  ) {
    return next(appError(400, '無填寫是否發佈或欄位格式錯誤'));
  }
  let publishedAt = '';
  if (isPublish === 1) {
    publishedAt = Date.now();
  }
  const newFaqs = await Faqs.create({
    ...req.body,
    productId,
    publishedAt
  });
  if (!newFaqs) {
    return next(appError(500, '新增常見問題錯誤'));
  }
  successHandler(res, '新增常見問題成功', newFaqs);
});

module.exports = { getProductFaqs, createProductFaq };
