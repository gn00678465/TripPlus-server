const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Order = require('../../models/ordersModel');

const handleReadProject = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id).lean().exec();

  if (!proj) {
    return next(appError(400, '取得專案資料失敗，查無專案'));
  }

  const orders = await Order.find({ projectId: req.params.id });
  proj.orderCount = orders?.length;
  proj.orderSuccess = orders?.filter((x) => x.paymentStatus == 1)?.length;
  proj.orderUnpaidAmount = orders
    ?.filter((x) => x.paymentStatus == 0)
    ?.reduce((acc, cur) => acc + cur.total, 0);
  proj.orderUnpaidCount = orders?.filter((x) => x.paymentStatus == 0)?.length;

  successHandler(res, '取得專案資料成功', proj);
});

module.exports = handleReadProject;
