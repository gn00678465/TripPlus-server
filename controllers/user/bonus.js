const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const Order = require('../../models/ordersModel');
const User = require('../../models/usersModel');

const getBonus = handleErrorAsync(async (req, res, next) => {
  const orders = await Order.find({ member: req.user.id })
    .populate({
      path: 'projectId',
      select: 'title endTime'
    })
    .populate({
      path: 'productId',
      select: 'title'
    });
  if (!orders) {
    return next(appError(400, '查無紅利點數'));
  }
  const user = await User.findById(req.user.id);
  const result = {};
  const bonus = orders.reduce(
    (totalBonus, order) => totalBonus + order.bonus,
    0
  );
  result.TotalBonus = bonus;

  const projects = [];
  const products = [];

  orders.forEach((order) => {
    if (order.bonus > 0) {
      if (order.projectId) {
        const project = order.projectId;
        let sendDate = '';
        if (project.endTime) {
          sendDate = new Date(project.endTime);
          sendDate.setDate(sendDate.getDate() + 30);
        } else {
          sendDate = new Date(order.paidAt);
          sendDate.setDate(sendDate.getDate() + 30);
        }
        const expirationDate = new Date(sendDate.getFullYear() + 1, 0, 1);
        projects.push({
          title: project.title,
          sendDate: sendDate.toISOString(),
          expirationDate: expirationDate.toISOString(),
          transactionId: order.transactionId,
          bonus: order.bonus
        });
      }
      if (order.productId) {
        const product = order.productId;
        const sendDate = new Date(order.paidAt);
        sendDate.setDate(sendDate.getDate() + 30);
        const expirationDate = new Date(sendDate.getFullYear() + 1, 0, 1);
        products.push({
          title: product.title,
          sendDate: sendDate.toISOString(),
          expirationDate: expirationDate.toISOString(),
          transactionId: order.transactionId,
          bonus: order.bonus
        });
      }
    }
  });

  result.projects = projects;
  result.products = products;
  result.userBonus = user.bonus;

  successHandler(res, '取得紅利點數資料成功', result);
});

module.exports = getBonus;
