const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const News = require('../../models/newsModel');

const handleReadProjectNews = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const projNews = await News.find({ projectId: req.params.id });

  successHandler(res, '取得專案最新消息成功', projNews);
});

module.exports = handleReadProjectNews;
