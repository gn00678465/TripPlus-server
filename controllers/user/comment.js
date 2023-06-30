const validator = require('validator');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const Order = require('../../models/ordersModel');
const Comment = require('../../models/commentsModel');
const Product = require('../../models/productsModel');

const createComment = handleErrorAsync(async (req, res, next) => {
  const { productId, rate, shortComment, comment, imageUrls } = req.body;
  const { orderId } = req.params;
  if (!req.user) {
    return next(appError(400, '使用者資訊錯誤，找不到使用者'));
  }
  if (!productId || !(rate === 0 ? '0' : rate)) {
    return next(appError(400, '以下欄位不可爲空：商品 id、商品品質'));
  }
  const order = await Order.findById(orderId);
  const product = await Product.findById(productId);
  if (!order) {
    return next(appError(400, '查無此訂單'));
  }
  if (order.isCommented === 1) {
    return next(appError(400, '此訂單已評論'));
  }
  if (order.member?.toString() !== req.user.id) {
    return next(appError(403, '您無權限編輯'));
  }
  if (!product || order.productId?.toString() !== productId) {
    return next(appError(400, '查無此商品'));
  }
  if (!validator.isFloat(rate.toString(), { min: 1, max: 5 })) {
    return next(appError(400, '商品品質 1~ 5 星'));
  }
  const errMsgAry = [];
  if (imageUrls && imageUrls.length > 0) {
    if (
      !Array.isArray(imageUrls) ||
      !imageUrls.every((url) => validator.isURL(url))
    ) {
      errMsgAry.push('請輸入有效的 Url 或是格式錯誤');
    }
  }
  if (
    shortComment &&
    !validator.isIn(shortComment, [
      '符合期待',
      '質感優異',
      '運送迅速',
      '想再回購',
      '服務貼心',
      '風格獨特'
    ])
  ) {
    errMsgAry.push(
      '請選擇：符合期待、質感優異、運送迅速、想再回購、服務貼心、風格獨特'
    );
  }
  if (errMsgAry.length > 0) {
    return next(appError(400, errMsgAry.join(',')));
  }
  const newComment = await Comment.create({
    orderId,
    writer: req.user.id,
    ...req.body
  });
  const updateOrder = await Order.findByIdAndUpdate(orderId, {
    isCommented: 1
  });
  if (!updateOrder) {
    return next(appError(500, '訂單編輯失敗，請聯絡管理員'));
  }
  if (!newComment) {
    return next(appError(500, '新增評論失敗，請聯絡管理員'));
  }
  successHandler(res, '新增評論成功', newComment);
});

module.exports = createComment;
