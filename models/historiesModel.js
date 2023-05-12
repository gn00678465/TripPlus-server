const mongoose = require('mongoose');
const historySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects'
    },
    status: {
      type: Number,
      required: [true, '請輸入專案進度']
    }
  },
  {
    timestamps: true
  }
);

const History = new mongoose.model('histories', historySchema);
module.exports = History;
