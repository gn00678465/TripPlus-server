const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const Order = require('../../models/ordersModel');

const getBonus = handleErrorAsync(async (req, res, next) => {
  const bonus = await Order.find()
    .populate({
      path: 'projectId',
      select: 'title'
    })
    .populate({
      path: 'productId',
      select: 'title'
    });
  if (!bonus) {
    return next(appError(400, '查無紅利點數'));
  }
  successHandler(res, '取得紅利點數資料成功', bonus);
});

module.exports = getBonus;
