const db = require('../data/db');

/**
 * @desc   Create a new online order
 * @route  POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, email, address, items, totalAmount } = req.body;

    // Validation
    const errors = [];
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      errors.push('customerName is required');
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('phone is required');
    }
    if (!address || typeof address !== 'string' || !address.trim()) {
      errors.push('address is required');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('items array with at least one item is required');
    }
    if (totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      errors.push('totalAmount must be a positive number');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Associate userId strictly from req.user if authenticated (never trust frontend user ID)
    const userId = req.user ? req.user.id : null;
    const userEmail = email ? email.trim() : (req.user ? req.user.email : '');

    const newOrder = await db.createOrder({
      userId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: userEmail,
      address: address.trim(),
      items,
      totalAmount: Number(totalAmount)
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order: ' + error.message
    });
  }
};

/**
 * @desc   Get all orders (admin viewing)
 * @route  GET /api/orders
 */
const getOrders = async (req, res) => {
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
 * @desc   Update order status (admin)
 * @route  PATCH /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Order '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status: ' + error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};
