const {
  getProduct,
  editProductImage,
  editProductSetting,
  editProductPayment
} = require('./productInfo');
const { getProductContent, editProductContent } = require('./productContent');
const getTeam = require('./productTeam');
const {
  getProductPlan,
  createProductPlan,
  editProductPlan,
  delProductPlan
} = require('./productPlan');
const { getProductFaqs } = require('./productFaqs');

module.exports.getProduct = getProduct;
module.exports.editProductImage = editProductImage;
module.exports.editProductSetting = editProductSetting;
module.exports.editProductPayment = editProductPayment;
module.exports.getProductContent = getProductContent;
module.exports.editProductContent = editProductContent;
module.exports.getTeam = getTeam;
module.exports.getProductPlan = getProductPlan;
module.exports.createProductPlan = createProductPlan;
module.exports.editProductPlan = editProductPlan;
module.exports.delProductPlan = delProductPlan;
module.exports.getProductFaqs = getProductFaqs;
