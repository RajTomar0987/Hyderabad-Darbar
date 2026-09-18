const express = require('express');
const router = express.Router();
const { getMyOrders, getMyReservations } = require('../controllers/my.controller');
const { requireAuth } = require('../middleware/auth');

// All /api/my routes require customer authentication
router.use(requireAuth);

router.get('/orders', getMyOrders);
router.get('/reservations', getMyReservations);

module.exports = router;
