const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleGetProjectFaqs = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '專案資訊錯誤，找不到專案'));
  }

  const faqs = await Faqs.find({
    projectId: req.params.id,
    isDelete: 0,
    isPublish: 1
  }).sort({ publishedAt: 1 });

  successHandler(res, '取得最新消息成功', faqs);
});

module.exports = handleGetProjectFaqs;
