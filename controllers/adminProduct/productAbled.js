const ObjectId = require('mongoose').Types.ObjectId;
const validator = require('validator');
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');

const editAbled = handleErrorAsync(async (req, res, next) => {
  const { isAbled } = req.body;
  const { productId } = req.params;
  if (!productId || !ObjectId.isValid(productId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId)
    .populate('teamId')
    .populate('plans');

  if (!product) {
    return next(appError(400, '查無此商品'));
  }
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限編輯商品'));
  }
  if (
    (isAbled === 0 ? '0' : isAbled) &&
    !validator.isIn(isAbled.toString(), ['0', '1'])
  ) {
    return next(appError(400, '是否啓用格式不正確'));
  }

  const errMsgAry = [];
  if (isAbled === 1) {
    if (!product.keyVision) {
      errMsgAry.push('商品主視覺');
    }
    if (!product.summary) {
      errMsgAry.push('商品摘要');
    }
    if (!product.url) {
      errMsgAry.push('商品網址');
    }
    if (!product.seoDescription) {
      errMsgAry.push('SEO 描述');
    }
    if (!validator.isInt(product.price.toString(), { gt: 0 })) {
      errMsgAry.push('商品金額應為大於 0 的整數數值');
    }
    if (!product.location) {
      errMsgAry.push('商品產地');
    }
    if (!product.material) {
      errMsgAry.push('商品材質');
    }
    if (!product.size) {
      errMsgAry.push('商品尺寸');
    }
    if (!product.weight) {
      errMsgAry.push('商品重量');
    }
    if (!(product.payment === 0 ? '0' : product.payment)) {
      errMsgAry.push('付款方式');
    }
    if (product.payment === 1 && !product.atmDeadline) {
      errMsgAry.push('ATM 付款期限');
    }
    if (product.payment === 1 && !product.csDeadline) {
      errAry.push('超商付款期限');
    }
    if (!product.content) {
      errMsgAry.push('商品内文');
    }
    if (product.plans?.length < 1) {
      errMsgAry.push('至少一個回饋方案');
    }

    if (errMsgAry.length > 0) {
      return next(
        appError(400, `需填寫完下列資訊才能啓用商品：${errMsgAry.join(',')}`)
      );
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      isAbled
    },
    { new: true, runValidators: true }
  );
  if (!updatedProduct) {
    return next(appError(500, '更新商品啓用狀態失敗'));
  }

  successHandler(res, '更新商品啓用狀態成功', updatedProduct);
});

module.exports = editAbled;
