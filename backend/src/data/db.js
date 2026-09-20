const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');
const config = require('../config');
const { menuItems: initialMenu } = require('./menu');

const DB_FILE = path.join(__dirname, 'database.json');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

let pgPool = null;
let usePostgres = false;

// Initialize PostgreSQL connection pool if DATABASE_URL is configured
if (process.env.DATABASE_URL) {
  try {
    const isSsl = process.env.DATABASE_URL.includes('sslmode=require') || 
                  process.env.NODE_ENV === 'production' || 
                  process.env.DATABASE_URL.includes('supabase.co');
    
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isSsl ? { rejectUnauthorized: false } : false
    });
    usePostgres = true;
    console.log('[DB] PostgreSQL pool configured with DATABASE_URL.');
  } catch (err) {
    console.warn('[DB] Failed to initialize PostgreSQL pool:', err.message);
    usePostgres = false;
  }
}

// In-file persistent database state helper
const getInitialState = () => {
  const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();

  return {
    users: [
      {
        id: 'usr-admin-001',
        firebase_uid: 'firebase_admin_default_uid_2026',
        name: 'Darbar Administrator',
        email: adminEmail,
        phone: '+61 3 9791 0000',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 'ord-seed-01',
        order_id: 'ORD-DARBAR-101',
        user_id: null,
        firebase_uid: null,
        customer_name: 'Aarav Patel',
        email: 'aarav@example.com',
        phone: '+61 412 345 678',
        address: '14 Walker St, Dandenong VIC 3175',
        total_amount: 58.70,
        status: 'delivered',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    order_items: [
      {
        id: 'item-seed-01',
        order_id: 'ord-seed-01',
        menu_item_id: 'biryani-1',
        name: 'Hyderabadi Chicken Dum Biryani',
        price: 21.90,
        quantity: 2
      },
      {
        id: 'item-seed-02',
        order_id: 'ord-seed-01',
        menu_item_id: 'curry-1',
        name: 'Mirchi Ka Salan',
        price: 14.90,
        quantity: 1
      }
    ],
    reservations: [
      {
        id: 'res-seed-01',
        reservation_id: 'RES-DARBAR-201',
        user_id: null,
        firebase_uid: null,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+61 498 765 432',
        guests: 4,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '19:30',
        message: 'Window seating preferred, celebrating anniversary.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    menu_items: [...initialMenu],
    reviews: [
      {
        id: 'rev-seed-01',
        user_id: null,
        firebase_uid: null,
        name: 'Rahul Varma',
        rating: 5,
        comment: 'Best Dum Biryani in Melbourne! The meat was tender and flavors were authentic royal Hyderabadi.',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ],
    contact_messages: []
  };
};

// Read local persistent store
const readLocalDb = () => {
  try {
    let parsed;
    if (!fs.existsSync(DB_FILE)) {
      parsed = getInitialState();
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      return parsed;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    parsed = JSON.parse(data);

    // Normalize collections
    parsed.users = Array.isArray(parsed.users) ? parsed.users : [];
    parsed.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
    parsed.order_items = Array.isArray(parsed.order_items) ? parsed.order_items : [];
    parsed.reservations = Array.isArray(parsed.reservations) ? parsed.reservations : [];
    parsed.reviews = Array.isArray(parsed.reviews) ? parsed.reviews : [];
    parsed.contact_messages = Array.isArray(parsed.contact_messages) ? parsed.contact_messages : [];

    return parsed;
  } catch (err) {
    console.error('[DB] Error reading local db file:', err);
    return getInitialState();
  }
};

// Write local persistent store
const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Error writing to local db file:', err);
  }
};

// Initialize schema in PostgreSQL
const initDb = async () => {
  if (usePostgres && pgPool) {
    try {
      const client = await pgPool.connect();
      try {
        if (fs.existsSync(SCHEMA_FILE)) {
          const sql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
          await client.query(sql);
          console.log('[DB] PostgreSQL schema verified successfully.');
        }

        // Check if default admin exists
        const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();
        const res = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
        if (res.rows.length === 0) {
          const adminId = 'usr-admin-' + crypto.randomBytes(4).toString('hex');
          await client.query(
            `INSERT INTO users (id, firebase_uid, name, email, phone, role)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [adminId, 'firebase_admin_default_uid_2026', 'Darbar Administrator', adminEmail, '+61 3 9791 0000', 'admin']
          );
          console.log(`[DB] Seeded initial admin account in PostgreSQL (${adminEmail}).`);
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('[DB] PostgreSQL migration check failed, fallback to local file:', err.message);
      usePostgres = false;
    }
  }

  // Ensure local DB has admin
  const local = readLocalDb();
  const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();
  const existingAdmin = local.users.find(u => u.email.toLowerCase() === adminEmail);
  if (!existingAdmin) {
    local.users.push({
      id: 'usr-admin-001',
      firebase_uid: 'firebase_admin_default_uid_2026',
      name: 'Darbar Administrator',
      email: adminEmail,
      phone: '+61 3 9791 0000',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    writeLocalDb(local);
  }
};

initDb().catch(err => console.error('[DB] Database initialization error:', err));

const db = {
  // ================= USERS (FIREBASE AUTH LINKED) =================
  async findUserByFirebaseUid(uid) {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] PostgreSQL findUserByFirebaseUid failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.users.find(u => u.firebase_uid === uid) || null;
  },

  async findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalized]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] PostgreSQL findUserByEmail failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.users.find(u => u.email.toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] PostgreSQL findUserById failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.users.find(u => u.id === id) || null;
  },

  async syncFirebaseUser({ firebase_uid, name, email, phone = '', role = null }) {
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const now = new Date().toISOString();
    const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();

    // Determine role (protect admin role)
    const effectiveRole = role || (normalizedEmail === adminEmail ? 'admin' : 'customer');

    // 1. Try finding by firebase_uid or email
    let user = null;
    if (firebase_uid) {
      user = await this.findUserByFirebaseUid(firebase_uid);
    }
    if (!user && normalizedEmail) {
      user = await this.findUserByEmail(normalizedEmail);
    }

    if (user) {
      // Update existing record
      const updatedName = name && name.trim() ? name.trim() : user.name;
      const updatedPhone = phone && phone.trim() ? phone.trim() : (user.phone || '');
      const updatedUid = firebase_uid || user.firebase_uid;

      if (usePostgres && pgPool) {
        try {
          const res = await pgPool.query(
            `UPDATE users 
             SET firebase_uid = $1, name = $2, phone = $3, updated_at = $4
             WHERE id = $5
             RETURNING id, firebase_uid, name, email, phone, role, created_at, updated_at`,
            [updatedUid, updatedName, updatedPhone, now, user.id]
          );
          if (res.rows[0]) return res.rows[0];
        } catch (err) {
          console.warn('[DB] PostgreSQL user update failed:', err.message);
        }
      }

      const local = readLocalDb();
      const localUser = local.users.find(u => u.id === user.id);
      if (localUser) {
        localUser.firebase_uid = updatedUid;
        localUser.name = updatedName;
        localUser.phone = updatedPhone;
        localUser.updated_at = now;
        writeLocalDb(local);
        return localUser;
      }
    }

    // 2. Create new record
    const id = 'usr_' + crypto.randomUUID();
    const newUser = {
      id,
      firebase_uid: firebase_uid || ('fb_' + crypto.randomBytes(8).toString('hex')),
      name: name ? name.trim() : 'Guest Customer',
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      role: effectiveRole,
      created_at: now,
      updated_at: now
    };

    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `INSERT INTO users (id, firebase_uid, name, email, phone, role, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, firebase_uid, name, email, phone, role, created_at, updated_at`,
          [newUser.id, newUser.firebase_uid, newUser.name, newUser.email, newUser.phone, newUser.role, now, now]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] PostgreSQL insert user failed:', err.message);
      }
    }

    const local = readLocalDb();
    local.users.push(newUser);
    writeLocalDb(local);
    return newUser;
  },

  async getAllUsers() {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          'SELECT id, firebase_uid, name, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );
        return res.rows;
      } catch (err) {
        console.warn('[DB] PostgreSQL getAllUsers failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.users.map(({ password: _p, password_hash: _ph, ...u }) => u);
  },

  // ================= ORDERS =================
  async createOrder({ 
    userId = null, 
    firebaseUid = null, 
    customerName, 
    email, 
    phone, 
    orderType = 'pickup',
    address, 
    pickupTime = '',
    deliveryInstructions = '',
    items = [], 
    subtotal = 0,
    deliveryFee = 0,
    totalAmount = 0 
  }) {
    const id = 'ord_' + crypto.randomUUID();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    const normalizedItems = (items || []).map(item => ({
      id: item.id || item.menuItemId || 'custom',
      menu_item_id: item.menuItemId || item.id || 'custom',
      menuItemId: item.menuItemId || item.id || 'custom',
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      subtotal: Number(item.subtotal || (Number(item.price) * (Number(item.quantity) || 1)).toFixed(2))
    }));

    if (usePostgres && pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');
        const orderRes = await client.query(
          `INSERT INTO orders (
            id, order_id, user_id, firebase_uid, customer_name, email, phone, 
            order_type, address, pickup_time, delivery_instructions, subtotal, delivery_fee, 
            total_amount, status, payment_status, created_at, updated_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending', 'unpaid', $15, $16)
           RETURNING *`,
          [
            id, orderId, userId, firebaseUid, customerName, email, phone,
            orderType, address, pickupTime, deliveryInstructions, subtotal, deliveryFee,
            totalAmount, now, now
          ]
        );

        for (const item of normalizedItems) {
          const itemId = 'item_' + crypto.randomUUID();
          await client.query(
            `INSERT INTO order_items (id, order_id, menu_item_id, name, price, quantity)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [itemId, id, item.menuItemId, item.name, item.price, item.quantity]
          );
        }
        await client.query('COMMIT');
        const order = orderRes.rows[0];
        order.items = normalizedItems;
        order.orderId = order.order_id;
        order.customerName = order.customer_name;
        order.orderType = order.order_type;
        order.pickupTime = order.pickup_time;
        order.deliveryInstructions = order.delivery_instructions;
        order.subtotal = Number(order.subtotal);
        order.deliveryFee = Number(order.delivery_fee);
        order.totalAmount = Number(order.total_amount);
        order.paymentStatus = order.payment_status;
        order.createdAt = order.created_at;
        order.updatedAt = order.updated_at;
        return order;
      } catch (err) {
        await client.query('ROLLBACK');
        console.warn('[DB] PostgreSQL order transaction failed:', err.message);
      } finally {
        client.release();
      }
    }

    const local = readLocalDb();
    const newOrder = {
      id,
      order_id: orderId,
      orderId,
      user_id: userId,
      userId,
      firebase_uid: firebaseUid,
      firebaseUid,
      customer_name: customerName,
      customerName,
      email,
      phone,
      order_type: orderType,
      orderType,
      address,
      pickup_time: pickupTime,
      pickupTime,
      delivery_instructions: deliveryInstructions,
      deliveryInstructions,
      items: normalizedItems,
      subtotal: Number(subtotal),
      delivery_fee: Number(deliveryFee),
      deliveryFee: Number(deliveryFee),
      total_amount: Number(totalAmount),
      totalAmount: Number(totalAmount),
      status: 'pending',
      payment_status: 'unpaid',
      paymentStatus: 'unpaid',
      created_at: now,
      createdAt: now,
      updated_at: now,
      updatedAt: now
    };
    local.orders.unshift(newOrder);

    normalizedItems.forEach(item => {
      local.order_items.push({
        id: 'item_' + crypto.randomUUID(),
        order_id: id,
        menu_item_id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      });
    });

    writeLocalDb(local);
    return newOrder;
  },

  async getOrders() {
    if (usePostgres && pgPool) {
      try {
        const ordersRes = await pgPool.query('SELECT * FROM orders ORDER BY created_at DESC');
        const itemsRes = await pgPool.query('SELECT * FROM order_items');
        return ordersRes.rows.map(order => ({
          ...order,
          orderId: order.order_id,
          customerName: order.customer_name,
          orderType: order.order_type || 'pickup',
          pickupTime: order.pickup_time || '',
          deliveryInstructions: order.delivery_instructions || '',
          subtotal: Number(order.subtotal || order.total_amount),
          deliveryFee: Number(order.delivery_fee || 0),
          totalAmount: Number(order.total_amount),
          paymentStatus: order.payment_status || 'unpaid',
          userId: order.user_id,
          firebaseUid: order.firebase_uid,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsRes.rows
            .filter(item => item.order_id === order.id)
            .map(item => ({
              ...item,
              menuItemId: item.menu_item_id,
              subtotal: Number((Number(item.price) * Number(item.quantity)).toFixed(2))
            }))
        }));
      } catch (err) {
        console.warn('[DB] PostgreSQL getOrders failed:', err.message);
      }
    }
    const local = readLocalDb();
    return (local.orders || []).map(order => ({
      ...order,
      orderId: order.order_id || order.orderId,
      customerName: order.customer_name || order.customerName,
      orderType: order.order_type || order.orderType || 'pickup',
      pickupTime: order.pickup_time || order.pickupTime || '',
      deliveryInstructions: order.delivery_instructions || order.deliveryInstructions || '',
      subtotal: Number(order.subtotal || order.total_amount || order.totalAmount || 0),
      deliveryFee: Number(order.delivery_fee || order.deliveryFee || 0),
      totalAmount: Number(order.total_amount || order.totalAmount || 0),
      paymentStatus: order.payment_status || order.paymentStatus || 'unpaid',
      userId: order.user_id || order.userId,
      firebaseUid: order.firebase_uid || order.firebaseUid,
      createdAt: order.created_at || order.createdAt,
      updatedAt: order.updated_at || order.updatedAt,
      items: order.items || []
    }));
  },

  async getMyOrders(userId, firebaseUid = null, email = null) {
    if (usePostgres && pgPool) {
      try {
        const ordersRes = await pgPool.query(
          `SELECT * FROM orders 
           WHERE user_id = $1 
              OR ($2::text IS NOT NULL AND firebase_uid = $2)
              OR ($3::text IS NOT NULL AND LOWER(email) = LOWER($3))
           ORDER BY created_at DESC`,
          [userId, firebaseUid, email]
        );
        const itemsRes = await pgPool.query('SELECT * FROM order_items');
        return ordersRes.rows.map(order => ({
          ...order,
          orderId: order.order_id,
          customerName: order.customer_name,
          orderType: order.order_type || 'pickup',
          pickupTime: order.pickup_time || '',
          deliveryInstructions: order.delivery_instructions || '',
          subtotal: Number(order.subtotal || order.total_amount),
          deliveryFee: Number(order.delivery_fee || 0),
          totalAmount: Number(order.total_amount),
          paymentStatus: order.payment_status || 'unpaid',
          userId: order.user_id,
          firebaseUid: order.firebase_uid,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsRes.rows
            .filter(item => item.order_id === order.id)
            .map(item => ({
              ...item,
              menuItemId: item.menu_item_id,
              subtotal: Number((Number(item.price) * Number(item.quantity)).toFixed(2))
            }))
        }));
      } catch (err) {
        console.warn('[DB] PostgreSQL getMyOrders failed:', err.message);
      }
    }
    const local = readLocalDb();
    const normalizedEmail = email ? email.toLowerCase() : null;
    return (local.orders || [])
      .filter(o => 
        (userId && (o.user_id === userId || o.userId === userId)) ||
        (firebaseUid && (o.firebase_uid === firebaseUid || o.firebaseUid === firebaseUid)) ||
        (normalizedEmail && o.email && o.email.toLowerCase() === normalizedEmail)
      )
      .map(order => ({
        ...order,
        orderId: order.order_id || order.orderId,
        customerName: order.customer_name || order.customerName,
        orderType: order.order_type || order.orderType || 'pickup',
        pickupTime: order.pickup_time || order.pickupTime || '',
        deliveryInstructions: order.delivery_instructions || order.deliveryInstructions || '',
        subtotal: Number(order.subtotal || order.total_amount || order.totalAmount || 0),
        deliveryFee: Number(order.delivery_fee || order.deliveryFee || 0),
        totalAmount: Number(order.total_amount || order.totalAmount || 0),
        paymentStatus: order.payment_status || order.paymentStatus || 'unpaid',
        userId: order.user_id || order.userId,
        firebaseUid: order.firebase_uid || order.firebaseUid,
        createdAt: order.created_at || order.createdAt,
        updatedAt: order.updated_at || order.updatedAt,
        items: order.items || []
      }));
  },

  async getOrderById(id) {
    if (usePostgres && pgPool) {
      try {
        const orderRes = await pgPool.query(
          'SELECT * FROM orders WHERE id = $1 OR order_id = $1 LIMIT 1',
          [id]
        );
        if (!orderRes.rows[0]) return null;
        const order = orderRes.rows[0];
        const itemsRes = await pgPool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );
        return {
          ...order,
          orderId: order.order_id,
          customerName: order.customer_name,
          orderType: order.order_type || 'pickup',
          pickupTime: order.pickup_time || '',
          deliveryInstructions: order.delivery_instructions || '',
          subtotal: Number(order.subtotal || order.total_amount),
          deliveryFee: Number(order.delivery_fee || 0),
          totalAmount: Number(order.total_amount),
          paymentStatus: order.payment_status || 'unpaid',
          userId: order.user_id,
          firebaseUid: order.firebase_uid,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: itemsRes.rows.map(item => ({
            ...item,
            menuItemId: item.menu_item_id,
            subtotal: Number((Number(item.price) * Number(item.quantity)).toFixed(2))
          }))
        };
      } catch (err) {
        console.warn('[DB] PostgreSQL getOrderById failed:', err.message);
      }
    }
    const local = readLocalDb();
    const order = (local.orders || []).find(o => o.id === id || o.orderId === id || o.order_id === id);
    if (!order) return null;
    return {
      ...order,
      orderId: order.order_id || order.orderId,
      customerName: order.customer_name || order.customerName,
      orderType: order.order_type || order.orderType || 'pickup',
      pickupTime: order.pickup_time || order.pickupTime || '',
      deliveryInstructions: order.delivery_instructions || order.deliveryInstructions || '',
      subtotal: Number(order.subtotal || order.total_amount || order.totalAmount || 0),
      deliveryFee: Number(order.delivery_fee || order.deliveryFee || 0),
      totalAmount: Number(order.total_amount || order.totalAmount || 0),
      paymentStatus: order.payment_status || order.paymentStatus || 'unpaid',
      userId: order.user_id || order.userId,
      firebaseUid: order.firebase_uid || order.firebaseUid,
      createdAt: order.created_at || order.createdAt,
      updatedAt: order.updated_at || order.updatedAt,
      items: order.items || []
    };
  },

  async updateOrderStatus(id, status) {
    const now = new Date().toISOString();
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          'UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 OR order_id = $3 RETURNING *',
          [status, now, id]
        );
        if (res.rows[0]) {
          const order = res.rows[0];
          order.orderId = order.order_id;
          order.status = status;
          return order;
        }
      } catch (err) {
        console.warn('[DB] PostgreSQL updateOrderStatus failed:', err.message);
      }
    }
    const local = readLocalDb();
    const order = local.orders.find(o => o.id === id || o.orderId === id || o.order_id === id);
    if (order) {
      order.status = status;
      order.updated_at = now;
      order.updatedAt = now;
      writeLocalDb(local);
      return order;
    }
    return null;
  },

  // ================= RESERVATIONS =================
  async createReservation({ userId = null, firebaseUid = null, name, email, phone, guests, date, time, message }) {
    const id = 'res_' + crypto.randomUUID();
    const reservationId = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `INSERT INTO reservations (id, reservation_id, user_id, firebase_uid, name, email, phone, guests, date, time, message, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', $12, $13)
           RETURNING *`,
          [id, reservationId, userId, firebaseUid, name, email, phone, guests, date, time, message || '', now, now]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] PostgreSQL reservation insert failed:', err.message);
      }
    }

    const local = readLocalDb();
    const newRes = {
      id,
      reservation_id: reservationId,
      reservationId,
      user_id: userId,
      userId,
      firebase_uid: firebaseUid,
      name,
      email,
      phone,
      guests: Number(guests),
      date,
      time,
      message: message || '',
      status: 'pending',
      created_at: now,
      createdAt: now,
      updated_at: now
    };
    local.reservations.unshift(newRes);
    writeLocalDb(local);
    return newRes;
  },

  async getReservations() {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM reservations ORDER BY created_at DESC');
        return res.rows.map(r => ({
          ...r,
          reservationId: r.reservation_id,
          userId: r.user_id,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB] PostgreSQL getReservations failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.reservations || [];
  },

  async getMyReservations(userId, firebaseUid = null) {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          'SELECT * FROM reservations WHERE user_id = $1 OR ($2::text IS NOT NULL AND firebase_uid = $2) ORDER BY created_at DESC',
          [userId, firebaseUid]
        );
        return res.rows.map(r => ({
          ...r,
          reservationId: r.reservation_id,
          userId: r.user_id,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB] PostgreSQL getMyReservations failed:', err.message);
      }
    }
    const local = readLocalDb();
    return (local.reservations || []).filter(r => 
      (userId && (r.user_id === userId || r.userId === userId)) ||
      (firebaseUid && (r.firebase_uid === firebaseUid || r.firebaseUid === firebaseUid))
    );
  },

  async updateReservationStatus(id, status) {
    const now = new Date().toISOString();
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          'UPDATE reservations SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
          [status, now, id]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] PostgreSQL updateReservationStatus failed:', err.message);
      }
    }
    const local = readLocalDb();
    const resv = local.reservations.find(r => r.id === id || r.reservationId === id || r.reservation_id === id);
    if (resv) {
      resv.status = status;
      resv.updated_at = now;
      writeLocalDb(local);
      return resv;
    }
    return null;
  },

  // ================= REVIEWS =================
  async getReviews() {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM reviews ORDER BY created_at DESC');
        return res.rows.map(r => ({
          ...r,
          userId: r.user_id,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB] PostgreSQL getReviews failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.reviews || [];
  },

  async createReview({ userId = null, firebaseUid = null, name, rating, comment }) {
    const id = 'rev_' + crypto.randomUUID();
    const now = new Date().toISOString();

    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `INSERT INTO reviews (id, user_id, firebase_uid, name, rating, comment, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [id, userId, firebaseUid, name, rating, comment, now]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] PostgreSQL createReview failed:', err.message);
      }
    }

    const local = readLocalDb();
    const newRev = {
      id,
      user_id: userId,
      userId,
      firebase_uid: firebaseUid,
      name,
      rating: Number(rating),
      comment,
      created_at: now,
      createdAt: now
    };
    local.reviews.unshift(newRev);
    writeLocalDb(local);
    return newRev;
  },

  async deleteReview(id) {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
        return res.rows.length > 0;
      } catch (err) {
        console.warn('[DB] PostgreSQL deleteReview failed:', err.message);
      }
    }
    const local = readLocalDb();
    const idx = local.reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      local.reviews.splice(idx, 1);
      writeLocalDb(local);
      return true;
    }
    return false;
  },

  // ================= CONTACT MESSAGES =================
  async createContactMessage({ name, email, phone, subject, message }) {
    const id = 'msg_' + crypto.randomUUID();
    const now = new Date().toISOString();

    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query(
          `INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [id, name, email, phone, subject, message, now]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] PostgreSQL createContactMessage failed:', err.message);
      }
    }

    const local = readLocalDb();
    const newMsg = {
      id,
      name,
      email,
      phone,
      subject,
      message,
      created_at: now,
      createdAt: now
    };
    local.contact_messages.unshift(newMsg);
    writeLocalDb(local);
    return newMsg;
  },

  async getContactMessages() {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return res.rows;
      } catch (err) {
        console.warn('[DB] PostgreSQL getContactMessages failed:', err.message);
      }
    }
    const local = readLocalDb();
    return local.contact_messages || [];
  },

  async deleteContactMessage(id) {
    if (usePostgres && pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);
        return res.rows.length > 0;
      } catch (err) {
        console.warn('[DB] PostgreSQL deleteContactMessage failed:', err.message);
      }
    }
    const local = readLocalDb();
    const idx = local.contact_messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      local.contact_messages.splice(idx, 1);
      writeLocalDb(local);
      return true;
    }
    return false;
  },

  // ================= MENU ITEMS =================
  getMenuItems() {
    const local = readLocalDb();
    return local.menu_items || [...initialMenu];
  },

  getMenuItemById(id) {
    const items = this.getMenuItems();
    return items.find(i => i.id === id) || null;
  }
};

module.exports = db;
