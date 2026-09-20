// API Test Suite for Hyderabad Darbar Backend
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

  console.log('----------------------------------------');
  console.log('Running Hyderabad Darbar API Test Suite');
  console.log('----------------------------------------\n');

  // 1. Health API
  await test('GET /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Menu API (All)
  await test('GET /api/menu', async () => {
    const res = await fetch(`${baseUrl}/api/menu`);
    const data = await res.json();
    if (!res.ok || data.success !== true || !Array.isArray(data.data.items) || data.data.items.length === 0) {
      throw new Error(`Invalid menu response: ${JSON.stringify(data)}`);
    }
    if (!data.categories.includes('Biryani') || !data.data.grouped['Biryani']) {
      throw new Error('Categories or grouped menu missing');
    }
  });

  // 3. Single Menu Item
  await test('GET /api/menu/:id (Valid)', async () => {
    const res = await fetch(`${baseUrl}/api/menu/biryani-1`);
    const data = await res.json();
    if (!res.ok || data.success !== true || !data.data.name) {
      throw new Error(`Invalid single item response: ${JSON.stringify(data)}`);
    }
  });

  await test('GET /api/menu/:id (Not Found)', async () => {
    const res = await fetch(`${baseUrl}/api/menu/non-existent-id`);
    const data = await res.json();
    if (res.status !== 404 || data.success !== false) {
      throw new Error(`Expected 404, got: ${res.status}`);
    }
  });

  // 4. Customer Authentication API
  const testCustomerEmail = `customer_${Date.now()}@example.com`;
  let customerToken = null;

  await test('POST /api/auth/signup (Valid)', async () => {
    const payload = {
      name: 'Nizam Ali Khan',
      email: testCustomerEmail,
      phone: '0412345678',
      password: 'password123'
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true || !data.data?.token || data.data.user.role !== 'customer') {
      throw new Error(`Customer signup failed: ${JSON.stringify(data)}`);
    }
    customerToken = data.data.token;
  });

  await test('POST /api/auth/signup (Duplicate Email)', async () => {
    const payload = {
      name: 'Nizam Ali Khan',
      email: testCustomerEmail,
      phone: '0412345678',
      password: 'password123',
      confirmPassword: 'password123'
    };
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 409 || data.success !== false) {
      throw new Error(`Expected 409 duplicate error, got: ${res.status}`);
    }
  });

  await test('POST /api/auth/login (Valid Credentials)', async () => {
    const payload = {
      email: testCustomerEmail,
      password: 'password123'
    };
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !data.data?.token || data.data.user.email !== testCustomerEmail) {
      throw new Error(`Customer login failed: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /api/auth/login (Invalid Password)', async () => {
    const payload = {
      email: testCustomerEmail,
      password: 'wrongpassword'
    };
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401 invalid credentials, got: ${res.status}`);
    }
  });

  await test('GET /api/auth/me (Authenticated Customer)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data.user.email !== testCustomerEmail) {
      throw new Error(`Failed to fetch authenticated customer profile: ${JSON.stringify(data)}`);
    }
  });

  // 5. Online Order API
  await test('POST /api/orders (Valid)', async () => {
    const payload = {
      customerName: 'Amina Syed',
      phone: '+61 412 345 678',
      email: testCustomerEmail,
      address: '14 Walker St, Dandenong VIC 3175',
      items: [
        { id: 'biryani-1', name: 'Hyderabadi Dum Biryani (Chicken)', price: 16.99, quantity: 2 }
      ],
      totalAmount: 33.98
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
    if (res.status !== 201 || data.success !== true || !data.data.orderId) {
      throw new Error(`Order creation failed: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /api/orders (Validation Error)', async () => {
    const payload = { customerName: 'Incomplete Order' };
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 error, got: ${res.status}`);
    }
  });

  await test('GET /api/my/orders (Authenticated Customer)', async () => {
    const res = await fetch(`${baseUrl}/api/my/orders`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (!res.ok || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer orders: ${JSON.stringify(data)}`);
    }
  });

  // 6. Table Reservation API
  await test('POST /api/reservations (Valid)', async () => {
    const payload = {
      name: 'Dr. Vikram Rao',
      phone: '+61 412 345 678',
      guests: 4,
      date: '2026-09-20',
      time: '19:30',
      message: 'Window seat preferred for anniversary dinner'
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
    if (res.status !== 201 || data.success !== true || !data.data.reservationId) {
      throw new Error(`Reservation failed: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /api/reservations (Validation Error)', async () => {
    const payload = { name: 'Invalid' };
    const res = await fetch(`${baseUrl}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 error, got: ${res.status}`);
    }
  });

  await test('GET /api/my/reservations (Authenticated Customer)', async () => {
    const res = await fetch(`${baseUrl}/api/my/reservations`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (!res.ok || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to list customer reservations: ${JSON.stringify(data)}`);
    }
  });

  // 7. Customer Reviews API
  await test('GET /api/reviews (Public)', async () => {
    const res = await fetch(`${baseUrl}/api/reviews`);
    const data = await res.json();
    if (!res.ok || data.success !== true || !Array.isArray(data.data)) {
      throw new Error(`Failed to get reviews: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /api/reviews (Authenticated)', async () => {
    const payload = {
      rating: 5,
      comment: 'Authentic Hyderabadi flavor! The Mutton Dum Biryani was phenomenal.'
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
    if (res.status !== 201 || data.success !== true || !data.data.id) {
      throw new Error(`Review creation failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Contact Form API
  await test('POST /api/contact (Valid)', async () => {
    const payload = {
      name: 'Karan Sharma',
      email: 'karan.sharma@example.com',
      phone: '+61 499 887 766',
      subject: 'Catering Inquiry for 100 people',
      message: 'We would like to book catering for our family wedding reception.'
    };
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 201 || data.success !== true || !data.data.id) {
      throw new Error(`Contact submission failed: ${JSON.stringify(data)}`);
    }
  });

  await test('POST /api/contact (Invalid Email Validation)', async () => {
    const payload = {
      name: 'Karan Sharma',
      email: 'invalid-email-address',
      phone: '+61 499 887 766',
      subject: 'Inquiry',
      message: 'Hello'
    };
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 invalid email, got: ${res.status}`);
    }
  });

  // 9. Admin Authentication API
  let adminToken = null;
  await test('POST /api/admin/login (Valid Credentials)', async () => {
    const payload = {
      email: 'yuvrajsinghtomar0987@gmail.com',
      password: 'change_this_password'
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || !data.data?.token || data.data.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.data.token;
  });

  await test('POST /api/admin/login (Invalid Credentials)', async () => {
    const payload = {
      email: 'yuvrajsinghtomar0987@gmail.com',
      password: 'wrongpassword'
    };
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401, got: ${res.status}`);
    }
  });

  await test('GET /api/admin/me (Authenticated Admin)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.success !== true || data.data.user.role !== 'admin') {
      throw new Error(`Admin profile fetch failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. Admin Protection: Customer token cannot access admin endpoint
  await test('GET /api/admin/me with Customer Token (Forbidden/Denied)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${customerToken}`
      }
    });
    const data = await res.json();
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403 forbidden for customer accessing admin, got: ${res.status}`);
    }
  });

  // 11. 404 Route Handler
  await test('GET /api/nonexistent-route (404 Not Found)', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    const data = await res.json();
    if (res.status !== 404 || data.success !== false) {
      throw new Error(`Expected 404, got: ${res.status}`);
    }
  });

  console.log('\n----------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('----------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
};

tests();
