const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');
const Plan = require('../../models/plansModel');

const getProductPlan = handleErrorAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    return appError(400, '路由資訊錯誤');
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無商品'));
  }
  const plans = await Plan.find({ productId, isDelete: 0 });
  successHandler(res, '取得商品回饋方案成功', plans);
});

module.exports = { getProductPlan };
