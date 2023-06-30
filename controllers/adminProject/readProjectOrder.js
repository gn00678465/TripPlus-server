const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Order = require('../../models/ordersModel');

const handleReadProjOrder = handleErrorAsync(async (req, res, next) => {
  const {
    page = '1',
    limit = '10',
    status,
    paidStatus,
    orderDate,
    shipDate,
    query,
    sortOrder,
    sortBuyer,
    sortStatus,
    sortPaidStatus,
    sortShipment,
    sortOrderDate,
    sortShipDate,
    sortTotal
  } = req.query;

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

  if (!validator.isInt(page, { gt: 0 }) || !validator.isInt(limit, { gt: 0 })) {
    return next(appError(400, '路由資訊錯誤，page 或 limit 資料錯誤'));
  }

  if (status && !validator.isIn(status, ['0', '1', '2'])) {
    return next(appError(400, '路由資訊錯誤，status 資料錯誤'));
  }

  if (paidStatus && !validator.isIn(paidStatus, ['0', '1'])) {
    return next(appError(400, '路由資訊錯誤，paidStatus 資料錯誤'));
  }

  if (orderDate && !Date.parse(orderDate)) {
    return next(appError(400, '路由資訊錯誤，訂購日期格式錯誤'));
  }

  if (shipDate && !Date.parse(shipDate)) {
    return next(appError(400, '路由資訊錯誤，出貨日期格式錯誤'));
  }

  if (sortOrder && !validator.isIn(sortOrder, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortOrder 資料錯誤'));
  }

  if (sortBuyer && !validator.isIn(sortBuyer, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortBuyer 資料錯誤'));
  }

  if (sortStatus && !validator.isIn(sortStatus, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortStatus 資料錯誤'));
  }

  if (sortPaidStatus && !validator.isIn(sortPaidStatus, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortPaidStatus 資料錯誤'));
  }

  if (sortShipment && !validator.isIn(sortShipment, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortShipment 資料錯誤'));
  }

  if (sortOrderDate && !validator.isIn(sortOrderDate, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortOrderDate 資料錯誤'));
  }

  if (sortShipDate && !validator.isIn(sortShipDate, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortShipDate 資料錯誤'));
  }

  if (sortTotal && !validator.isIn(sortTotal, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortTotal 資料錯誤'));
  }

  let orders = await Order.find({ projectId: req.params.id }).populate({
    path: 'projectId',
    select: 'title'
  });

  if (status) {
    orders = orders.filter((x) => x.shipmentStatus == status);
  }

  if (paidStatus) {
    orders = orders.filter((x) => x.paymentStatus == paidStatus);
  }

  if (orderDate) {
    orders = orders.filter(
      (x) => x.createdAt.toDateString() === new Date(orderDate).toDateString()
    );
  }

  if (shipDate) {
    orders = orders.filter(
      (x) => x.shipDate?.toDateString() === new Date(shipDate).toDateString()
    );
  }

  if (query) {
    orders = orders.filter(
      (x) => x.projectId.title.includes(query) || x.buyerName.includes(query)
    );
  }

  if (sortOrder === 'asc') {
    orders.sort((a, b) => {
      return a._id.toString().localeCompare(b._id);
    });
  } else if (sortOrder === 'desc') {
    orders.sort((a, b) => {
      return b._id.toString().localeCompare(a._id);
    });
  }

  if (sortBuyer === 'asc') {
    orders.sort((a, b) => {
      return a.buyerName.localeCompare(b.buyerName, 'zh-Hant');
    });
  } else if (sortBuyer === 'desc') {
    orders.sort((a, b) => {
      return b.buyerName.localeCompare(a.buyerName, 'zh-Hant');
    });
  }

  if (sortStatus === 'asc') {
    orders.sort((a, b) => {
      return a.shipmentStatus - b.shipmentStatus;
    });
  } else if (sortStatus === 'desc') {
    orders.sort((a, b) => {
      return b.shipmentStatus - a.shipmentStatus;
    });
  }

  if (sortPaidStatus === 'asc') {
    orders.sort((a, b) => {
      return a.paymentStatus - b.paymentStatus;
    });
  } else if (sortPaidStatus === 'desc') {
    orders.sort((a, b) => {
      return b.paymentStatus - a.paymentStatus;
    });
  }

  if (sortShipment === 'asc') {
    orders.sort((a, b) => {
      return a.shipment - b.shipment;
    });
  } else if (sortShipment === 'desc') {
    orders.sort((a, b) => {
      return b.shipment - a.shipment;
    });
  }

  if (sortOrderDate === 'asc') {
    orders.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
  } else if (sortOrderDate === 'desc') {
    orders.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }

  if (sortShipDate === 'asc') {
    orders.sort((a, b) => {
      return a.shipDate - b.shipDate;
    });
  } else if (sortShipDate === 'desc') {
    orders.sort((a, b) => {
      return b.shipDate - a.shipDate;
    });
  }

  if (sortTotal === 'asc') {
    orders.sort((a, b) => {
      return a.total - b.total;
    });
  } else if (sortTotal === 'desc') {
    orders.sort((a, b) => {
      return b.total - a.total;
    });
  }

  const pageN = Number(page);
  const limitN = Number(limit);
  const items = orders.slice((pageN - 1) * limitN, pageN * limitN);
  const total = orders.length;
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

  successHandler(res, '取得專案訂單資料成功', result);
});

module.exports = handleReadProjOrder;
