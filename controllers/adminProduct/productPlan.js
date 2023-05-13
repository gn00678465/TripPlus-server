const validator = require('validator');
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
const createProductPlan = handleErrorAsync(async (req, res, next) => {
  const { title, price, content, isAllowMulti } = req.body;
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無專案'));
  }
  if (!title || !(price === 0 ? '0' : price) || !content) {
    return next(appError(400, '回饋方案名稱、價格與内容為必填欄位'));
  }
  const errMsgAry = [];
  if (!validator.isInt(price.toString(), { gt: 0 })) {
    errMsgAry.push('價格需為大於 0 的整數數值');
  }
  if (
    (isAllowMulti === 0 ? '0' : isAllowMulti) &&
    !validator.isIn(isAllowMulti.toString(), ['0', '1'])
  ) {
    errMsgAry.push('是否允許購買多組欄位錯誤');
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join('&')));
  }
  const newPlan = await Plan.create({
    ...req.body,
    productId
  });
  if (!newPlan) {
    return next(appError(500, '新增回饋方案資料錯誤'));
  }
  successHandler(res, '新增回饋方案成功', newPlan);
});
const editProductPlan = handleErrorAsync(async (req, res, next) => {
  const { productId, planId } = req.params;
  const { title, price, content, isAllowMulti } = req.body;
  if (!productId || !planId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無商品'));
  }
  const plan = await Plan.findById(planId);
  if (!plan) {
    return next(appError(400, '查無回饋方案'));
  }
  if (plan.productId.toString() !== productId) {
    return next(appError(400, '商品或回饋方案資訊錯誤'));
  }
  if (plan.isDelete == 1) {
    return next(appError(400, '該回饋方案已刪除'));
  }
  if (!title || !(price === 0 ? '0' : price) || !content) {
    return next(appError(400, '回饋方案名稱、價格與内容為必填欄位'));
  }
  const errMsgAry = [];
  if (!validator.isInt(price.toString(), { gt: 0 })) {
    errMsgAry.push('價格需為大於 0 的整數數值');
  }
  if (
    (isAllowMulti === 0 ? '0' : isAllowMulti) &&
    !validator.isIn(isAllowMulti.toString(), ['0', '1'])
  ) {
    errMsgAry.push('是否允許購買多組欄位錯誤');
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join('&')));
  }
  const updatedPlan = await Plan.findByIdAndUpdate(planId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedPlan) {
    return next(appError(500, '編輯回饋方案錯誤'));
  }
  const newPlan = await Plan.findById(planId);
  successHandler(res, '編輯回饋方案成功', newPlan);
});
const delProductPlan = handleErrorAsync(async (req, res, next) => {
  const { productId, planId } = req.params;
  if (!productId || !planId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(appError(400, '查無專案'));
  }
  const plan = await Plan.findById(planId);
  if (!plan) {
    return next(appError(400, '查無回饋方案'));
  }
  if (plan.productId.toString() !== productId) {
    return next(appError(400, '商品或回饋方案資訊錯誤'));
  }
  if (plan.isDelete == 1) {
    return next(appError(400, '該回饋方案已刪除'));
  }
  const delPlan = await Plan.findByIdAndUpdate(planId, { isDelete: 1 });
  if (!delPlan) {
    return next(appError(500, '刪除回饋方案錯誤'));
  }
  const newPlan = await Plan.findById(planId);
  successHandler(res, '刪除回饋方案成功', newPlan);
});

module.exports = {
  getProductPlan,
  createProductPlan,
  editProductPlan,
  delProductPlan
};
