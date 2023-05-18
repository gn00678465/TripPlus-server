const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Order = require('../../models/ordersModel');

const handleReadProjOrder = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);

  if (!proj) {
    return next(appError(400, '取得專案訂單失敗，查無專案'));
  }

  if (proj.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無此瀏覽專案的訂單權限'));
  }

  const orders = await Order.find({ projectId: req.params.id });

  successHandler(res, '取得專案訂單資料成功', orders);
});

module.exports = handleReadProjOrder;
