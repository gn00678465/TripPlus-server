const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const History = require('../../models/historiesModel');

const handleReadProjectHistory = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const projHistories = await History.find({ projectId: req.params.id });

  successHandler(res, '取得專案進度更新成功', projHistories);
});

module.exports = handleReadProjectHistory;
