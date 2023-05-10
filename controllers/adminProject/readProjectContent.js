const mongoose = require('mongoose');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleReadProjectContent = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);

  if (!proj) {
    return next(appError(400, '取得專案内文失敗，查無專案'));
  }

  successHandler(res, '取得專案内文成功', { content: proj.content ?? '' });
});

module.exports = handleReadProjectContent;
