const { PrismaClient } = require('@prisma/client');
const http = require('http');
const prisma = new PrismaClient();

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     STONEY CREEK RESORT - COMPLETE PROJECT TEST           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function pass(test) {
  console.log(`✅ ${test}`);
  passedTests++;
  totalTests++;
}

function fail(test, error) {
  console.log(`❌ ${test} - ${error}`);
  failedTests++;
  totalTests++;
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

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
    req.on('timeout', () => reject(new Error('Request timeout')));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testDatabase() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('1. DATABASE TESTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.room.count(),
      prisma.restaurant.count(),
      prisma.deal.count(),
      prisma.package.count(),
      prisma.attraction.count(),
      prisma.booking.count(),
      prisma.diningReservation.count(),
      prisma.dealRedemption.count(),
      prisma.packageBooking.count()
    ]);

    counts[0] === 3 ? pass('Users: 3 records') : fail('Users count', `Expected 3, got ${counts[0]}`);
    counts[1] === 48 ? pass('Rooms: 48 records') : fail('Rooms count', `Expected 48, got ${counts[1]}`);
    counts[2] === 5 ? pass('Restaurants: 5 records') : fail('Restaurants count', `Expected 5, got ${counts[2]}`);
    counts[3] === 6 ? pass('Deals: 6 records') : fail('Deals count', `Expected 6, got ${counts[3]}`);
    counts[4] === 4 ? pass('Packages: 4 records') : fail('Packages count', `Expected 4, got ${counts[4]}`);
    counts[5] === 5 ? pass('Attractions: 5 records') : fail('Attractions count', `Expected 5, got ${counts[5]}`);
    counts[6] === 7 ? pass('Room Bookings: 7 records') : fail('Bookings count', `Expected 7, got ${counts[6]}`);
    counts[7] === 5 ? pass('Dining Reservations: 5 records') : fail('Reservations count', `Expected 5, got ${counts[7]}`);
    counts[8] === 8 ? pass('Deal Redemptions: 8 records') : fail('Redemptions count', `Expected 8, got ${counts[8]}`);
    counts[9] === 4 ? pass('Package Bookings: 4 records') : fail('Package Bookings count', `Expected 4, got ${counts[9]}`);

    const totalBookings = counts[6] + counts[7] + counts[8] + counts[9];
    totalBookings === 24 ? pass(`Total Bookings: ${totalBookings}`) : fail('Total bookings', `Expected 24, got ${totalBookings}`);

  } catch (error) {
    fail('Database connection', error.message);
  }
}

async function testAPIs() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('2. API ENDPOINT TESTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  let token = null;

  try {
    // Test authentication
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@hotelogix.com',
      password: 'admin123'
    });
    
    if (loginRes.status === 200 && loginRes.data.token) {
      pass('Authentication: Login successful');
      token = loginRes.data.token;
    } else {
      fail('Authentication', 'Login failed');
    }

    // Test public endpoints
    const endpoints = [
      { path: '/api/rooms', name: 'Rooms listing', expectedCount: 48 },
      { path: '/api/restaurants', name: 'Restaurants listing', expectedCount: 5 },
      { path: '/api/deals', name: 'Deals listing', expectedCount: 6 },
      { path: '/api/packages', name: 'Packages listing', expectedCount: 4 },
      { path: '/api/attractions', name: 'Attractions listing', expectedCount: 5 }
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await makeRequest('GET', endpoint.path);
        if (res.status === 200 && Array.isArray(res.data) && res.data.length === endpoint.expectedCount) {
          pass(`${endpoint.name}: ${res.data.length} items`);
        } else {
          fail(endpoint.name, `Expected ${endpoint.expectedCount} items, got ${res.data?.length || 0}`);
        }
      } catch (error) {
        fail(endpoint.name, error.message);
      }
    }

    // Test admin endpoints
    if (token) {
      const adminEndpoints = [
        { path: '/api/admin/bookings', name: 'Admin: Room bookings', expectedCount: 7 },
        { path: '/api/admin/users', name: 'Admin: Users', expectedCount: 3 },
        { path: '/api/admin/reservations', name: 'Admin: Dining reservations', expectedCount: 5 },
        { path: '/api/admin/redemptions', name: 'Admin: Deal redemptions', expectedCount: 8 },
        { path: '/api/admin/package-bookings', name: 'Admin: Package bookings', expectedCount: 4 }
      ];

      for (const endpoint of adminEndpoints) {
        try {
          const res = await makeRequest('GET', endpoint.path, null, token);
          if (res.status === 200 && Array.isArray(res.data) && res.data.length === endpoint.expectedCount) {
            pass(`${endpoint.name}: ${res.data.length} items`);
          } else {
            fail(endpoint.name, `Expected ${endpoint.expectedCount} items, got ${res.data?.length || 0}`);
          }
        } catch (error) {
          fail(endpoint.name, error.message);
        }
      }
    }

  } catch (error) {
    fail('API Tests', error.message);
  }
}

