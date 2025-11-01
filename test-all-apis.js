const http = require('http');

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAllAPIs() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        STONEY CREEK RESORT - FULL API TEST SUITE          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let token = null;
  let passed = 0;
  let failed = 0;

  // Helper function to test endpoint
  async function test(name, method, path, data = null, requireAuth = false) {
    try {
      const res = await makeRequest(method, path, data, requireAuth ? token : null);
      if (res.status >= 200 && res.status < 300) {
        const count = Array.isArray(res.data) ? ` (${res.data.length} items)` : '';
        console.log(`✅ ${name}${count}`);
        passed++;
        return res;
      } else {
        console.log(`❌ ${name} - Status: ${res.status}`);
        failed++;
        return null;
      }
    } catch (err) {
      console.log(`❌ ${name} - Error: ${err.message}`);
      failed++;
      return null;
    }
  }

  // 1. AUTHENTICATION
  console.log('\n📝 AUTHENTICATION ENDPOINTS\n');
  const loginRes = await test('POST /api/auth/login', 'POST', '/api/auth/login', {
    email: 'admin@hotelogix.com',
    password: 'admin123'
  });
  
  if (loginRes && loginRes.data.token) {
    token = loginRes.data.token;
    console.log('   🔑 Token obtained for authenticated requests');
  }

  // 2. ROOMS
  console.log('\n🛏️  ROOMS ENDPOINTS\n');
  await test('GET /api/rooms', 'GET', '/api/rooms');
  await test('GET /api/rooms?featured=true', 'GET', '/api/rooms?featured=true');
  await test('GET /api/rooms/87', 'GET', '/api/rooms/87');
  await test('GET /api/rooms/87/availability', 'GET', '/api/rooms/87/availability?checkIn=2025-12-01&checkOut=2025-12-05');

  // 3. RESTAURANTS
  console.log('\n🍽️  RESTAURANTS ENDPOINTS\n');
  await test('GET /api/restaurants', 'GET', '/api/restaurants');
  await test('GET /api/restaurants?featured=true', 'GET', '/api/restaurants?featured=true');
  await test('GET /api/restaurants/6', 'GET', '/api/restaurants/6');
  await test('GET /api/restaurants/reservations/my-reservations', 'GET', '/api/restaurants/reservations/my-reservations', null, true);

  // 4. DEALS
  console.log('\n🎁 DEALS ENDPOINTS\n');
  await test('GET /api/deals', 'GET', '/api/deals');
  await test('GET /api/deals?featured=true', 'GET', '/api/deals?featured=true');
  await test('GET /api/deals/7', 'GET', '/api/deals/7');
  await test('GET /api/deals/redemptions/my-deals', 'GET', '/api/deals/redemptions/my-deals', null, true);

  // 5. PACKAGES
  console.log('\n📦 PACKAGES ENDPOINTS\n');
  await test('GET /api/packages', 'GET', '/api/packages');
  await test('GET /api/packages?featured=true', 'GET', '/api/packages?featured=true');
  await test('GET /api/packages/5', 'GET', '/api/packages/5');
  await test('GET /api/packages/bookings/my-packages', 'GET', '/api/packages/bookings/my-packages', null, true);

  // 6. BOOKINGS
  console.log('\n📋 BOOKINGS ENDPOINTS\n');
  await test('GET /api/bookings/my-bookings', 'GET', '/api/bookings/my-bookings', null, true);

  // 7. ATTRACTIONS
  console.log('\n🎡 ATTRACTIONS ENDPOINTS\n');
  await test('GET /api/attractions', 'GET', '/api/attractions');

  // 8. RECOMMENDATIONS (AI)
  console.log('\n🤖 AI RECOMMENDATIONS ENDPOINTS\n');
  await test('GET /api/recommendations/rooms', 'GET', '/api/recommendations/rooms?userType=family&season=summer');
  await test('GET /api/recommendations/pricing/87', 'GET', '/api/recommendations/pricing/87?checkIn=2025-12-01&checkOut=2025-12-05');
  await test('GET /api/recommendations/stats', 'GET', '/api/recommendations/stats', null, true);

  // 9. ADMIN ENDPOINTS
  console.log('\n👑 ADMIN ENDPOINTS\n');
  await test('GET /api/admin/dashboard', 'GET', '/api/admin/dashboard', null, true);
  await test('GET /api/admin/bookings', 'GET', '/api/admin/bookings', null, true);
  await test('GET /api/admin/users', 'GET', '/api/admin/users', null, true);
  await test('GET /api/admin/reservations', 'GET', '/api/admin/reservations', null, true);
  await test('GET /api/admin/redemptions', 'GET', '/api/admin/redemptions', null, true);
  await test('GET /api/admin/package-bookings', 'GET', '/api/admin/package-bookings', null, true);
  await test('GET /api/admin/analytics/revenue', 'GET', '/api/admin/analytics/revenue?period=30', null, true);

  // SUMMARY
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                      TEST SUMMARY                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! System is fully operational.\n');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.\n');
  }
}

testAllAPIs();
