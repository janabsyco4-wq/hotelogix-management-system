const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testAllBackendAPIs() {
  console.log('🧪 COMPLETE BACKEND API TEST\n');
  console.log('='.repeat(80));
  
  let adminToken, userToken;
  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  const test = async (name, fn) => {
    testResults.total++;
    try {
      await fn();
      console.log(`✅ ${name}`);
      testResults.passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      testResults.failed++;
    }
  };
  
  try {
    // ========== AUTHENTICATION ==========
    console.log('\n1️⃣ AUTHENTICATION ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('POST /api/auth/register', async () => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@test.com`,
          password: 'test123',
          phone: '1234567890'
        })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
    });
    
    await test('POST /api/auth/login (Admin)', async () => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@hotelogix.com', password: 'admin123' })
      });
      const data = await res.json();
      if (!data.token) throw new Error('No token received');
      adminToken = data.token;
    });
    
    await test('POST /api/auth/login (User)', async () => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
      });
      const data = await res.json();
      if (!data.token) throw new Error('No token received');
      userToken = data.token;
    });
    
    // ========== ROOMS ==========
    console.log('\n2️⃣ ROOMS ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/rooms', async () => {
      const res = await fetch(`${API_URL}/rooms`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
      if (data.length === 0) throw new Error('No rooms found');
    });
    
    await test('GET /api/rooms/:id', async () => {
      // First get a valid room ID
      const roomsRes = await fetch(`${API_URL}/rooms`);
      const rooms = await roomsRes.json();
      if (rooms.length === 0) throw new Error('No rooms available');
      
      const res = await fetch(`${API_URL}/rooms/${rooms[0].id}`);
      const data = await res.json();
      if (!data.id) throw new Error('No room data');
    });
    
    // ========== RESTAURANTS ==========
    console.log('\n3️⃣ RESTAURANTS ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/restaurants', async () => {
      const res = await fetch(`${API_URL}/restaurants`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/restaurants/:id', async () => {
      const res = await fetch(`${API_URL}/restaurants/1`);
      const data = await res.json();
      if (!data.id) throw new Error('No restaurant data');
    });
    
    await test('GET /api/restaurants/reservations/my-reservations', async () => {
      const res = await fetch(`${API_URL}/restaurants/reservations/my-reservations`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    // ========== DEALS ==========
    console.log('\n4️⃣ DEALS ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/deals', async () => {
      const res = await fetch(`${API_URL}/deals`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/deals/:id', async () => {
      const res = await fetch(`${API_URL}/deals/1`);
      const data = await res.json();
      if (!data.id) throw new Error('No deal data');
    });
    
    await test('GET /api/deals/redemptions/my-deals', async () => {
      const res = await fetch(`${API_URL}/deals/redemptions/my-deals`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    // ========== PACKAGES ==========
    console.log('\n5️⃣ PACKAGES ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/packages', async () => {
      const res = await fetch(`${API_URL}/packages`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/packages/:id', async () => {
      const res = await fetch(`${API_URL}/packages/1`);
      const data = await res.json();
      if (!data.id) throw new Error('No package data');
    });
    
    await test('GET /api/packages/bookings/my-packages', async () => {
      const res = await fetch(`${API_URL}/packages/bookings/my-packages`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    // ========== BOOKINGS ==========
    console.log('\n6️⃣ BOOKINGS ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/bookings/my-bookings', async () => {
      const res = await fetch(`${API_URL}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    // ========== PAYMENT ==========
    console.log('\n7️⃣ PAYMENT ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('POST /api/payment/create-payment-intent', async () => {
      const res = await fetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          amount: 100,
          bookingType: 'room',
          bookingDetails: { roomId: 1, checkIn: '2025-11-10', checkOut: '2025-11-12' }
        })
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error('No client secret');
    });
    
    await test('GET /api/payment/payment-status/:id', async () => {
      const res = await fetch(`${API_URL}/payment/payment-status/pi_test123`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      // This will fail with invalid payment ID, but endpoint should exist
      if (res.status === 404) throw new Error('Endpoint not found');
    });
    
    // ========== ADMIN ENDPOINTS ==========
    console.log('\n8️⃣ ADMIN ENDPOINTS');
    console.log('-'.repeat(80));
    
    await test('GET /api/admin/bookings', async () => {
      const res = await fetch(`${API_URL}/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/admin/users', async () => {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/admin/reservations', async () => {
      const res = await fetch(`${API_URL}/admin/reservations`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/admin/redemptions', async () => {
      const res = await fetch(`${API_URL}/admin/redemptions`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    await test('GET /api/admin/package-bookings', async () => {
      const res = await fetch(`${API_URL}/admin/package-bookings`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Not an array');
    });
    
    // ========== REFUND ENDPOINTS ==========
    console.log('\n9️⃣ REFUND ENDPOINTS (Admin Only)');
    console.log('-'.repeat(80));
    
    await test('POST /api/payment/refund (Admin access check)', async () => {
      const res = await fetch(`${API_URL}/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          paymentIntentId: 'pi_test',
          bookingType: 'room',
          bookingId: 999,
          amount: 100,
          reason: 'requested_by_customer'
        })
      });
      // Will fail with invalid payment ID, but should not be 403 (forbidden)
      if (res.status === 403) throw new Error('Admin access denied');
    });
    
    await test('POST /api/payment/refund (User access denied)', async () => {
      const res = await fetch(`${API_URL}/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          paymentIntentId: 'pi_test',
          bookingType: 'room',
          bookingId: 999,
          amount: 100,
          reason: 'requested_by_customer'
        })
      });
      // Should be 403 (forbidden) for non-admin
      if (res.status !== 403) throw new Error('User should not have access');
    });
    
    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 ALL BACKEND APIs WORKING CORRECTLY!');
    } else {
      console.log(`\n⚠️  ${testResults.failed} test(s) failed. Review errors above.`);
    }
    
    console.log('\n📋 ENDPOINTS TESTED:');
    console.log('   ✅ Authentication (3 endpoints)');
    console.log('   ✅ Rooms (2 endpoints)');
    console.log('   ✅ Restaurants (3 endpoints)');
    console.log('   ✅ Deals (3 endpoints)');
    console.log('   ✅ Packages (3 endpoints)');
    console.log('   ✅ Bookings (1 endpoint)');
    console.log('   ✅ Payment (2 endpoints)');
    console.log('   ✅ Admin (5 endpoints)');
    console.log('   ✅ Refund (2 endpoints)');
    console.log(`   📊 Total: ${testResults.total} endpoints`);
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
  }
}

testAllBackendAPIs();
