const {
  getProduct,
  editProductImage,
  editProductSetting,
  editProductPayment
} = require('./productInfo');
const { getProductContent, editProductContent } = require('./productContent');
const getTeam = require('./productTeam');
const {
  getProductPlans,
  createProductPlan,
  editProductPlan,
  delProductPlan
} = require('./productPlan');
const {
  getProductFaqs,
  createProductFaq,
  editProductFaq,
  delProductFaq
} = require('./productFaqs');
const getProductIndex = require('./productDashboard');

module.exports.getProduct = getProduct;
module.exports.editProductImage = editProductImage;
module.exports.editProductSetting = editProductSetting;
module.exports.editProductPayment = editProductPayment;
module.exports.getProductContent = getProductContent;
module.exports.editProductContent = editProductContent;
module.exports.getTeam = getTeam;
module.exports.getProductPlans = getProductPlans;
module.exports.createProductPlan = createProductPlan;
module.exports.editProductPlan = editProductPlan;
module.exports.delProductPlan = delProductPlan;
module.exports.getProductFaqs = getProductFaqs;
module.exports.createProductFaq = createProductFaq;
module.exports.editProductFaq = editProductFaq;
module.exports.delProductFaq = delProductFaq;
module.exports.getProductIndex = getProductIndex;
