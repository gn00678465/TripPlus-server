const mongoose = require('mongoose');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');
const Faqs = require('../../models/faqsModel');

const handleConvertIntoProduct = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
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
    isAbled,
    ...productInfo //the info product needs
  } = proj.toObject(); //turn mongoose doc into plain object

  //get project faqs
  const faqs = await Faqs.find({ projectId: req.params.id });
  let session = null;
  let newProd = null;

  await Product.createCollection()
    .then(() => {
      return mongoose.startSession();
    })
    .then(async (_session) => {
      session = _session;
      session.startTransaction();
      newProd = await Product.create([productInfo], { session });
      return newProd;
    })
    .then(() => {
      if (faqs.length > 0) {
        const faqsData = faqs.map((q) => {
          const plainQ = q.toObject(); //turn mongoose object into plain object
          const { _id, projectId, createdAt, updateAt, ...qData } = plainQ;
          qData.productId = newProd[0]._id;
          return qData;
        });
        return Faqs.create([faqsData], { session });
      }
      return true;
    })
    .then(() => {
      return Project.findByIdAndUpdate(
        req.params.id,
        {
          isCommercialized: 1,
          productId: newProd[0]._id
        },
        { session }
      );
    })
    .then(async () => {
      await session.commitTransaction();
      const newProdWithFaqs = await Product.findById(newProd[0]._id).populate(
        'faqs'
      );
      successHandler(res, '募資轉商品成功', newProdWithFaqs);
    })
    .catch(async () => {
      await session.abortTransaction();
      return next(appError(500, '募資轉商品失敗，請聯絡管理員'));
    })
    .finally(async () => {
      await session.endSession();
    });
});

module.exports = handleConvertIntoProduct;
