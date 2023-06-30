const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleReadProjectAbled = handleErrorAsync(async (req, res, next) => {
  const { isAbled } = req.body;

  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id)
    .populate('teamId')
    .populate('plans');

  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (
    (isAbled === 0 ? '0' : isAbled) &&
    !validator.isIn(isAbled.toString(), ['0', '1'])
  ) {
    return next(appError(400, '“是否啓用”格式不正確'));
  }

  //檢查是否資料完整
  //若在資料庫中 schema 已經設定 required 欄位不檢查
  //不一定要 video, isAllowInstallment（信用卡分期付款）,
  //如果付款方式只能信用卡，不需要填 atmDeadline 或 csDeadline
  //提案者不一定要填 統編、公司所在地、website、fb、ig，其他都要填
  //至少要一個回饋方案，常見問題、最新消息、專案進度暫訂可以沒有資料

  const errAry = [];
  if (isAbled === 1) {
    if (!proj.keyVision) {
      errAry.push('專案主視覺');
    }
    if (!proj.summary) {
      errAry.push('專案摘要');
    }
    if (!proj.url) {
      errAry.push('專案網址');
    }
    if (!proj.seoDescription) {
      errAry.push('SEO 描述');
    }
    if (!(proj.payment === 0 ? '0' : proj.payment)) {
      errAry.push('付款方式');
    }
    if (proj.payment === 1 && !proj.atmDeadline) {
      errAry.push('ATM 付款期限');
    }
    if (proj.payment === 1 && !proj.csDeadline) {
      errAry.push('超商付款期限');
    }
    if (!proj.content) {
      errAry.push('專案内文');
    }
    if (!(proj.teamId.type === 0 ? '0' : proj.teamId.type)) {
      errAry.push('提案者類型');
    }
    if (!proj.teamId.photo) {
      errAry.push('提案者照片/圖片');
    }
    if (!proj.teamId.introduction) {
      errAry.push('提案者介紹');
    }
    if (!proj.teamId.serviceTime) {
      errAry.push('提案者服務時間');
    }
    if (!proj.teamId.representative) {
      errAry.push('提案者代表人姓名');
    }
    if (!proj.teamId.email) {
      errAry.push('提案者聯絡信箱');
    }
    if (!proj.teamId.phone) {
      errAry.push('提案者聯絡電話');
    }
    if (proj.plans?.length < 1) {
      errAry.push('至少一個回饋方案');
    }

    if (errAry.length > 0) {
      return next(
        appError(400, `需填寫完下列資訊才能啓用專案：${errAry.join(',')}`)
      );
    }
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      isAbled
    },
    { new: true, runValidators: true }
  );
  if (!updatedProject) {
    return next(appError(500, '更新專案啓用狀態失敗'));
  }

  successHandler(res, '更新專案啓用狀態成功', updatedProject);
});

module.exports = handleReadProjectAbled;
