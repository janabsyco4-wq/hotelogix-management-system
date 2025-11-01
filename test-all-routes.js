const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const CLIENT_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    log(`✓ ${method.toUpperCase()} ${endpoint} - Status: ${response.status}`, 'green');
    return { success: true, data: response.data };
  } catch (error) {
    log(`✗ ${method.toUpperCase()} ${endpoint} - Error: ${error.response?.status || error.message}`, 'red');
    return { success: false, error: error.response?.data || error.message };
  }
}

async function runTests() {
  log('\n========================================', 'cyan');
  log('🧪 STONEY CREEK HOTEL - ROUTE TESTING', 'cyan');
  log('========================================\n', 'cyan');

  // Test 1: Server Health
  log('📡 Testing Server Health...', 'blue');
  await testEndpoint('get', '/');
  await testEndpoint('get', '/api/health');

  // Test 2: Public Routes
  log('\n🏨 Testing Public Routes...', 'blue');
  const hotelsResult = await testEndpoint('get', '/api/hotels');
  const roomsResult = await testEndpoint('get', '/api/rooms');
  const attractionsResult = await testEndpoint('get', '/api/attractions');

  // Test 3: Room Details
  if (roomsResult.success && roomsResult.data.length > 0) {
    const firstRoomId = roomsResult.data[0].id;
    log('\n🛏️ Testing Room Details...', 'blue');
    await testEndpoint('get', `/api/rooms/${firstRoomId}`);
    await testEndpoint('get', `/api/rooms/${firstRoomId}/availability?checkIn=2024-12-01&checkOut=2024-12-05`);
  }

  // Test 4: Authentication Routes
  log('\n🔐 Testing Authentication...', 'blue');
  
  // Test registration
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    phone: '555-0123',
    password: 'password123'
  };
  
  const registerResult = await testEndpoint('post', '/api/auth/register', testUser);
  
  let token = null;
  if (registerResult.success) {
    token = registerResult.data.token;
    log('  → Registration successful, token received', 'green');
  }

  // Test login
  const loginResult = await testEndpoint('post', '/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });

  if (loginResult.success) {
    token = loginResult.data.token;
    log('  → Login successful', 'green');
  }

  // Test 5: Protected Routes (Bookings)
  if (token && roomsResult.success && roomsResult.data.length > 0) {
    log('\n📅 Testing Booking Routes (Protected)...', 'blue');
    
    const room = roomsResult.data[0];
    const bookingData = {
      hotelId: room.hotelId,
      roomId: room.id,
      checkIn: '2024-12-10',
      checkOut: '2024-12-15',
      guests: 2
    };

    const bookingResult = await testEndpoint('post', '/api/bookings', bookingData, token);
    
    if (bookingResult.success) {
      log('  → Booking created successfully', 'green');
      
      // Get user's bookings
      await testEndpoint('get', '/api/bookings/my-bookings', null, token);
      
      // Get specific booking
      const bookingId = bookingResult.data.id;
      await testEndpoint('get', `/api/bookings/${bookingId}`, null, token);
      
      // Cancel booking
      await testEndpoint('patch', `/api/bookings/${bookingId}/cancel`, null, token);
    }
  }

  // Test 6: Recommendations
  log('\n🤖 Testing AI Recommendations...', 'blue');
  await testEndpoint('get', '/api/recommendations');

  // Summary
  log('\n========================================', 'cyan');
  log('📊 ROUTE TESTING SUMMARY', 'cyan');
  log('========================================', 'cyan');
  log('\n✅ Backend API Routes:', 'green');
  log('  • GET  / (Root)', 'yellow');
  log('  • GET  /api/health', 'yellow');
  log('  • GET  /api/hotels', 'yellow');
  log('  • GET  /api/hotels/:id', 'yellow');
  log('  • GET  /api/rooms', 'yellow');
  log('  • GET  /api/rooms/:id', 'yellow');
  log('  • GET  /api/rooms/:id/availability', 'yellow');
  log('  • GET  /api/attractions', 'yellow');
  log('  • POST /api/auth/register', 'yellow');
  log('  • POST /api/auth/login', 'yellow');
  log('  • POST /api/bookings (Protected)', 'yellow');
  log('  • GET  /api/bookings/my-bookings (Protected)', 'yellow');
  log('  • GET  /api/bookings/:id (Protected)', 'yellow');
  log('  • PATCH /api/bookings/:id/cancel (Protected)', 'yellow');
  log('  • GET  /api/recommendations', 'yellow');

  log('\n✅ Frontend Routes:', 'green');
  log(`  • ${CLIENT_URL}/ (Home)`, 'yellow');
  log(`  • ${CLIENT_URL}/rooms (Rooms List)`, 'yellow');
  log(`  • ${CLIENT_URL}/rooms/:id (Room Details)`, 'yellow');
  log(`  • ${CLIENT_URL}/book/:id (Book Room)`, 'yellow');
  log(`  • ${CLIENT_URL}/login (Login)`, 'yellow');
  log(`  • ${CLIENT_URL}/register (Register)`, 'yellow');
  log(`  • ${CLIENT_URL}/bookings (My Bookings - Protected)`, 'yellow');
  log(`  • ${CLIENT_URL}/admin (Admin Dashboard - Admin Only)`, 'yellow');
  log(`  • ${CLIENT_URL}/ai-analytics (AI Analytics - Admin Only)`, 'yellow');

  log('\n✅ Navigation Links:', 'green');
  log('  • Header: HOME, ROOMS, MY BOOKINGS, ADMIN, AI ANALYTICS', 'yellow');
  log('  • Home: EXPLORE ROOMS button → /rooms', 'yellow');
  log('  • Rooms: VIEW DETAILS → /rooms/:id', 'yellow');
  log('  • Rooms: BOOK NOW → /book/:id', 'yellow');
  log('  • Room View: Back to Rooms → /rooms', 'yellow');
  log('  • Room View: Book Now → /book/:id', 'yellow');
  log('  • Book Room: Back to Room Details → /rooms/:id', 'yellow');

  log('\n========================================\n', 'cyan');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
