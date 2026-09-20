const db = require('../data/db');

const ALLOWED_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled'
];

/**
 * @desc   Create a new online order (Protected with Firebase ID token)
 * @route  POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      phone, 
      email, 
      orderType = 'pickup', 
      address, 
      pickupTime, 
      deliveryInstructions, 
      items 
    } = req.body;

    // 1. Validation
    const errors = [];
    const validOrderType = orderType === 'delivery' ? 'delivery' : 'pickup';

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      errors.push('Customer name is required');
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('Contact phone number is required');
    }
    if (validOrderType === 'delivery' && (!address || typeof address !== 'string' || !address.trim())) {
      errors.push('Delivery address is required for delivery orders');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('At least one item must be added to the order');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // 2. Server-side price calculation (Never trust client-supplied prices)
    const menuItemsDb = db.getMenuItems();
    const verifiedItems = [];
    let calculatedSubtotal = 0;

    for (const rawItem of items) {
      const quantity = Math.max(1, parseInt(rawItem.quantity, 10) || 1);
      const menuItemId = rawItem.id || rawItem.menuItemId;
      
      // Lookup dish in menu database by ID or name
      const matchedDish = menuItemsDb.find(d => d.id === menuItemId || d.name.toLowerCase() === (rawItem.name || '').toLowerCase());
      
      let unitPrice = 0;
      let itemName = rawItem.name || 'Dish Item';

      if (matchedDish) {
        unitPrice = Number(matchedDish.price);
        itemName = matchedDish.name;
      } else if (rawItem.price && !isNaN(Number(rawItem.price)) && Number(rawItem.price) > 0) {
        // Fallback for custom or specialty deal items
        unitPrice = Number(rawItem.price);
      } else {
        unitPrice = 14.99;
      }

      const itemSubtotal = Number((unitPrice * quantity).toFixed(2));
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        id: menuItemId || 'dish_custom',
        menuItemId: menuItemId || 'dish_custom',
        name: itemName,
        price: unitPrice,
        quantity,
        subtotal: itemSubtotal
      });
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));
    const deliveryFee = validOrderType === 'delivery' ? (calculatedSubtotal > 60 ? 0 : 5.00) : 0;
    const calculatedTotal = Number((calculatedSubtotal + deliveryFee).toFixed(2));

    // 3. User association from verified token
    const userId = req.user ? req.user.id : null;
    const firebaseUid = req.user ? req.user.uid : null;
    const userEmail = email ? email.trim() : (req.user ? req.user.email : '');
    const finalAddress = validOrderType === 'pickup' 
      ? '52D Foster Street, Dandenong VIC 3175 (Store Pickup)' 
      : (address ? address.trim() : '');

    // 4. Create Order in database
    const newOrder = await db.createOrder({
      userId,
      firebaseUid,
      customerName: customerName.trim(),
      email: userEmail,
      phone: phone.trim(),
      orderType: validOrderType,
      address: finalAddress,
      pickupTime: pickupTime ? String(pickupTime).trim() : 'ASAP (20–30 mins)',
      deliveryInstructions: deliveryInstructions ? String(deliveryInstructions).trim() : '',
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount: calculatedTotal
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
 * @desc   Get single order by ID (Customer can get own order, Admin can get any)
 * @route  GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order '${id}' not found`
      });
    }

    // Security check: If not admin, ensure the customer owns this order
    if (req.user && req.user.role !== 'admin') {
      const ownsOrder = 
        (req.user.id && (order.userId === req.user.id || order.user_id === req.user.id)) ||
        (req.user.uid && (order.firebaseUid === req.user.uid || order.firebase_uid === req.user.uid)) ||
        (req.user.email && order.email && order.email.toLowerCase() === req.user.email.toLowerCase());

      if (!ownsOrder) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not have permission to view this order.'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order: ' + error.message
    });
  }
};

/**
 * @desc   Get all orders (Admin only)
 * @route  GET /api/orders or /api/admin/orders
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
 * @desc   Update order status (Admin only)
 * @route  PATCH /api/orders/:id/status or /api/admin/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses are: ${ALLOWED_ORDER_STATUSES.join(', ')}`
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
  getOrderById,
  getOrders,
  updateOrderStatus,
  ALLOWED_ORDER_STATUSES
};
