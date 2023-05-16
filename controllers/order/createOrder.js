const mongoose = require('mongoose');
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Order = require('../../models/ordersModel');
const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');
const Plan = require('../../models/plansModel');
const User = require('../../models/usersModel');

const phoneRule =
  /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/;

const handleCreateOrder = handleErrorAsync(async (req, res, next) => {
  const {
    projectId,
    productId,
    planId,
    transactionId,
    payment,
    fundPrice,
    count,
    bonusDiscount,
    shipPrice,
    shipment,
    extraFund,
    total,
    buyerName,
    buyerPhone,
    buyerEmail,
    buyerAddress,
    shipAddress,
    recipient,
    recipientPhone,
    recipientEmail,
    creditCard,
    note,
    bonus,
    paidAt,
    paymentStatus,
    shipmentId,
    shipDate,
    shipmentStatus
  } = req.body;

  //必填欄位
  if (!req.user) {
    return next(appError(400, '使用者資訊錯誤，找不到使用者'));
  }
  if (
    (!projectId && !productId) ||
    !planId ||
    !(payment === 0 ? '0' : payment) ||
    !(fundPrice === 0 ? '0' : fundPrice) ||
    !(count === 0 ? '0' : count) ||
    !(shipPrice === 0 ? '0' : shipPrice) ||
    !(total === 0 ? '0' : total) ||
    !buyerName ||
    !buyerPhone ||
    !buyerEmail ||
    !buyerAddress ||
    !shipAddress ||
    !recipient ||
    !recipientPhone ||
    !recipientEmail
  ) {
    return next(
      appError(
        400,
        '以下欄位不可爲空：專案或商品 id, 購買方案選項, 付款方式, 方案選項金額, 數量, 運費, 總計金額, 購買人姓名, 購買人電話, 購買人 email, 購買人地址, 收件地址, 收件人, 收件人電話, 收件人 email'
      )
    );
  }

  //project product 資訊驗證
  let project = '';
  let product = '';
  if (projectId && productId) {
    return next(appError(400, '專案 id 或商品 id 請擇一填寫'));
  }
  if (projectId) {
    project = await Project.findById(projectId);
    req.body.productId = null;
  }
  if (productId) {
    product = await Product.findById(productId);
    req.body.projectId = null;
  }
  if (projectId && !project) {
    return next(appError(400, '專案資訊錯誤，找不到專案'));
  }
  if (productId && !product) {
    return next(appError(400, '商品資訊錯誤，找不到商品'));
  }

  //plan 資訊驗證
  const plan = await Plan.findById(planId);
  if (!plan) {
    return next(appError(400, '方案選項資訊錯誤，找不到方案選項'));
  }
  if (projectId && plan.projectId?.toString() !== projectId) {
    return next(appError(400, '方案選項資訊錯誤，方案選項不屬於此專案'));
  }
  if (productId && plan.productId?.toString() !== productId) {
    return next(appError(400, '方案選項資訊錯誤，方案選項不屬於此商品'));
  }

  const errArray = [];
  if (!validator.isIn(payment.toString(), ['0', '1', '2'])) {
    errArray.push('付款方式格式錯誤，請聯絡管理員');
  }
  if (!validator.isInt(fundPrice.toString(), { gt: 0 })) {
    errArray.push('方案選項金額應為大於 0 的整數數值');
  }
  if (!validator.isInt(count.toString(), { gt: 0 })) {
    errArray.push('數量應為大於 0 的整數數值');
  }
  if (
    (shipment === 0 ? '0' : shipment) &&
    !validator.isIn(shipment.toString(), ['0'])
  ) {
    errArray.push('運送方式格式錯誤，請聯絡管理員');
  }
  if (!validator.isInt(shipPrice.toString(), { min: 0 })) {
    errArray.push('運費應為 0 或正整數數值');
  }
  if (
    (extraFund === 0 ? '0' : extraFund) &&
    !validator.isInt(extraFund.toString(), { min: 0 })
  ) {
    errArray.push('加碼贊助應為 0 或正整數數值');
  }
  if (
    (bonusDiscount === 0 ? '0' : bonusDiscount) &&
    !validator.isInt(bonusDiscount.toString(), { min: 0 })
  ) {
    errArray.push('紅利折抵應為 0 或正整數數值');
  }
  if (!validator.isInt(total.toString(), { min: 0 })) {
    errArray.push('總計金額應為大於 0 的整數數值');
  }
  if (!phoneRule.test(buyerPhone)) {
    errArray.push('購買人聯絡電話格式不正確');
  }
  if (!validator.isEmail(buyerEmail)) {
    errArray.push('購買人 email 格式不正確');
  }
  if (!phoneRule.test(recipientPhone)) {
    errArray.push('收件人聯絡電話格式不正確');
  }
  if (!validator.isEmail(recipientEmail)) {
    errArray.push('收件人 email 格式不正確');
  }
  if (creditCard && !validator.isCreditCard(creditCard)) {
    errArray.push('信用卡格式不正確');
  }
  if (
    (bonus === 0 ? '0' : bonus) &&
    !validator.isInt(bonus.toString(), { min: 0 })
  ) {
    errArray.push('紅利點數應爲 0 或正整數');
  }
  if (paidAt && !validator.isISO8601(paidAt)) {
    //is date & time
    errArray.push('付款日期時間格式不正確');
  }
  if (
    (paymentStatus === 0 ? '0' : paymentStatus) &&
    !validator.isIn(paymentStatus.toString(), ['0', '1'])
  ) {
    errArray.push('付款狀態格式錯誤，請聯絡管理員');
  }
  if (shipDate && !validator.isISO8601(shipDate)) {
    //is date & time
    errArray.push('出貨日期時間格式不正確');
  }
  if (
    (shipmentStatus === 0 ? '0' : shipmentStatus) &&
    !validator.isIn(shipmentStatus.toString(), ['0', '1', '2'])
  ) {
    errArray.push('物流狀態格式錯誤，請聯絡管理員');
  }

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
  }

  // transaction
  let session = null;
  let newOrder = null;
  Order.createCollection()
    .then(() => {
      return mongoose.startSession();
    })
    .then(async (_session) => {
      session = _session;
      session.startTransaction();
      newOrder = await Order.create(
        [
          {
            member: req.user.id,
            ...req.body
          }
        ],
        { session }
      );
      return newOrder;
    })
    .then(() => {
      if (projectId) {
        return Project.findByIdAndUpdate(
          projectId,
          {
            $set: {
              sum: project.sum + fundPrice * count + (extraFund ?? 0),
              sponsorCount: project.sponsorCount + 1
            }
          },
          { runValidators: true },
          { session }
        );
      }
      if (productId) {
        return Product.findByIdAndUpdate(
          productId,
          {
            $set: {
              sum: product.sum + fundPrice * count,
              buyerCount: product.buyerCount + 1
            }
          },
          { runValidators: true },
          { session }
        );
      }
    })
    .then(() => {
      return User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            bonus: (req.user.bonus ?? 0) + (bonus ?? 0) - (bonusDiscount ?? 0)
          }
        },
        { runValidators: true },
        { session }
      );
    })
    .then(async () => {
      await session.commitTransaction();
      successHandler(res, '新增訂單成功', newOrder);
    })
    .catch(async (error) => {
      await session.abortTransaction();
      return next(appError(500, '新增訂單資料失敗'));
    })
    .finally(async () => {
      await session.endSession();
    });
});

module.exports = handleCreateOrder;
