const mongoose = require('mongoose');
const orderSchema = mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫會員 id']
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects',
      required: [
        function () {
          return !this.productId;
        },
        '請輸入 projectId 或 productId'
      ]
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'products',
      required: [
        function () {
          return !this.projectId;
        },
        '請輸入 projectId 或 productId'
      ]
    },
    planId: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫回饋方案 id'],
      ref: 'plans'
    },
    transactionId: {
      type: String
    },
    payment: {
      type: Number,
      required: [true, '請填寫付款方式']
    },
    fundPrice: {
      type: Number,
      required: [true, '請填寫回饋/商品選項金額']
    },
    count: {
      type: Number,
      required: [true, '請輸入購買數量']
    },
    shipment: {
      type: Number,
      default: 0
    },
    shipPrice: {
      type: Number,
      required: [true, '請輸入運費金額']
    },
    extraFund: {
      type: Number
    },
    bonusDiscount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, '總計金額']
    },
    buyerName: {
      type: String,
      required: [true, '請填寫購買人姓名']
    },
    buyerPhone: {
      type: String,
      required: [true, '請填寫購買人聯絡電話']
    },
    buyerEmail: {
      type: String,
      required: [true, '請填寫購買人 email']
    },
    buyerAddress: {
      type: String,
      required: [true, '請填寫購買人地址']
    },
    shipAddress: {
      type: String,
      required: [true, '請填寫收件地址']
    },
    recipient: {
      type: String,
      required: [true, '請填寫收件人']
    },
    recipientPhone: {
      type: String,
      required: [true, '請填寫收件人電話']
    },
    recipientEmail: {
      type: String,
      required: [true, '請填寫收件人 email']
    },
    creditCard: {
      type: String
    },
    note: {
      type: String
    },
    bonus: {
      type: Number,
      default: 0
    },
    paidAt: {
      type: Date
    },
    paymentStatus: {
      type: Number,
      default: 0
    },
    shipmentId: {
      type: String
    },
    shipDate: {
      type: Date
    },
    shipmentStatus: {
      type: Number,
      default: 0
    },
    isCommented: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
