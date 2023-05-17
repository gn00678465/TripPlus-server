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
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限瀏覽商品常見問題'));
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
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限新增商品常見問題'));
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
const editProductFaq = handleErrorAsync(async (req, res, next) => {
  const { productId, faqId } = req.params;
  const { question, answer, isPublish } = req.body;
  if (!productId || !faqId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無專案'));
  }
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限編輯商品常見問題'));
  }
  const faq = await Faqs.findById(faqId);
  if (!faq) {
    return next(appError(400, '查無常見問題'));
  }
  if (faq.productId.toString() !== productId) {
    return next(appError(400, '商品或常見問題資料錯誤'));
  }
  if (faq.isDelete == 1) {
    return next(appError(400, '該常見問題已刪除'));
  }
  if (!question || !answer) {
    return next(appError(400, '問題與回答為必填欄位'));
  }
  if (
    !(isPublish === 0 ? '0' : isPublish) ||
    !validator.isIn(isPublish.toString(), ['0', '1'])
  ) {
    return next(appError(400, '無是否發佈資料或資料格式錯誤'));
  }
  let publishedAt = '';
  if (isPublish === 1) {
    publishedAt = Date.now();
  }
  const updatedFaq = await Faqs.findByIdAndUpdate(
    faqId,
    {
      ...req.body,
      publishedAt
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedFaq) {
    return next(appError(500, '編輯常見問題失敗'));
  }
  const newFaq = await Faqs.findById(faqId);
  successHandler(res, '編輯常見問題成功', newFaq);
});
const delProductFaq = handleErrorAsync(async (req, res, next) => {
  const { productId, faqId } = req.params;

  if (!productId || !faqId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無專案'));
  }
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限刪除商品常見問題'));
  }
  const faq = await Faqs.findById(faqId);
  if (!faq) {
    return next(appError(400, '查無常見問題'));
  }
  if (faq.productId.toString() !== productId) {
    return next(appError(400, '商品或常見問題資料錯誤'));
  }
  if (faq.isDelete === 1) {
    return next(appError(400, '該常見問題已刪除'));
  }
  const delFaq = await Faqs.findByIdAndUpdate(
    faqId,
    { isDelete: 1 },
    { new: true }
  );
  if (!delFaq) {
    return next(appError(500, '刪除常見問題失敗'));
  }
  const newFaq = await Faqs.findById(faqId);
  successHandler(res, '刪除最新消息成功', newFaq);
});

module.exports = {
  getProductFaqs,
  createProductFaq,
  editProductFaq,
  delProductFaq
};
