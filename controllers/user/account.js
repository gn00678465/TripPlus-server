const User = require('../../models/usersModel');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const validator = require('validator');
const phoneRule = /^09\d{8}$/;

const getUser = handleErrorAsync(async (req, res, next) => {
  if (!req.user) {
    return next(appError(403, '您沒有權限'));
  }
  successHandler(res, '取得使用者資料', req.user);
});

const editUser = handleErrorAsync(async (req, res, next) => {
  const errMsgAry = [];
  const {
    email,
    name,
    nickName,
    phone,
    address,
    photo,
    gender,
    birthday,
    country,
    introduction
  } = req.body;
  if (!email | !name) {
    return next(appError(401, '編輯失敗，欄位未填寫正確！'));
  }
  if (!validator.isLength(name, { min: 2 })) {
    errMsgAry.push('暱稱至少 2 個字元以上');
  }
  if (!validator.isEmail(email)) {
    errMsgAry.push('Email 格式不正確');
  }
  if (phone && !phoneRule.test(phone)) {
    errMsgAry.push('電話號碼格式錯');
  }
  if (photo && !validator.isURL(photo)) {
    errMsgAry.push('圖片格式錯');
  }
  if (gender < 0 || gender > 2) {
    errMsgAry.push('性別格式錯');
  }
  if (errMsgAry.length > 0) {
    return next(appError(401, errMsgAry.join(',')));
  }
  const editUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      email,
      name,
      nickName,
      phone,
      address,
      photo,
      gender,
      birthday,
      country,
      introduction
    },
    { new: true, runValidators: true }
  );
  if (!editUser) {
    return next(appError(401, '編輯失敗，查無此使用者！'));
  } else {
    const user = await User.findById(req.user.id);
    successHandler(res, '編輯成功', user);
  }
});

module.exports = { getUser, editUser };
