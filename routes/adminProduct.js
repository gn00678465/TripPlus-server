const express = require('express');
const router = express.Router();
const { isAdmin } = require('../services/auth');
const productController = require('../controllers/adminProduct');

router.get('/:productId/info', isAdmin, productController.getProduct);
router.patch(
  '/:productId/info/image',
  isAdmin,
  productController.editProductImage
);
router.patch(
  '/:productId/info/setting',
  isAdmin,
  productController.editProductSetting
);
router.patch(
  '/:productId/info/payment',
  isAdmin,
  productController.editProductPayment
);

module.exports = router;
