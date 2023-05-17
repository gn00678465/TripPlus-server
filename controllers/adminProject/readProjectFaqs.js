const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleReadProjectFaqs = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const projFaqs = await Faqs.find({ projectId: req.params.id });

  successHandler(res, '取得專案常見問題成功', projFaqs);
});

module.exports = handleReadProjectFaqs;
