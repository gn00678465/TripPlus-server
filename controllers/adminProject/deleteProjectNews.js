const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const News = require('../../models/newsModel');

const handleDeleteProjectNews = handleErrorAsync(async (req, res, next) => {
  const { projId, newsId } = req.params;

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
  if (news.isDelete === 1) {
    return next(appError(400, '該最新消息已刪除'));
  }

  const deletedNews = await News.findByIdAndUpdate(
    newsId,
    { $set: { isDelete: 1 } },
    { new: true }
  );

  if (!deletedNews) {
    return next(appError(500, '刪除最新消息失敗'));
  }

  successHandler(res, '刪除最新消息成功', deletedNews);
});

module.exports = handleDeleteProjectNews;
