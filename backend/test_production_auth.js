// ==========================================================
// Comprehensive Production Authentication & Database Test Suite
// ==========================================================

const tests = async () => {
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
  console.log(' Running Production Authentication & DB Test Suite');
  console.log('====================================================\n');

  // 1. Health & Server Check
  await test('1. GET /api/health — Server Status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error(`Unexpected server response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Customer Signup (Validation Failure: password < 8 characters)
  await test('2. POST /api/auth/signup — Rejects password shorter than 8 characters', async () => {
    const payload = {
      name: 'Short Pass User',
      email: `short_${Date.now()}@example.com`,
      phone: '0412345678',
      password: 'short',
      confirmPassword: 'short'
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 Bad Request, got: ${res.status}`);
    }
  });

  // 3. Customer Signup (Validation Failure: mismatched confirm password)
  await test('3. POST /api/auth/signup — Rejects mismatched password confirmation', async () => {
    const payload = {
      name: 'Mismatch User',
      email: `mismatch_${Date.now()}@example.com`,
      phone: '0412345678',
      password: 'password12345',
      confirmPassword: 'differentpassword'
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 Bad Request, got: ${res.status}`);
    }
  });

  // 4. Customer Signup (Valid Registration)
  const testCustomerEmail = `nizam_${Date.now()}@hyderabaddarbar.com`;
  const testPassword = 'RoyalDarbarPassword2026!';
  let customerToken = null;
  let customerId = null;

  await test('4. POST /api/auth/signup — Successful Customer Signup', async () => {
    const payload = {
      name: 'Nizam Ali Khan',
      email: testCustomerEmail,
      phone: '+61 412 345 678',
      password: testPassword,
      confirmPassword: testPassword
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true) {
      throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    }
    if (!data.data?.token || !data.data?.user?.id) {
      throw new Error(`Missing token or user object: ${JSON.stringify(data)}`);
    }
    // Verify password_hash is NEVER returned
    if (data.data.user.password_hash || data.data.user.password) {
      throw new Error('Security violation: password or password_hash was exposed in signup response');
    }
    if (data.data.user.role !== 'customer') {
      throw new Error(`Expected role 'customer', got '${data.data.user.role}'`);
    }
    customerToken = data.data.token;
    customerId = data.data.user.id;
  });

  // 5. Customer Signup (Duplicate Email -> 409 Conflict)
  await test('5. POST /api/auth/signup — Duplicate Email Returns 409 Conflict', async () => {
    const payload = {
      name: 'Duplicate Nizam',
      email: testCustomerEmail,
      phone: '+61 412 345 678',
      password: testPassword,
      confirmPassword: testPassword
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 409 || data.success !== false) {
      throw new Error(`Expected 409 Conflict, got status ${res.status}: ${JSON.stringify(data)}`);
    }
  });

  // 6. Customer Login (Valid Credentials)
  await test('6. POST /api/auth/login — Valid Customer Login', async () => {
    const payload = {
      email: testCustomerEmail,
      password: testPassword
    };
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
    if (!data.token || data.user.email !== testCustomerEmail.toLowerCase()) {
      throw new Error(`Invalid login payload: ${JSON.stringify(data)}`);
    }
    // Verify password_hash is NEVER exposed
    if (data.user.password_hash || data.user.password) {
      throw new Error('Security violation: password or password_hash was exposed in login response');
    }
    customerToken = data.token;
  });

  // 7. Customer Login (Invalid Password -> 401 Unauthorized)
  await test('7. POST /api/auth/login — Invalid Password Returns 401 Unauthorized', async () => {
    const payload = {
      email: testCustomerEmail,
      password: 'WrongPassword123!'
    };
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 Unauthorized, got: ${res.status}`);
    }
  });

  // 8. Get Authenticated User Profile
  await test('8. GET /api/auth/me — Retrieves Authenticated Profile', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data.user.id !== customerId) {
      throw new Error(`Failed to retrieve profile: ${JSON.stringify(data)}`);
    }
    if (data.data.user.password_hash || data.data.user.password) {
      throw new Error('Security violation: password_hash exposed in /api/auth/me');
    }
  });

  // 9. Customer Creates Order (Stores req.user.id)
  let createdOrderId = null;
  await test('9. POST /api/orders — Customer Places Order With Real User Association', async () => {
    const payload = {
      customerName: 'Nizam Ali Khan',
      phone: '+61 412 345 678',
      email: testCustomerEmail,
      address: '14 Walker St, Dandenong VIC 3175',
      items: [
        { id: 'biryani-1', name: 'Hyderabadi Chicken Dum Biryani', price: 21.90, quantity: 2 },
        { id: 'curry-1', name: 'Mirchi Ka Salan', price: 14.90, quantity: 1 }
      ],
      totalAmount: 58.70
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
    if (data.data.userId !== customerId && data.data.user_id !== customerId) {
      throw new Error(`Order was not associated with customerId ${customerId}: ${JSON.stringify(data)}`);
    }
    createdOrderId = data.data.id;
  });

  // 10. Customer Retrieves Personal Orders
  await test('10. GET /api/my/orders — Customer Retrieves Only Their Own Orders', async () => {
    const res = await fetch(`${baseUrl}/api/my/orders`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer orders: ${JSON.stringify(data)}`);
    }
    const hasOrder = data.data.some(o => (o.id === createdOrderId || o.userId === customerId || o.user_id === customerId));
    if (!hasOrder) {
      throw new Error(`Created order ${createdOrderId} was not returned in customer's orders list`);
    }
  });

  // 11. Customer Creates Reservation (Stores req.user.id)
  let createdResvId = null;
  await test('11. POST /api/reservations — Customer Books Table With Real User Association', async () => {
    const payload = {
      name: 'Nizam Ali Khan',
      phone: '+61 412 345 678',
      email: testCustomerEmail,
      guests: 4,
      date: '2026-09-25',
      time: '19:30',
      message: 'Royal family celebration'
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
    if (data.data.userId !== customerId && data.data.user_id !== customerId) {
      throw new Error(`Reservation was not associated with customerId ${customerId}: ${JSON.stringify(data)}`);
    }
    createdResvId = data.data.id;
  });

  // 12. Customer Retrieves Personal Reservations
  await test('12. GET /api/my/reservations — Customer Retrieves Only Their Own Reservations', async () => {
    const res = await fetch(`${baseUrl}/api/my/reservations`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer reservations: ${JSON.stringify(data)}`);
    }
    const hasResv = data.data.some(r => (r.id === createdResvId || r.userId === customerId || r.user_id === customerId));
    if (!hasResv) {
      throw new Error(`Created reservation ${createdResvId} was not returned in customer's reservations list`);
    }
  });

  // 13. Customer Posts Review (Requires Authentication)
  await test('13. POST /api/reviews — Authenticated Customer Submits Review', async () => {
    const payload = {
      rating: 5,
      comment: 'Exceptional Hyderabadi Biryani experience. Rich aromatics and authentic heritage hospitality!'
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
      throw new Error(`Review creation failed: ${JSON.stringify(data)}`);
    }
  });

  // 14. Unauthenticated Review Post Rejection
  await test('14. POST /api/reviews — Unauthenticated Review Post Returns 401', async () => {
    const payload = {
      rating: 5,
      comment: 'Anonymous Review'
    };
    const res = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 Unauthorized for review without token, got: ${res.status}`);
    }
  });

  // 15. Customer Blocked from Admin APIs (403 Forbidden)
  await test('15. GET /api/admin/orders — Customer Blocked with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403 Forbidden when customer accesses admin endpoint, got: ${res.status}`);
    }
  });

  // 16. Admin Login with Real DB Admin Record
  let adminToken = null;
  await test('16. POST /api/admin/login — Admin Authenticates Against Real Users Table', async () => {
    const payload = {
      email: 'admin@hyderabaddarbar.com',
      password: 'change_this_password'
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true) {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    if (!data.token || data.user.role !== 'admin') {
      throw new Error(`Expected admin user object: ${JSON.stringify(data)}`);
    }
    if (data.user.password_hash || data.user.password) {
      throw new Error('Security violation: admin password_hash was exposed in login response');
    }
    adminToken = data.token;
  });

  await test('16b. POST /api/admin/login — Admin Invalid Password Returns 401', async () => {
    const payload = {
      email: 'admin@hyderabaddarbar.com',
      password: 'WrongAdminPassword!'
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 Unauthorized for admin invalid password, got: ${res.status}`);
    }
  });

  // 17. Admin Retrieves Full System Orders
  await test('17. GET /api/admin/orders — Admin Retrieves All Restaurant Orders', async () => {
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

  // 18. Admin Retrieves Full System Reservations
  await test('18. GET /api/admin/reservations — Admin Retrieves All Table Bookings', async () => {
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

  // 19. Admin Retrieves Customer Registry
  await test('19. GET /api/admin/users — Admin Retrieves Customer Registry', async () => {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list users for admin: ${JSON.stringify(data)}`);
    }
    // Verify none of the returned user records have password_hash
    const leakedHash = data.data.some(u => u.password_hash || u.password);
    if (leakedHash) {
      throw new Error('Security violation: password_hash was exposed in admin users list');
    }
  });

  // 20. Admin Retrieves Dashboard Overview Stats
  await test('20. GET /api/admin/stats — Admin Retrieves Real Analytics', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !data.data?.totalOrders) {
      throw new Error(`Failed to retrieve stats: ${JSON.stringify(data)}`);
    }
  });

  console.log('\n====================================================');
  console.log(` Summary: ${passed} passed, ${failed} failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
};

tests();
