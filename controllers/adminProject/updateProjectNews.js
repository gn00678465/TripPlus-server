const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const News = require('../../models/newsModel');

const handleUpdateProjectNews = handleErrorAsync(async (req, res, next) => {
  const { projId, newsId } = req.params;
  const { title, content, isPublish } = req.body;

  if (!projId || !newsId) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const news = await News.findById(newsId);
  if (!news) {
    return next(appError(400, '查無最新消息'));
  }
  if (news.projectId.toString() !== projId) {
    return next(appError(400, '專案或最新消息資料錯誤'));
  }
  if (news.isDelete) {
    return next(appError(400, '最新消息資料已刪除'));
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

  const updatedNews = await News.findByIdAndUpdate(
    newsId,
    {
      ...req.body,
      publishedAt
    },
    { new: true, runValidators: true }
  );

  if (!updatedNews) {
    return next(appError(500, '編輯最新消息失敗'));
  }

  successHandler(res, '編輯最新消息成功', updatedNews);
});

module.exports = handleUpdateProjectNews;
