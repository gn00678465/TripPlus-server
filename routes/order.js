const express = require('express');
const router = express.Router();

const { isAuth } = require('../services/auth');

const OrderController = require('../controllers/order');

router.post('/', OrderController.handleUpdateOrder);
router.post('/payment', isAuth, OrderController.handlePayment);
router.post('/client-result', OrderController.handleClientResult);

module.exports = router;
