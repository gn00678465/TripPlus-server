const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');

const getProductContent = handleErrorAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限瀏覽此商品內文'));
  }
  if (!product) {
    return next(appError(400, '取得商品内文失敗，查無商品'));
  }
  successHandler(res, '取得商品内文成功', { content: product.content || '' });
});
const editProductContent = handleErrorAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { content } = req.body;
  if (!productId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限編輯此商品內文'));
  }
  if (!Object.keys(req.body).includes('content')) {
    return next(appError(400, '無商品内文資訊'));
  }
  const updatedContent = await Product.findByIdAndUpdate(
    req.params.productId,
    {
      content
    },
    { new: true, runValidators: true }
  );
  if (!updatedContent) {
    return next(appError(500, '編輯商品内文失敗'));
  }
  successHandler(res, '編輯商品内文成功', {
    content: updatedContent.content || ''
  });
});

module.exports = { getProductContent, editProductContent };
