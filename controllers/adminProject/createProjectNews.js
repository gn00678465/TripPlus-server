const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const News = require('../../models/newsModel');

const handleCreateProjectNews = handleErrorAsync(async (req, res, next) => {
  const { title, content, isPublish } = req.body;

  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!title || !content) {
    return next(appError(400, '標題與内容為必填欄位'));
  }

  if (
    !(isPublish === 0 ? '0' : isPublish) ||
    !validator.isIn(isPublish.toString(), ['0', '1'])
  ) {
    return next(
      appError(400, '無“是否發佈”資料，或是資料格式錯誤，請聯絡管理員')
    );
  }
  let publishedAt = '';
  if (isPublish === 1) {
    publishedAt = Date.now();
  }

  const newNews = await News.create({
    ...req.body,
    projectId: req.params.id,
    publishedAt
  });

  if (!newNews) {
    return next(appError(500, '新增最新消息失敗'));
  }

  successHandler(res, '新增最新消息成功', newNews);
});

module.exports = handleCreateProjectNews;
