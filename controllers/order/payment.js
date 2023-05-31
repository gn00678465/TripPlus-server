const moment = require('moment');
const { default: ShortUniqueId } = require('short-unique-id');
const SHA256 = require('crypto-js/sha256');

const mongoose = require('mongoose');
const validator = require('validator');

const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');
const Plan = require('../../models/plansModel');
const Order = require('../../models/ordersModel');

const options = require('../../config/config-payment');

const phoneRule =
  /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/;

const handlePayment = handleErrorAsync(async (req, res, next) => {
  const {
    projectId,
    productId,
    planId,
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
    note
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
  if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
    return next(appError(400, '專案 id 資訊錯誤'));
  }
  if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
    return next(appError(400, '商品 id 資訊錯誤'));
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

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
  }

  const uid = new ShortUniqueId({ length: 20 });
  const MerchantTradeNo = uid();
  const order = await Order.create({
    member: req.user.id,
    transactionId: MerchantTradeNo,
    ...req.body
  });

  let ItemName = '';
  if (projectId) {
    ItemName = `${project.title} - ${plan.title}`;
  } else if (productId) {
    ItemName = `${product.title} - ${plan.title}`;
  }
  // ECPay
  let base_param = {
    MerchantID: options?.MercProfile?.MerchantID,
    MerchantTradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'), //ex: 2017/02/13 15:45:30
    PaymentType: 'aio',
    TotalAmount: total,
    TradeDesc: 'Trip Plus+ 募資平臺',
    ItemName,
    ReturnURL: process.env.PaymentReturnURL,
    ChoosePayment: 'Credit',
    EncryptType: 1,
    Remark: note,
    ClientBackURL: 'https://frontend-development-mtbj.onrender.com',
    CustomField1: order.id
    // CustomField2: '',
    // CustomField3: '',
    // CustomField4: ''
  };
  const form = `
    <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment" style="display: none;">
      <input name="MerchantID" value="${base_param.MerchantID}"/>
      <input name="MerchantTradeNo" value="${base_param.MerchantTradeNo}" />
      <input name="MerchantTradeDate" value="${base_param.MerchantTradeDate}" />
      <input name="PaymentType" value="${base_param.PaymentType}" />
      <input name="TotalAmount" value="${base_param.TotalAmount}" />
      <input name="TradeDesc" value="${base_param.TradeDesc}" />
      <input name="ItemName" value="${base_param.ItemName}" />
      <input name="ReturnURL" value="${base_param.ReturnURL}" />
      <input name="ChoosePayment" value="${base_param.ChoosePayment}" />
      <input name="EncryptType" value="${base_param.EncryptType}" />
      <input name="Remark" value="${base_param.Remark}" />
      <input name="ClientBackURL" value="${base_param.ClientBackURL}" />
      <input name="CustomField1" value="${base_param.CustomField1}" />
      <input name="CheckMacValue" value="${generateCheckValue(base_param)}" />
      <button type="submit">Submit</button>
    </form>
  `;
  successHandler(res, '取得付款資訊成功', form);
});

function generateCheckValue(params) {
  const entries = Object.entries(params);
  entries.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });
  let result =
    `HashKey=${options?.MercProfile?.HashKey}&` +
    entries.map((x) => `${x[0]}=${x[1]}`).join('&') +
    `&HashIV=${options?.MercProfile?.HashIV}`;
  result = encodeURIComponent(result).toLowerCase();
  //follow guidence from ECPay https://www.ecpay.com.tw/CascadeFAQ/CascadeFAQ_Qa?nID=1197
  result = result
    .replace(/%2d/g, '-')
    .replace(/%5f/g, '_')
    .replace(/%2e/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%20/g, '+');

  result = SHA256(result).toString();
  return result.toUpperCase();
}

module.exports = handlePayment;
