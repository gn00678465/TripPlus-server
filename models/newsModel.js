const mongoose = require('mongoose');
const newsSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'projects'
    },
    title: {
      type: String,
      required: [true, '請輸入最新消息標題']
    },
    content: {
      type: String,
      required: [true, '請輸入最新消息内容']
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

const News = mongoose.model('news', newsSchema);
module.exports = News;
