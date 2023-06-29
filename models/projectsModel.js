const mongoose = require('mongoose');
const projectSchema = mongoose.Schema(
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
    startTime: {
      type: Date,
      required: [true, '請輸入專案開始時間']
    },
    endTime: {
      type: Date,
      required: [true, '請輸入專案結束時間']
    },
    target: {
      type: Number,
      required: [true, '請輸入目標金額']
    },
    category: {
      type: Number,
      required: [true, '請選擇專案類型'],
      default: 1
    },
    sum: {
      type: Number,
      default: 0
    },
    sponsorCount: {
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
    isShowTarget: {
      type: Number,
      default: 1
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
    isCommercialized: {
      type: Number,
      default: 0
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'products'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

projectSchema.virtual('plans', {
  ref: 'plans',
  foreignField: 'projectId',
  localField: '_id'
});

projectSchema.virtual('news', {
  ref: 'news',
  foreignField: 'projectId',
  localField: '_id'
});

projectSchema.virtual('faqs', {
  ref: 'faqs',
  foreignField: 'projectId',
  localField: '_id'
});

projectSchema.virtual('histories', {
  ref: 'histories',
  foreignField: 'projectId',
  localField: '_id'
});

projectSchema.virtual('teams', {
  ref: 'teams',
  foreignField: 'projectId',
  localField: '_id'
});

//募資進度
projectSchema.virtual('progressRate').get(function () {
  return Math.round((this.sum / this.target) * 100);
});

//倒數天數
projectSchema.virtual('countDownDays').get(function () {
  const days = Math.ceil(
    (Date.parse(this.endTime) - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return days > 0 ? days : 0;
});

//專案狀態
projectSchema.virtual('status').get(function () {
  if (this.isAbled === 0) {
    //草稿
    return 'draft';
  } else if (Date.parse(this.endTime) > Date.now()) {
    //進行中
    return 'progress';
  } else if (Date.now() > Date.parse(this.endTime)) {
    //已結束
    return 'complete';
  }
});

projectSchema.virtual('type').get(function () {
  return 'project';
});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
