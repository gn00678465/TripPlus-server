const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const User = require('../../models/usersModel');
const Product = require('../../models/productsModel');
const Order = require('../../models/ordersModel');
const Comment = require('../../models/commentsModel');

const getProductIndex = handleErrorAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId || !ObjectId.isValid(productId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  const orders = await Order.find({ productId });
  const comments = await Comment.find({ productId });
  const followers = await User.find({
    follows: { $elemMatch: { productId } }
  });
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無此瀏覽商品的 Dashboard 權限'));
  }
  if (!product || !orders) {
    return next(appError(500, '取得商品 Dashboard 資料失敗'));
  }
  let averageRate = 0;
  if (comments) {
    let sumRate = 0;
    comments?.forEach((comment) => (sumRate += comment.rate));
    averageRate = sumRate / comments.length;
  }
  const result = {
    id: productId,
    projectTitle: product.title,
    saleTotal: product.sum,
    buyerCount: product.buyerCount,
    comments,
    averageRate: 0 || averageRate,
    followerAmount: followers.length,
    unpaidOrder: orders.filter((x) => x.paymentStatus === 0).length,
    paidOrder: orders.filter((x) => x.paymentStatus === 1).length,
    shippedOrder: orders.filter((x) => x.shipmentStatus > 0).length
  };
  successHandler(res, '取得商品資料成功', result);
});

module.exports = getProductIndex;
