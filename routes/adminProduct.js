const express = require('express');
const router = express.Router();
const { isAdmin } = require('../services/auth');
const productController = require('../controllers/adminProduct');

router.get(
  '/admin/product/:productId/info',
  isAdmin,
  productController.getProduct
);
router.patch(
  '/admin/product/:productId/info/image',
  isAdmin,
  productController.editProductImage
);

module.exports = router;
