async function testBooking() {
  console.log('🧪 Testing Booking Flow\n');
  
  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'user123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(loginData.error || 'Login failed');
    }
    
    const token = loginData.token;
    const user = loginData.user;
    console.log(`✅ Logged in as: ${user.name} (ID: ${user.id})\n`);
    
    // Step 2: Get a room
    console.log('Step 2: Fetching room...');
    const roomResponse = await fetch('http://localhost:5000/api/rooms/1');
    const room = await roomResponse.json();
    console.log(`✅ Room found: ${room.title} ($${room.pricePerNight}/night)\n`);
    
    // Step 3: Create booking
    console.log('Step 3: Creating booking...');
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7); // 7 days from now
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3); // 3 nights
    
    const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId: room.id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests: 2
      })
    });
    
    const bookingData = await bookingResponse.json();
    
    if (!bookingResponse.ok) {
      throw new Error(bookingData.error || 'Booking failed');
    }
    
    const booking = bookingData;
    console.log(`✅ Booking created successfully!`);
    console.log(`   Booking ID: ${booking.id}`);
    console.log(`   Room: ${booking.room.title}`);
    console.log(`   Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`);
    console.log(`   Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`);
    console.log(`   Total: $${booking.totalPrice}\n`);
    
    console.log('🎉 Booking test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBooking();
