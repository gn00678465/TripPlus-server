const ObjectId = require('mongoose').Types.ObjectId;
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
    seoDescription
  } = req.body;

  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  //必填欄位
  if (
    !title ||
    !(category === 0 ? '0' : category) ||
    !startTime ||
    !endTime ||
    !(target === 0 ? '0' : target)
  ) {
    return next(
      appError(
        400,
        '以下欄位不可爲空：專案名稱、專案類型、募資開始時間、募資結束時間、目標金額'
      )
    );
  }

  const errArray = [];
  // isNumber
  if (!validator.isInt(target.toString(), { gt: 0 })) {
    errArray.push('目標金額應為大於 0 的整數數值');
  }

  if (!validator.isIn(category.toString(), ['0', '1', '2'])) {
    errArray.push('“專案類型”格式不正確，請聯絡管理員');
  }

  //is date & time
  if (!validator.isISO8601(startTime) || !validator.isISO8601(endTime)) {
    errArray.push('募資開始時間或募資結束時間格式不正確');
  }

  //募資結束時間 大於 募資開始時間
  if (!validator.isAfter(endTime, { comparisonDate: startTime })) {
    errArray.push('募資結束時間應晚於募資開始時間');
  }

  if (
    (isShowTarget === 0 ? '0' : isShowTarget) &&
    !validator.isIn(isShowTarget.toString(), ['0', '1'])
  ) {
    errArray.push('“顯示預計募資金額”格式不正確，請聯絡管理員');
  }

  if (
    (isLimit === 0 ? '0' : isLimit) &&
    !validator.isIn(isLimit.toString(), ['0', '1'])
  ) {
    errArray.push('“庫存限量標示”格式不正確，請聯絡管理員');
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
    errArray.push('url 格式錯誤');
  }

  //seo max length 150
  if (seoDescription && !validator.isLength(seoDescription, { max: 100 })) {
    errArray.push('seo描述最多100字');
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
    return next(appError(500, '編輯專案基本資料失敗'));
  }

  successHandler(res, '編輯專案基本資料成功', updatedProject);
});

module.exports = handleUpdateProjectSetting;
