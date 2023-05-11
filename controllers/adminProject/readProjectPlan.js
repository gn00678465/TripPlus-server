const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Plan = require('../../models/plansModel');

const handleReadProjectPlan = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id) {
    return appError(400, '路由資訊錯誤');
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const plans = await Plan.find({ projectId: req.params.id, isDelete: 0 });

  successHandler(res, '取得專案回饋方案成功', plans);
});

module.exports = handleReadProjectPlan;
