const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleGetProjectPlan = handleErrorAsync(async (req, res, next) => {
  const { projId, planId } = req.params;
  if (
    !projId ||
    !ObjectId.isValid(projId) ||
    !planId ||
    !ObjectId.isValid(planId)
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId)
    .populate({ path: 'teamId', select: 'title' })
    .populate({
      path: 'plans',
      match: { isDelete: 0, _id: planId }
    });

  if (!proj) {
    return next(appError(400, '專案 id 資訊錯誤，找不到專案'));
  }
  if (proj.isAbled !== 1) {
    return next(appError(400, '該專案尚未上架'));
  }
  if (proj.plans.length === 0) {
    return next(
      appError(
        400,
        '回饋方案 id 有誤，或專案回饋方案資訊錯誤（回饋方案不屬於該專案），或該回饋方案已刪除'
      )
    );
  }

  successHandler(res, '取得付款專案回饋方案資訊成功', proj);
});

module.exports = handleGetProjectPlan;
