const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: [true, '訊息內容需填寫']
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫使用者 id'],
      ref: 'users'
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫接收者 id'],
      ref: 'users'
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫專案 id'],
      ref: 'projects'
    }
  },
  { timestamps: true }
);

const Message = new mongoose.model('messages', messageSchema);
module.exports = Message;
