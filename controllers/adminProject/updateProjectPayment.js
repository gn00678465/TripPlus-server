const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');

const handleUpdateProjectPayment = handleErrorAsync(async (req, res, next) => {
  const { payment, isAllowInstallment, atmDeadline, csDeadline } = req.body;

  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const errArray = [];
  if (
    (payment === 0 ? '0' : payment) &&
    !validator.isIn(payment.toString(), ['0', '1'])
  ) {
    errArray.push('“付款方式”資料格式錯誤，請聯絡管理員');
  }

  if (
    (isAllowInstallment === 0 ? '0' : isAllowInstallment) &&
    !validator.isIn(isAllowInstallment.toString(), ['0', '1'])
  ) {
    errArray.push('“開啓分期付款”資料格式錯誤，請聯絡管理員');
  }

  if (
    (atmDeadline === 0 ? '0' : atmDeadline) &&
    !validator.isInt(atmDeadline.toString(), { gt: 0 })
  ) {
    errArray.push('ATM 付款期限應爲大於 0 的整數數值');
  }

  if (
    (csDeadline === 0 ? '0' : csDeadline) &&
    !validator.isInt(csDeadline.toString(), { gt: 0 })
  ) {
    errArray.push('超商付款期限應爲大於 0 的證書數值');
  }

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    //updatedProject 會是舊資料
    return next(appError(500, '編輯付款資料失敗'));
  }

  successHandler(res, '編輯付款資料成功', updatedProject);
});

module.exports = handleUpdateProjectPayment;
