const db = require('../data/db');
const config = require('../config');

/**
 * @desc   Admin Login / Verify Admin Status
 * @route  POST /api/admin/login
 */
const login = async (req, res) => {
  try {
    // If authenticated via requireAdmin or requireAuth
    if (req.user) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin privileges required.'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Admin authentication verified',
        data: {
          user: req.user
        },
        user: req.user
      });
    }

    const { email } = req.body;
    const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();

    if (!email || email.trim().toLowerCase() !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials'
      });
    }

    const user = await db.findUserByEmail(adminEmail);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      data: {
        user: {
          id: user.id,
          uid: user.firebase_uid,
          name: user.name,
          email: user.email,
          role: 'admin'
        }
      },
      user: {
        id: user.id,
        uid: user.firebase_uid,
        name: user.name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Admin authentication failed: ' + error.message
    });
  }
};

/**
 * @desc   Get Admin Profile
 * @route  GET /api/admin/me
 */
const getAdminMe = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin details: ' + error.message
    });
  }
};

/**
 * @desc   Get Admin Dashboard Stats Overview
 * @route  GET /api/admin/stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const orders = await db.getOrders();
    const reservations = await db.getReservations();
    const menuItems = db.getMenuItems();
    const reviews = await db.getReviews();
    const contactMessages = await db.getContactMessages();
    const users = await db.getAllUsers();

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount || o.totalAmount) || 0), 0);
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        pendingOrders,
        totalReservations: reservations.length,
        confirmedReservations,
        totalMenuItems: menuItems.length,
        totalReviews: reviews.length,
        totalMessages: contactMessages.length,
        totalCustomers: users.filter(u => u.role === 'customer').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats: ' + error.message
    });
  }
};

/**
 * @desc   Get All Orders (Admin)
 * @route  GET /api/admin/orders
 */
const getAdminOrders = async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders: ' + error.message
    });
  }
};

/**
 * @desc   Get All Reservations (Admin)
 * @route  GET /api/admin/reservations
 */
const getAdminReservations = async (req, res) => {
  try {
    const reservations = await db.getReservations();
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservations: ' + error.message
    });
  }
};

/**
 * @desc   Get All Users / Customers (Admin)
 * @route  GET /api/admin/users
 */
const getAdminUsers = async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users: ' + error.message
    });
  }
};

module.exports = {
  login,
  getAdminMe,
  getDashboardStats,
  getAdminOrders,
  getAdminReservations,
  getAdminUsers
};
