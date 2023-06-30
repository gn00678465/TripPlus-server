const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleCreateProjectFaqs = handleErrorAsync(async (req, res, next) => {
  const { question, answer, isPublish } = req.body;

  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!question || !answer) {
    return next(appError(400, '問題與回答為必填欄位'));
  }

  if (
    !(isPublish === 0 ? '0' : isPublish) ||
    !validator.isIn(isPublish.toString(), ['0', '1'])
  ) {
    return next(
      appError(400, '無填寫“是否發佈”，或是欄位格式錯誤，請聯絡管理員')
    );
  }

  let publishedAt = '';
  if (isPublish === 1) {
    publishedAt = Date.now();
  }

  const newFaqs = await Faqs.create({
    ...req.body,
    projectId: req.params.id,
    publishedAt
  });
  if (!newFaqs) {
    return next(appError(500, '新增常見問題錯誤'));
  }

  successHandler(res, '新增常見問題成功', newFaqs);
});

module.exports = handleCreateProjectFaqs;
