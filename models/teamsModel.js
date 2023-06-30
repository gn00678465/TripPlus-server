const mongoose = require('mongoose');
const teamSchema = mongoose.Schema(
  {
    type: {
      type: Number
    },
    title: {
      type: String,
      required: [true, '請輸入團隊名稱']
    },
    photo: {
      type: String
    },
    introduction: {
      type: String
    },
    taxId: {
      type: String
    },
    address: {
      type: String
    },
    serviceTime: {
      type: String
    },
    representative: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    website: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Team = mongoose.model('teams', teamSchema);

module.exports = Team;
