const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleGetProject = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id)
    .populate('teamId')
    .populate('histories')
    .populate({
      path: 'news',
      match: { isDelete: 0, isPublish: 1 },
      options: { sort: { publishedAt: -1 } }
    })
    .populate({
      path: 'faqs',
      match: { isDelete: 0, isPublish: 1 },
      options: { sort: { publishedAt: 1 } }
    })
    .populate({
      path: 'plans',
      match: { isDelete: 0 },
      options: { sort: { createdAt: 1 } }
    });

  if (!proj) {
    return next(appError(400, '專案 id 資訊錯誤，找不到專案'));
  }
  if (proj.isAbled !== 1) {
    return next(appError(400, '該專案尚未上架'));
  }

  successHandler(res, '取得專案成功', proj);
});

module.exports = handleGetProject;
