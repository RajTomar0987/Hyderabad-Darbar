const express = require('express');
const router = express.Router();
const { 
  login, 
  getAdminMe, 
  getDashboardStats,
  getAdminOrders,
  getAdminReservations,
  getAdminUsers
} = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', requireAdmin, getAdminMe);
router.get('/stats', requireAdmin, getDashboardStats);
router.get('/orders', requireAdmin, getAdminOrders);
router.get('/reservations', requireAdmin, getAdminReservations);
router.get('/users', requireAdmin, getAdminUsers);

module.exports = router;
