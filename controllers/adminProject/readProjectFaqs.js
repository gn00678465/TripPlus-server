const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Faqs = require('../../models/faqsModel');

const handleReadProjectFaqs = handleErrorAsync(async (req, res, next) => {
  const { page = '1', limit = '10' } = req.query;
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!validator.isInt(page, { gt: 0 }) || !validator.isInt(limit, { gt: 0 })) {
    return next(appError(400, '路由資訊錯誤，page 或 limit 資料錯誤'));
  }

  const projFaqs = await Faqs.find({ projectId: req.params.id });

  const pageN = Number(page);
  const limitN = Number(limit);
  const items = projFaqs.slice((pageN - 1) * limitN, pageN * limitN);
  const total = projFaqs.length;
  const totalPages = Math.ceil(total / limitN);

  const result = {
    total,
    totalPages,
    page: pageN,
    items,
    startIndex: (pageN - 1) * limitN + 1,
    endIndex: (pageN - 1) * limitN + items.length,
    limit: limitN
  };

  successHandler(res, '取得專案常見問題成功', result);
});

module.exports = handleReadProjectFaqs;
