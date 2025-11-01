const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Test credentials
const testUser = {
  email: 'john@example.com',
  password: 'password123'
};

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Integration Flow\n');
  
  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
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
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Step 2: Get available rooms
    console.log('\n2️⃣ Fetching available rooms...');
    const roomsRes = await fetch(`${API_URL}/rooms`);
    const rooms = await roomsRes.json();
    const room = rooms[0];
    console.log(`✅ Found ${rooms.length} rooms`);
    console.log(`   Testing with: ${room.title} ($${room.pricePerNight}/night)`);
    
    // Step 3: Create payment intent
    console.log('\n3️⃣ Creating payment intent...');
    const bookingData = {
      roomId: room.id,
      checkIn: '2025-11-10',
      checkOut: '2025-11-12',
      guests: 2
    };
    
    const nights = 2;
    const totalAmount = room.pricePerNight * nights;
    
    const paymentIntentRes = await fetch(`${API_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: totalAmount,
        bookingType: 'room',
        bookingDetails: { ...bookingData, totalPrice: totalAmount }
      })
    });
    
    const paymentData = await paymentIntentRes.json();
    console.log('✅ Payment intent created');
    console.log(`   Amount: $${totalAmount}`);
    console.log(`   Payment Intent ID: ${paymentData.paymentIntentId}`);
    console.log(`   Client Secret: ${paymentData.clientSecret.substring(0, 30)}...`);
    
    // Step 4: Check payment status
    console.log('\n4️⃣ Checking payment status...');
    const statusRes = await fetch(
      `${API_URL}/payment/payment-status/${paymentData.paymentIntentId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const statusData = await statusRes.json();
    console.log('✅ Payment status retrieved');
    console.log(`   Status: ${statusData.status}`);
    console.log(`   Amount: $${statusData.amount}`);
    console.log(`   Currency: ${statusData.currency}`);
    
    console.log('\n✅ Payment Integration Test Complete!');
    console.log('\n📝 Summary:');
    console.log('   - Payment intent creation: ✅ Working');
    console.log('   - Payment status retrieval: ✅ Working');
    console.log('   - Authentication: ✅ Working');
    console.log('\n💡 Next Steps:');
    console.log('   1. Test the payment flow in the browser at http://localhost:3000');
    console.log('   2. Navigate to a room and click "Book Now"');
    console.log('   3. Fill in booking details and proceed to payment');
    console.log('   4. Use Stripe test card: 4242 4242 4242 4242');
    console.log('   5. Use any future expiry date and any 3-digit CVC');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testPaymentFlow();