async function testServices() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('3. SERVICE AVAILABILITY TESTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Test Backend
  try {
    const res = await makeRequest('GET', '/api/health');
    res.status === 200 ? pass('Backend API: Running on port 5000') : fail('Backend API', `Status ${res.status}`);
  } catch (error) {
    fail('Backend API', error.message);
  }

  // Test Frontend (just check if port is accessible)
  try {
    const frontendReq = http.request({ hostname: 'localhost', port: 3000, path: '/', method: 'GET', timeout: 3000 }, (res) => {
      res.statusCode === 200 ? pass('Frontend: Running on port 3000') : fail('Frontend', `Status ${res.statusCode}`);
    });
    frontendReq.on('error', () => fail('Frontend', 'Not accessible'));
    frontendReq.on('timeout', () => fail('Frontend', 'Timeout'));
    frontendReq.end();
  } catch (error) {
    fail('Frontend', error.message);
  }

  // Test Prisma Studio
  try {
    const prismaReq = http.request({ hostname: 'localhost', port: 5555, path: '/', method: 'GET', timeout: 3000 }, (res) => {
      res.statusCode === 200 ? pass('Prisma Studio: Running on port 5555') : fail('Prisma Studio', `Status ${res.statusCode}`);
    });
    prismaReq.on('error', () => fail('Prisma Studio', 'Not accessible'));
    prismaReq.on('timeout', () => fail('Prisma Studio', 'Timeout'));
    prismaReq.end();
  } catch (error) {
    fail('Prisma Studio', error.message);
  }
}

async function testDataIntegrity() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('4. DATA INTEGRITY TESTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Test room with images
    const room = await prisma.room.findFirst();
    if (room && room.images) {
      const images = JSON.parse(room.images);
      Array.isArray(images) && images.length > 0 ? pass('Room images: Valid JSON array') : fail('Room images', 'Invalid format');
    } else {
      fail('Room images', 'No room found');
    }

    // Test restaurant with menu
    const restaurant = await prisma.restaurant.findFirst();
    if (restaurant && restaurant.menu) {
      const menu = JSON.parse(restaurant.menu);
      Array.isArray(menu) ? pass('Restaurant menu: Valid JSON array') : fail('Restaurant menu', 'Invalid format');
    } else {
      fail('Restaurant menu', 'No restaurant found');
    }

    // Test booking with relations
    const booking = await prisma.booking.findFirst({ include: { user: true, room: true } });
    if (booking && booking.user && booking.room) {
      pass('Booking relations: User and Room linked correctly');
    } else {
      fail('Booking relations', 'Missing user or room relation');
    }

    // Test reservation with relations
    const reservation = await prisma.diningReservation.findFirst({ include: { user: true, restaurant: true } });
    if (reservation && reservation.user && reservation.restaurant) {
      pass('Reservation relations: User and Restaurant linked correctly');
    } else {
      fail('Reservation relations', 'Missing user or restaurant relation');
    }

  } catch (error) {
    fail('Data integrity', error.message);
  }
}

async function runTests() {
  try {
    await testDatabase();
    await testAPIs();
    await testServices();
    await testDataIntegrity();

    // Wait a bit for async service tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                      TEST SUMMARY                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

    if (failedTests === 0) {
      console.log('🎉 ALL TESTS PASSED! System is fully operational.\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('QUICK ACCESS LINKS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 Frontend:        http://localhost:3000');
    console.log('🔧 Admin Dashboard: http://localhost:3000/admin');
    console.log('📡 API Root:        http://localhost:5000/api');
    console.log('🗄️  Prisma Studio:  http://localhost:5555');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
