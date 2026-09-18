const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/order.controller');
const { requireAdmin, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.get('/', requireAdmin, getOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
