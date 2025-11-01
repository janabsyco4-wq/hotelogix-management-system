const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test credentials
const TEST_USER = {
  email: 'admin@stoneycreek.com',
  password: 'admin123'
};

let authToken = '';

async function testEndpoint(name, method, url, data = null, requiresAuth = false) {
  try {
    const config = {
      method,
      url: `${API_BASE}${url}`,
      headers: {}
    };

    if (requiresAuth && authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(config);
    console.log(`✅ ${name}: ${response.status} - ${response.data.length || 'OK'}`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${name}: ${error.response?.status || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing API Endpoints\n');
  console.log('=' .repeat(60));

  // Test 1: Login
  console.log('\n🔐 Authentication Tests:');
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, TEST_USER);
    authToken = loginResponse.data.token;
    console.log(`✅ Login: Success - Token received`);
  } catch (error) {
    console.log(`❌ Login: Failed - ${error.message}`);
    return;
  }

  // Test 2: Restaurant Endpoints
  console.log('\n🍽️  Restaurant Endpoints:');
  const restaurants = await testEndpoint('GET /restaurants', 'GET', '/restaurants');
  if (restaurants && restaurants.length > 0) {
    await testEndpoint('GET /restaurants/:id', 'GET', `/restaurants/${restaurants[0].id}`);
  }
  
  // Test reservation creation
  const reservationData = {
    restaurantId: 1,
    date: '2025-11-15',
    time: '19:00',
    guests: 2,
    specialRequests: 'Window seat please'
  };
  await testEndpoint('POST /reservations', 'POST', '/restaurants/reservations', reservationData, true);
  await testEndpoint('GET /my-reservations', 'GET', '/restaurants/reservations/my-reservations', null, true);

  // Test 3: Deal Endpoints
  console.log('\n🎁 Deal Endpoints:');
  const deals = await testEndpoint('GET /deals', 'GET', '/deals');
  if (deals && deals.length > 0) {
    await testEndpoint('GET /deals/:id', 'GET', `/deals/${deals[0].id}`);
    // Test deal redemption
    await testEndpoint('POST /deals/:id/redeem', 'POST', `/deals/${deals[0].id}/redeem`, null, true);
  }
  await testEndpoint('GET /my-deals', 'GET', '/deals/redemptions/my-deals', null, true);

  // Test 4: Package Endpoints
  console.log('\n📦 Package Endpoints:');
  const packages = await testEndpoint('GET /packages', 'GET', '/packages');
  if (packages && packages.length > 0) {
    await testEndpoint('GET /packages/:id', 'GET', `/packages/${packages[0].id}`);
    // Test package booking
    const bookingData = {
      startDate: '2025-11-20',
      guests: 2
    };
    await testEndpoint('POST /packages/:id/book', 'POST', `/packages/${packages[0].id}/book`, bookingData, true);
  }
  await testEndpoint('GET /my-packages', 'GET', '/packages/bookings/my-packages', null, true);

  // Test 5: Room Endpoints (existing)
  console.log('\n🛏️  Room Endpoints:');
  await testEndpoint('GET /rooms', 'GET', '/rooms');
  await testEndpoint('GET /my-bookings', 'GET', '/bookings/my-bookings', null, true);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ API Endpoint Testing Complete!\n');
}

// Run tests
runTests().catch(console.error);
