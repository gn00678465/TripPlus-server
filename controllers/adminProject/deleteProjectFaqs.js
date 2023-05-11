const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleDeleteProjectFaqs = handleErrorAsync(async (req, res, next) => {
  const { projId, faqsId } = req.params;

  if (!projId || !faqsId) {
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
  if (faqs.isDelete === 1) {
    return next(appError(400, '該常見問題已刪除'));
  }

  const deletedFaqs = await Faqs.findByIdAndUpdate(faqsId, { isDelete: 1 });

  if (!deletedFaqs) {
    return next(appError(500, '刪除常見問題失敗'));
  }

  const newFaqs = await Faqs.findById(faqsId);

  successHandler(res, '刪除最新消息成功', newFaqs);
});

module.exports = handleDeleteProjectFaqs;
