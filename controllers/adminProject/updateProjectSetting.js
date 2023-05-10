const mongoose = require('mongoose');

const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');

const handleUpdateProjectSetting = handleErrorAsync(async (req, res, next) => {
  const {
    title,
    category,
    startTime,
    endTime,
    target,
    summary,
    isShowTarget,
    url,
    isLimit,
    seoDescription,
    isAbled
  } = req.body;

  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  //必填欄位
  if (!title || !category || !startTime || !endTime || !target) {
    return next(
      appError(
        400,
        '以下欄位不可爲空：專案名稱、專案類型、募資開始時間、募資結束時間、目標金額'
      )
    );
  }

  const errArry = [];
  // isNumber
  if (!validator.isInt(target.toString())) {
    errArry.push('目標金額應為整數數值');
  }

  if (!validator.isIn(category.toString(), ['0', '1', '2'])) {
    errArry.push('“專案類型”格式不正確，請聯絡管理員');
  }

  //is date & time
  if (!validator.isISO8601(startTime) || !validator.isISO8601(endTime)) {
    errArry.push('募資開始時間或募資結束時間格式不正確');
  }

  //募資結束時間 大於 募資開始時間
  if (!validator.isAfter(endTime, { comparisonDate: startTime })) {
    errArry.push('募資結束時間應晚於募資開始時間');
  }

  if (isShowTarget && !validator.isIn(isShowTarget.toString(), ['0', '1'])) {
    errArry.push('“顯示預計募資金額”格式不正確，請聯絡管理員');
  }

  if (isLimit && !validator.isIn(isLimit.toString(), ['0', '1'])) {
    errArry.push('“庫存限量標示”格式不正確，請聯絡管理員');
  }

  if (isAbled && !validator.isIn(isAbled.toString(), ['0', '1'])) {
    errArry.push('“是否啓用”格式不正確，請聯絡管理員');
  }

  //is relative url
  if (
    url &&
    !validator.isURL(url, {
      protocals: [],
      require_tld: false,
      require_protocal: false,
      require_host: false,
      require_valid_protocal: false
    })
  ) {
    errArry.push('url 格式錯誤');
  }

  //seo max length 150
  if (seoDescription && !validator.isLength(seoDescription, { max: 150 })) {
    errArry.push('seo描述最多150字');
  }

  if (errArry.length > 0) {
    return next(appError(400, errArry.join('&')));
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!updatedProject) {
    //updatedProject 會是舊資料
    return next(appError(500, '編輯專案資料失敗'));
  }

  const newProject = await Project.findById(req.params.id);

  successHandler(res, '編輯專案基本資料成功', newProject);
});

module.exports = handleUpdateProjectSetting;
