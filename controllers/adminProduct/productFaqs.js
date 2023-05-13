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

module.exports = { getProductFaqs };
