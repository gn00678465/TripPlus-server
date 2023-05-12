const mongoose = require('mongoose');
const faqsSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      required: [
        function () {
          return !this.productId;
        },
        '請填寫 projectId 或 productId'
      ],
      ref: 'projects'
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      reuqired: [
        function () {
          return !this.projectId;
        },
        '請填寫 projectId 或 productId'
      ],
      ref: 'products'
    },
    question: {
      type: String,
      required: [true, '請輸入問題内容']
    },
    answer: {
      type: String,
      required: [true, '請輸入回答内容']
    },
    isPublish: {
      type: Number,
      required: [true, '請選擇是否發佈']
    },
    publishedAt: {
      type: Date
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Faqs = mongoose.model('faqs', faqsSchema);
module.exports = Faqs;
