const http = require('http');

const PORT = 5000;

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Backend Verification Tests ---');

  // 1. Health check
  const health = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET'
  });
  console.log('1. Health Check:', health.status === 200 && health.body.success ? 'PASSED' : 'FAILED', health.body);

  // 2. Customer Signup
  const testEmail = 'testcustomer_' + Date.now() + '@darbar.test';
  const signupRes = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: 'Nawaz Khan',
      email: testEmail,
      phone: '+61 412 345 678',
      password: 'password123'
    }
  );
  console.log('2. Customer Signup:', signupRes.status === 201 && signupRes.body.success ? 'PASSED' : 'FAILED');
  const customerToken = signupRes.body?.data?.token;

  // 3. Duplicate Signup prevention
  const dupSignup = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: 'Nawaz Khan',
      email: testEmail,
      phone: '+61 412 345 678',
      password: 'password123'
    }
  );
  console.log('3. Duplicate Email Rejected (400):', dupSignup.status === 400 ? 'PASSED' : 'FAILED', dupSignup.body.message);

  // 4. Customer Login
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      email: testEmail,
      password: 'password123'
    }
  );
  console.log('4. Customer Login:', loginRes.status === 200 && loginRes.body.success ? 'PASSED' : 'FAILED');

  // 5. Invalid Customer Login
  const badLogin = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      email: testEmail,
      password: 'wrong_password'
    }
  );
  console.log('5. Invalid Password Rejected (401):', badLogin.status === 401 ? 'PASSED' : 'FAILED');

  // 6. Customer Profile (/api/auth/me)
  const profileRes = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  console.log('6. Customer /api/auth/me:', profileRes.status === 200 && profileRes.body.data.user.email === testEmail ? 'PASSED' : 'FAILED');

  // 7. Customer creates an order
  const orderRes = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    },
    {
      customerName: 'Nawaz Khan',
      email: testEmail,
      phone: '+61 412 345 678',
      address: '77 Royal Crescent, Dandenong VIC',
      items: [{ id: 'dum-biryani', name: 'Dum Biryani', price: 22, quantity: 2 }],
      totalAmount: 44
    }
  );
  console.log('7. Customer Order Creation:', orderRes.status === 201 && orderRes.body.success ? 'PASSED' : 'FAILED');

  // 8. Customer creates a reservation
  const resvRes = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/reservations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    },
    {
      name: 'Nawaz Khan',
      email: testEmail,
      phone: '+61 412 345 678',
      guests: 2,
      date: '2026-10-15',
      time: '20:00',
      message: 'Quiet table please'
    }
  );
  console.log('8. Customer Reservation Creation:', resvRes.status === 201 && resvRes.body.success ? 'PASSED' : 'FAILED');

  // 9. Customer views own orders & reservations (/api/my/orders, /api/my/reservations)
  const myOrders = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/my/orders',
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const myResvs = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/my/reservations',
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  console.log('9. Customer /api/my/orders:', myOrders.status === 200 && myOrders.body.count >= 1 ? 'PASSED' : 'FAILED');
  console.log('10. Customer /api/my/reservations:', myResvs.status === 200 && myResvs.body.count >= 1 ? 'PASSED' : 'FAILED');

  // 11. Admin Login
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    {
      email: 'admin@hyderabaddarbar.com',
      password: 'change_this_password'
    }
  );
  console.log('11. Admin Login:', adminLogin.status === 200 && adminLogin.body.data.user.role === 'admin' ? 'PASSED' : 'FAILED');
  const adminToken = adminLogin.body?.data?.token;

  // 12. Customer attempting to access Admin API (must get 403)
  const customerTryingAdmin = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/admin/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  console.log('12. Customer Blocked From Admin (403):', customerTryingAdmin.status === 403 ? 'PASSED' : 'FAILED');

  // 13. Admin Profile (/api/admin/me) & Stats
  const adminMe = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/admin/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminStats = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('13. Admin Profile & Stats:', adminMe.status === 200 && adminStats.status === 200 ? 'PASSED' : 'FAILED');

  // 14. Admin viewing all orders
  const allOrders = await request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/orders',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('14. Admin Get All Orders:', allOrders.status === 200 ? 'PASSED' : 'FAILED', `Count: ${allOrders.body.count}`);

  // 15. Admin Menu Management (Create, Update, Delete)
  const createMenu = await request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/menu',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      }
    },
    {
      name: 'Nawabi Kebab Platter',
      category: 'Starters',
      price: 28.50,
      description: 'Assortment of seekh kebabs, boti kebabs and chicken tikka.',
      badge: "Chef's Special",
      spicy: true,
      vegetarian: false
    }
  );
  const createdItemId = createMenu.body?.data?.id;
  console.log('15. Admin Create Menu Item:', createMenu.status === 201 && createdItemId ? 'PASSED' : 'FAILED');

  const deleteMenu = await request({
    hostname: 'localhost',
    port: PORT,
    path: `/api/menu/${createdItemId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('16. Admin Delete Menu Item:', deleteMenu.status === 200 ? 'PASSED' : 'FAILED');

  console.log('--- All Backend Tests Complete ---');
}

// Start temporary backend server in-process to test
const app = require('./src/server');
const server = app.listen(PORT, async () => {
  try {
    await runTests();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
