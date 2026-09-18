const db = require('../data/db');

/**
 * @desc   Get authenticated customer's own orders
 * @route  GET /api/my/orders
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await db.getMyOrders(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your orders: ' + error.message
    });
  }
};

/**
 * @desc   Get authenticated customer's own reservations
 * @route  GET /api/my/reservations
 */
const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await db.getMyReservations(userId);

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your reservations: ' + error.message
    });
  }
};

module.exports = {
  getMyOrders,
  getMyReservations
};
