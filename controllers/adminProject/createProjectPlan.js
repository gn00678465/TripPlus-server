const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Plan = require('../../models/plansModel');

const handleCreateProjectPlan = handleErrorAsync(async (req, res, next) => {
  const { title, price, content, isAllowMulti } = req.body;

  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!title || !(price === 0 ? '0' : price) || !content) {
    return next(appError(400, '回饋方案名稱、價格與内容為必填欄位'));
  }

  if (!validator.isInt(price.toString(), { gt: 0 })) {
    return next(appError(400, '價格需為大於 0 的整數數值'));
  }

  if (
    (isAllowMulti === 0 ? '0' : isAllowMulti) &&
    !validator.isIn(isAllowMulti.toString(), ['0', '1'])
  ) {
    return next(appError(400, '“是否允許購買多組”欄位錯誤，請聯絡管理員'));
  }

  const newPlan = await Plan.create({
    ...req.body,
    projectId: req.params.id
  });
  if (!newPlan) {
    return next(appError(500, '新增回饋方案資料錯誤'));
  }

  successHandler(res, '新增回饋方案成功', newPlan);
});

module.exports = handleCreateProjectPlan;
