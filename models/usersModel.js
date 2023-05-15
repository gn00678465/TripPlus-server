const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      require: [true, '請輸入密碼'],
      select: false
    },
    name: {
      type: String,
      required: [true, '請輸入真實姓名']
    },
    nickName: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    photo: {
      type: String
    },
    gender: {
      type: Number //0 male ; 1 female
    },
    birthday: {
      type: Date
    },
    country: {
      type: String
    },
    introduction: {
      type: String
    },
    follows: [
      {
        projectId: { type: mongoose.Schema.ObjectId, ref: 'projects' },
        productId: { type: mongoose.Schema.ObjectId, ref: 'products' }
      }
    ],
    isGoogleSSO: {
      type: Number, //0 is not; 1 is google sso
      default: 0
    },
    roles: {
      type: Array,
      default: ['user']
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
