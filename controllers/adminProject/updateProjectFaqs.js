const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleUpdateProjectFaqs = handleErrorAsync(async (req, res, next) => {
  const { projId, faqsId } = req.params;
  const { question, answer, isPublish } = req.body;

  if (
    !projId ||
    !faqsId ||
    !ObjectId.isValid(projId) ||
    !ObjectId.isValid(faqsId)
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  const faqs = await Faqs.findById(faqsId);
  if (!faqs) {
    return next(appError(400, '查無常見問題'));
  }
  if (faqs.projectId.toString() !== projId) {
    return next(appError(400, '專案或常見問題資料錯誤'));
  }
  if (faqs.isDelete) {
    return next(appError(400, '常見問題資料已經刪除'));
  }

  if (!question || !answer) {
    return next(appError(400, '問題與回答為必填欄位'));
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

  const updatedFaqs = await Faqs.findByIdAndUpdate(
    faqsId,
    {
      ...req.body,
      publishedAt
    },
    { new: true, runValidators: true }
  );

  if (!updatedFaqs) {
    return next(appError(500, '編輯常見問題失敗'));
  }

  successHandler(res, '編輯常見問題成功', updatedFaqs);
});

module.exports = handleUpdateProjectFaqs;
