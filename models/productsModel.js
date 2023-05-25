const mongoose = require('mongoose');
const productSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'users'
    },
    title: {
      type: String,
      required: [true, '請輸入專案名稱']
    },
    teamId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'teams'
    },
    category: {
      type: Number,
      required: [true, '請選擇專案類型'],
      default: 2
    },
    sum: {
      type: Number,
      default: 0
    },
    buyerCount: {
      type: Number,
      default: 0
    },
    keyVision: {
      type: String
    },
    video: {
      type: String
    },
    summary: {
      type: String
    },
    price: {
      type: Number
    },
    location: {
      type: String
    },
    material: {
      type: String
    },
    size: {
      type: String
    },
    weight: {
      type: String
    },
    url: {
      type: String
    },
    isLimit: {
      type: Number,
      default: 0
    },
    seoDescription: {
      type: String,
      maxLength: 100
    },
    isAbled: {
      type: Number,
      default: 0
    },
    payment: {
      type: Number
    },
    isAllowInstallment: {
      type: Number
    },
    atmDeadline: {
      type: Number
    },
    csDeadline: {
      type: Number
    },
    content: {
      type: String
    },
    isSelected: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('faqs', {
  ref: 'faqs',
  foreignField: 'productId',
  localField: '_id'
});
productSchema.virtual('comments', {
  ref: 'comments',
  foreignField: 'productId',
  localField: '_id'
});
productSchema.virtual('plans', {
  ref: 'plans',
  foreignField: 'productId',
  localField: '_id'
});

//狀態
productSchema.virtual('status').get(function () {
  if (this.isAbled === 0) {
    //草稿
    return 'draft';
  } else {
    //進行中
    return 'progress';
  }
});
productSchema.virtual('type').get(function () {
  return 'product';
});

const Products = mongoose.model('products', productSchema);

module.exports = Products;
