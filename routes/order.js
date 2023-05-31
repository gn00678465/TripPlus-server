const express = require('express');
const router = express.Router();

const { isAuth } = require('../services/auth');

const OrderController = require('../controllers/order');

router.post('/', OrderController.handleUpdateOrder);
router.post('/payment', isAuth, OrderController.handlePayment);

module.exports = router;
