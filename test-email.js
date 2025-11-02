// Quick test script for email notifications
require('dotenv').config();
const { sendWelcomeEmail, sendBookingConfirmation, sendPaymentReceipt, sendRefundConfirmation } = require('./server/services/emailService');

// Test data
const testUser = {
  id: 1,
  name: 'Test User',
  email: 'janabsyco4@gmail.com' // Your real email
};

const testRoom = {
  id: 1,
  name: 'Deluxe Ocean View Suite',
  price: 299
};

const testBooking = {
  id: 123,
  checkIn: new Date('2025-12-01'),
  checkOut: new Date('2025-12-05'),
  guests: 2,
  bookingType: 'room',
  totalPrice: 1196,
  roomId: 1,
  userId: 1
};

const testPayment = {
  id: 456,
  amount: 1196,
  status: 'succeeded',
  stripePaymentId: 'pi_test123456789',
  refundAmount: 1196,
  stripeRefundId: 're_test123456789',
  createdAt: new Date()
};

async function testEmails() {
  console.log('🧪 Testing Email Notifications...\n');
  
  try {
    console.log('1️⃣ Testing Welcome Email...');
    await sendWelcomeEmail(testUser);
    console.log('✅ Welcome email sent!\n');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    console.log('2️⃣ Testing Booking Confirmation...');
    await sendBookingConfirmation(testBooking, testUser, testRoom);
    console.log('✅ Booking confirmation sent!\n');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('3️⃣ Testing Payment Receipt...');
    await sendPaymentReceipt(testPayment, testBooking, testUser, testRoom);
    console.log('✅ Payment receipt sent!\n');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('4️⃣ Testing Refund Confirmation...');
    await sendRefundConfirmation(testPayment, testBooking, testUser, testRoom);
    console.log('✅ Refund confirmation sent!\n');
    
    console.log('🎉 All emails sent successfully!');
    console.log('📧 Check your inbox at:', testUser.email);
    
  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    console.log('\n💡 Make sure you have EMAIL_USER and EMAIL_PASS in your .env file!');
  }
}

// Run tests
testEmails();
