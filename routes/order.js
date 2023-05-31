const express = require('express');
const router = express.Router();

const { isAuth } = require('../services/auth');

const OrderController = require('../controllers/order');

router.post('/', isAuth, OrderController.handleCreateOrder);
router.post('/payment', isAuth, OrderController.handlePayment);

module.exports = router;
