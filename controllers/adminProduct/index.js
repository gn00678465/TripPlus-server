const {
  getProduct,
  editProductImage,
  editProductSetting,
  editProductPayment
} = require('./productInfo');
const { getProductContent, editProductContent } = require('./productContent');

module.exports.getProduct = getProduct;
module.exports.editProductImage = editProductImage;
module.exports.editProductSetting = editProductSetting;
module.exports.editProductPayment = editProductPayment;
module.exports.getProductContent = getProductContent;
module.exports.editProductContent = editProductContent;
