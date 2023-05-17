const express = require('express');
const router = express.Router();
const { isAdmin } = require('../services/auth');
const productController = require('../controllers/adminProduct');

router.get('/:productId/dashboard', isAdmin, productController.getProductIndex);
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
router.get('/:productId/content', isAdmin, productController.getProductContent);
router.patch(
  '/:productId/content',
  isAdmin,
  productController.editProductContent
);
router.get('/:productId/team/:teamId', isAdmin, productController.getTeam);
router.get('/:productId/plans', isAdmin, productController.getProductPlans);
router.post('/:productId/plan', isAdmin, productController.createProductPlan);
router.patch(
  '/:productId/plan/:planId',
  isAdmin,
  productController.editProductPlan
);
router.delete(
  '/:productId/plan/:planId',
  isAdmin,
  productController.delProductPlan
);
router.get('/:productId/faqs', isAdmin, productController.getProductFaqs);
router.post('/:productId/faq', isAdmin, productController.createProductFaq);
router.patch(
  '/:productId/faq/:faqId',
  isAdmin,
  productController.editProductFaq
);
router.delete(
  '/:productId/faq/:faqId',
  isAdmin,
  productController.delProductFaq
);
module.exports = router;
