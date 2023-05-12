const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');
const Faqs = require('../../models/faqsModel');

const handleConvertIntoProduct = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }
  if (proj.isCommercialized === 1) {
    return next(appError(400, '此專案已轉爲商品'));
  }
  const {
    _id,
    startTime,
    endTime,
    target,
    sum,
    sponsorCount,
    isShowTarget,
    createdAt,
    updateAt,
    ...productInfo //the info product needs
  } = proj.toObject(); //turn mongoose doc into plain object

  const newProd = await Product.create(productInfo);
  if (!newProd) {
    return next(appError(500, '募資轉商品失敗'));
  }

  const faqs = await Faqs.find({ projectId: req.params.id });
  if (faqs) {
    const faqsData = faqs.map((q) => {
      const plainQ = q.toObject(); //turn mongoose object into plain object
      const { _id, projectId, createdAt, updateAt, ...qData } = plainQ;
      qData.productId = newProd._id;
      return qData;
    });
    const newFaqs = await Faqs.insertMany(faqsData);
    if (!newFaqs) {
      return appError(500, '募資轉商品失敗，轉換常見問題失敗，請聯絡管理員');
    }
  }

  const updatedProj = await Project.findByIdAndUpdate(req.params.id, {
    isCommercialized: 1,
    productId: newProd._id
  });
  if (!updatedProj) {
    return next(
      appError(500, '募資轉商品失敗，更新專案狀態發生錯誤，請聯絡管理員')
    );
  }

  const newProdWithFaqs = await Product.findById(newProd._id).populate('faqs');

  successHandler(res, '募資轉商品成功', newProdWithFaqs);
});

module.exports = handleConvertIntoProduct;
