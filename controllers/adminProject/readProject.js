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

  const proj = await Project.findById(req.params.id);

  if (!proj) {
    return next(appError(400, '取得專案資料失敗，查無專案'));
  }

  const orders = await Order.find({ projectId: req.params.id });

  const result = proj.toObject();
  result.orderCount = orders?.length;
  result.orderSuccess = orders?.filter((x) => x.paymentStatus == 1)?.length;
  result.orderUnpaidAmount = orders
    ?.filter((x) => x.paymentStatus == 0)
    ?.reduce((acc, cur) => acc + cur.total, 0);
  result.orderUnpaidCount = orders?.filter((x) => x.paymentStatus == 0)?.length;

  successHandler(res, '取得專案資料成功', result);
});

module.exports = handleReadProject;
