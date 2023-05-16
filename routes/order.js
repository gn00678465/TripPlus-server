const express = require('express');
const router = express.Router();

const { isAuth } = require('../services/auth');

const OrderController = require('../controllers/order');

router.post('/', isAuth, OrderController.handleCreateOrder);

module.exports = router;
