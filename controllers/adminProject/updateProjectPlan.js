const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Plan = require('../../models/plansModel');

const handleUpdateProjectPlan = handleErrorAsync(async (req, res, next) => {
  const { projId, planId } = req.params;
  const { title, price, content, isAllowMulti } = req.body;
  if (
    !projId ||
    !planId ||
    !ObjectId.isValid(projId) ||
    !ObjectId.isValid(planId)
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const plan = await Plan.findById(planId);
  if (!plan) {
    return next(appError(400, '查無回饋方案'));
  }
  if (plan.projectId.toString() !== projId) {
    return next(appError(400, '專案或回饋方案資訊錯誤'));
  }
  if (plan.isDelete) {
    return next(appError(400, '該回饋方案已刪除'));
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

  const updatedPlan = await Plan.findByIdAndUpdate(planId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedPlan) {
    return next(appError(500, '編輯回饋方案錯誤'));
  }
  successHandler(res, '編輯回饋方案成功', updatedPlan);
});

module.exports = handleUpdateProjectPlan;
