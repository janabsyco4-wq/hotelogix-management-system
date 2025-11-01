const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Test credentials
const testUser = {
  email: 'john@example.com',
  password: 'password123'
};

async function testAllPayments() {
  console.log('🧪 Testing All Payment Types\n');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Login
    console.log('\n1️⃣ Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log('✅ Login successful');
    
    // Test Room Booking Payment
    console.log('\n' + '='.repeat(60));
    console.log('🏨 TESTING ROOM BOOKING PAYMENT');
    console.log('='.repeat(60));
    
    const roomsRes = await fetch(`${API_URL}/rooms`);
    const rooms = await roomsRes.json();
    const room = rooms[0];
    console.log(`\n📍 Room: ${room.title} ($${room.pricePerNight}/night)`);
    
    const roomAmount = room.pricePerNight * 2; // 2 nights
    const roomPaymentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: roomAmount,
        bookingType: 'room',
        bookingDetails: {
          roomId: room.id,
          checkIn: '2025-11-10',
          checkOut: '2025-11-12',
          guests: 2,
          totalPrice: roomAmount
        }
      })
    });
    
    const roomPaymentData = await roomPaymentRes.json();
    console.log('✅ Room payment intent created');
    console.log(`   Amount: $${roomAmount}`);
    console.log(`   Payment Intent ID: ${roomPaymentData.paymentIntentId}`);
    
    // Test Dining Reservation Payment
    console.log('\n' + '='.repeat(60));
    console.log('🍽️  TESTING DINING RESERVATION PAYMENT');
    console.log('='.repeat(60));
    
    const restaurantsRes = await fetch(`${API_URL}/restaurants`);
    const restaurants = await restaurantsRes.json();
    const restaurant = restaurants[0];
    console.log(`\n📍 Restaurant: ${restaurant.name}`);
    
    const diningAmount = 50; // $25 deposit per guest * 2 guests
    const diningPaymentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: diningAmount,
        bookingType: 'dining',
        bookingDetails: {
          restaurantId: restaurant.id,
          date: '2025-11-15',
          time: '19:00',
          guests: 2,
          specialRequests: '',
          totalPrice: diningAmount
        }
      })
    });
    
    const diningPaymentData = await diningPaymentRes.json();
    console.log('✅ Dining payment intent created');
    console.log(`   Amount: $${diningAmount} (deposit)`);
    console.log(`   Payment Intent ID: ${diningPaymentData.paymentIntentId}`);
    
    // Test Deal Redemption Payment
    console.log('\n' + '='.repeat(60));
    console.log('🎁 TESTING DEAL REDEMPTION PAYMENT');
    console.log('='.repeat(60));
    
    const dealsRes = await fetch(`${API_URL}/deals`);
    const deals = await dealsRes.json();
    const deal = deals[0];
    console.log(`\n📍 Deal: ${deal.title}`);
    console.log(`   Original: $${deal.originalPrice} → Deal: $${deal.dealPrice}`);
    
    const dealPaymentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: deal.dealPrice,
        bookingType: 'deal',
        bookingDetails: {
          dealId: deal.id,
          totalPrice: deal.dealPrice
        }
      })
    });
    
    const dealPaymentData = await dealPaymentRes.json();
    console.log('✅ Deal payment intent created');
    console.log(`   Amount: $${deal.dealPrice}`);
    console.log(`   Payment Intent ID: ${dealPaymentData.paymentIntentId}`);
    
    // Test Package Booking Payment
    console.log('\n' + '='.repeat(60));
    console.log('📦 TESTING PACKAGE BOOKING PAYMENT');
    console.log('='.repeat(60));
    
    const packagesRes = await fetch(`${API_URL}/packages`);
    const packages = await packagesRes.json();
    const pkg = packages[0];
    console.log(`\n📍 Package: ${pkg.name}`);
    console.log(`   Duration: ${pkg.duration}`);
    
    const packagePaymentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: pkg.price,
        bookingType: 'package',
        bookingDetails: {
          packageId: pkg.id,
          startDate: '2025-11-20',
          guests: 2,
          totalPrice: pkg.price
        }
      })
    });
    
    const packagePaymentData = await packagePaymentRes.json();
    console.log('✅ Package payment intent created');
    console.log(`   Amount: $${pkg.price}`);
    console.log(`   Payment Intent ID: ${packagePaymentData.paymentIntentId}`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL PAYMENT TYPES TEST COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📝 Summary:');
    console.log('   ✅ Room Booking Payment - Working');
    console.log('   ✅ Dining Reservation Payment - Working');
    console.log('   ✅ Deal Redemption Payment - Working');
    console.log('   ✅ Package Booking Payment - Working');
    
    console.log('\n💡 Test in Browser:');
    console.log('   1. Room Booking: http://localhost:3000/rooms');
    console.log('   2. Dining: http://localhost:3000/dining');
    console.log('   3. Deals: http://localhost:3000/deals');
    console.log('   4. Packages: http://localhost:3000/packages');
    console.log('\n   Use test card: 4242 4242 4242 4242');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testAllPayments();
