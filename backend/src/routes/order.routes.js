const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrders, updateOrderStatus } = require('../controllers/order.controller');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/', requireAuth, createOrder);
router.get('/:id', requireAuth, getOrderById);
router.get('/', requireAdmin, getOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
