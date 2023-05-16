const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const Order = require('../../models/ordersModel');

const getOrders = handleErrorAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: 'projectId',
      select: 'title',
      populate: {
        path: 'teamId',
        select: 'title'
      }
    })
    .populate({
      path: 'productId',
      select: 'title',
      populate: {
        path: 'teamId',
        select: 'title'
      }
    })
    .populate({
      path: 'planId',
      select: 'title'
    });
  if (!orders) {
    return next(appError(400, '查無此訂單'));
  }
  successHandler(res, '取得訂單資料成功', orders);
});

module.exports = { getOrders };
