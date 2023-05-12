const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const History = require('../../models/historiesModel');

const handleCreateProjectHistory = handleErrorAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!(status === 0 ? '0' : status)) {
    return next(appError(400, '專案進度為必填欄位'));
  }

  if (!validator.isIn(status.toString(), ['0', '1', '2', '3'])) {
    return next(appError(400, '“專案進度”欄位格式錯誤，請聯絡管理員'));
  }

  const newHistory = await History.create({
    projectId: req.params.id,
    status
  });
  if (!newHistory) {
    return next(appError(500, '新增專案進度錯誤'));
  }

  successHandler(res, '新增專案進度成功', newHistory);
});

module.exports = handleCreateProjectHistory;
