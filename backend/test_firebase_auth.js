process.env.NODE_ENV = 'test';
const jwt = require('jsonwebtoken');
const config = require('./src/config');
const app = require('./src/server');
const http = require('http');

const tests = async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5000, resolve));
  const baseUrl = 'http://localhost:5000';
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  };

  console.log('====================================================');
  console.log(' Running Firebase Authentication & DB Test Suite');
  console.log('====================================================\n');

  // 1. Health & Server Status
  await test('1. GET /api/health — Server Status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error(`Unexpected server response: ${JSON.stringify(data)}`);
    }
  });

  // 1b. Robust formatPrivateKey Normalization Tests
  const { formatPrivateKey } = require('./src/config/firebase');

  await test('1b. formatPrivateKey handles literal \\n, quotes, and multiline PEM', () => {
    const rawWithQuotes = '"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgk...\\n-----END PRIVATE KEY-----\\n"';
    const formatted = formatPrivateKey(rawWithQuotes);
    if (!formatted.startsWith('-----BEGIN PRIVATE KEY-----') || !formatted.endsWith('-----END PRIVATE KEY-----')) {
      throw new Error('Failed to retain PEM header/footer');
    }
    if (formatted.includes('\\n')) {
      throw new Error('Failed to unescape literal \\n');
    }
    if (formatted.startsWith('"') || formatted.endsWith('"')) {
      throw new Error('Failed to strip surrounding double quotes');
    }

    const singleQuoted = "'-----BEGIN PRIVATE KEY-----\\nABC...\\n-----END PRIVATE KEY-----\\n'";
    const singleFormatted = formatPrivateKey(singleQuoted);
    if (singleFormatted.startsWith("'") || singleFormatted.endsWith("'") || singleFormatted.includes('\\n')) {
      throw new Error('Failed to handle single-quoted private key');
    }

    const multilineReal = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----";
    const multilineFormatted = formatPrivateKey(multilineReal);
    if (multilineFormatted !== multilineReal) {
      throw new Error('Failed to preserve real multiline PEM');
    }
  });

  // 2. Mock / Real Firebase ID Token Generation for testing
  const customerFirebaseUid = `firebase_user_${Date.now()}`;
  const customerEmail = `customer_${Date.now()}@hyderabaddarbar.com`;
  const customerName = 'Nizam Ali Khan';
  const customerPhone = '+61 412 345 678';

  const customerToken = jwt.sign(
    {
      uid: customerFirebaseUid,
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
      role: 'customer'
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const adminFirebaseUid = `firebase_admin_${Date.now()}`;
  const adminEmail = (config.admin.email || 'yuvrajsinghtomar0987@gmail.com').toLowerCase();
  const adminToken = jwt.sign(
    {
      uid: adminFirebaseUid,
      email: adminEmail,
      name: 'Darbar Administrator',
      role: 'admin'
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  // 3. Sync Customer Profile using Firebase Token
  let customerDbId = null;
  await test('2. POST /api/auth/sync-profile — Synchronizes Firebase Customer Profile', async () => {
    const payload = {
      name: customerName,
      phone: customerPhone
    };
    const res = await fetch(`${baseUrl}/api/auth/sync-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !data.data?.user?.id) {
      throw new Error(`Profile sync failed: ${JSON.stringify(data)}`);
    }
    if (data.data.user.role !== 'customer' || data.data.user.email !== customerEmail) {
      throw new Error(`Invalid synced profile data: ${JSON.stringify(data)}`);
    }
    customerDbId = data.data.user.id;
  });

  // 4. Retrieve Current Authenticated Profile
  await test('3. GET /api/auth/me — Retrieves Authenticated Profile via Token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data.user.uid !== customerFirebaseUid) {
      throw new Error(`Profile retrieval failed: ${JSON.stringify(data)}`);
    }
  });

  // 5. Unauthenticated Request Rejection
  await test('4. GET /api/auth/me — Rejects Unauthenticated Request with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 Unauthorized, got: ${res.status}`);
    }
  });

  // 6. Invalid Token Rejection
  await test('5. GET /api/auth/me — Rejects Invalid Token with 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        'Authorization': 'Bearer invalid_malformed_token_12345'
      }
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 Unauthorized, got: ${res.status}`);
    }
  });

  // 7. Customer Places Order with Firebase UID Association
  let createdOrderId = null;
  await test('6. POST /api/orders — Customer Places Order with Firebase UID Link', async () => {
    const payload = {
      customerName: customerName,
      phone: customerPhone,
      email: customerEmail,
      address: '14 Walker St, Dandenong VIC 3175',
      items: [
        { id: 'biryani-1', name: 'Hyderabadi Chicken Dum Biryani', price: 21.90, quantity: 2 }
      ],
      totalAmount: 43.80
    };
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true || !data.data?.id) {
      throw new Error(`Order placement failed: ${JSON.stringify(data)}`);
    }
    createdOrderId = data.data.id;
  });

  // 8. Customer Retrieves Personal Orders
  await test('7. GET /api/my/orders — Customer Retrieves Personal Orders', async () => {
    const res = await fetch(`${baseUrl}/api/my/orders`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer orders: ${JSON.stringify(data)}`);
    }
    const found = data.data.some(o => o.id === createdOrderId || o.userId === customerDbId || o.firebase_uid === customerFirebaseUid);
    if (!found) {
      throw new Error(`Customer order ${createdOrderId} was not returned in customer orders list`);
    }
  });

  // 9. Customer Table Reservation with Firebase UID Link
  let createdResvId = null;
  await test('8. POST /api/reservations — Customer Places Table Reservation with Firebase Link', async () => {
    const payload = {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      guests: 4,
      date: '2026-09-25',
      time: '19:30',
      message: 'Window seating preferred'
    };
    const res = await fetch(`${baseUrl}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true || !data.data?.id) {
      throw new Error(`Reservation failed: ${JSON.stringify(data)}`);
    }
    createdResvId = data.data.id;
  });

  // 10. Customer Retrieves Personal Reservations
  await test('9. GET /api/my/reservations — Customer Retrieves Personal Reservations', async () => {
    const res = await fetch(`${baseUrl}/api/my/reservations`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer reservations: ${JSON.stringify(data)}`);
    }
    const found = data.data.some(r => r.id === createdResvId || r.userId === customerDbId || r.firebase_uid === customerFirebaseUid);
    if (!found) {
      throw new Error(`Customer reservation ${createdResvId} was not returned in customer reservations list`);
    }
  });

  // 11. Customer Submits Review with Firebase Token
  await test('10. POST /api/reviews — Customer Submits Review with Authentication', async () => {
    const payload = {
      rating: 5,
      comment: 'Authentic Hyderabadi flavours and great royal hospitality!'
    };
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true || !data.data?.id) {
      throw new Error(`Review submission failed: ${JSON.stringify(data)}`);
    }
  });

  // 12. Customer Blocked from Admin APIs (403 Forbidden)
  await test('11. GET /api/admin/orders — Customer Blocked from Admin API with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403 Forbidden for customer accessing admin, got: ${res.status}`);
    }
  });

  // 13. Admin Token Accesses Admin Orders
  await test('12. GET /api/admin/orders — Admin Accesses Full Orders List', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list admin orders: ${JSON.stringify(data)}`);
    }
  });

  // 14. Admin Token Accesses Admin Reservations
  await test('13. GET /api/admin/reservations — Admin Accesses Full Reservations List', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reservations`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list admin reservations: ${JSON.stringify(data)}`);
    }
  });

  // 15. Admin Token Accesses Dashboard Stats
  await test('14. GET /api/admin/stats — Admin Accesses Analytics Overview', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data?.totalOrders === undefined) {
      throw new Error(`Failed to retrieve stats: ${JSON.stringify(data)}`);
    }
  });

  // 16. Firebase ID Token with { admin: true } Custom Claim explicitly grants access
  const tokenWithAdminClaim = jwt.sign(
    {
      uid: 'claim_admin_uid_999',
      email: 'yuvrajsinghtomar0987@gmail.com',
      name: 'Yuvraj Singh Tomar',
      admin: true
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  await test('15. GET /api/admin/me — Firebase Token with { admin: true } Custom Claim Grants Admin Access', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${tokenWithAdminClaim}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data?.user?.role !== 'admin') {
      throw new Error(`Expected admin user with custom claim, got: ${JSON.stringify(data)}`);
    }
  });

  // 17. Token without { admin: true } Custom Claim is strictly rejected (403 Forbidden)
  const regularUserToken = jwt.sign(
    {
      uid: 'regular_uid_888',
      email: 'regularuser@example.com',
      name: 'Regular Customer',
      admin: false
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  await test('16. GET /api/admin/me — Non-admin Token Rejected with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${regularUserToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403 Forbidden for non-admin token, got: ${res.status}`);
    }
  });

  console.log('\n====================================================');
  console.log(` Summary: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  server.close();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

tests();
