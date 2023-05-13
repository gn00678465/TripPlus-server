const {
  getProduct,
  editProductImage,
  editProductSetting,
  editProductPayment
} = require('./productInfo');
const editProductContent = require('./productContent');

module.exports.getProduct = getProduct;
module.exports.editProductImage = editProductImage;
module.exports.editProductSetting = editProductSetting;
module.exports.editProductPayment = editProductPayment;
module.exports.editProductContent = editProductContent;
