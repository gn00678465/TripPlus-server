const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Plan = require('../../models/plansModel');

const handleDeleteProjectPlan = handleErrorAsync(async (req, res, next) => {
  const { projId, planId } = req.params;
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
  if (plan.isDelete == 1) {
    return next(appError(400, '該回饋方案已刪除'));
  }

  const deletedPlan = await Plan.findByIdAndUpdate(
    planId,
    { $set: { isDelete: 1 } },
    { new: true }
  );
  if (!deletedPlan) {
    return next(appError(500, '刪除回饋方案錯誤'));
  }

  const newPlan = await Plan.findById(planId);
  successHandler(res, '刪除回饋方案成功', newPlan);
});

module.exports = handleDeleteProjectPlan;
