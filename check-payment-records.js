const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPaymentRecords() {
  console.log('🔍 Checking Payment Records in Database\n');
  console.log('='.repeat(60));
  
  try {
    // Check Room Bookings
    console.log('\n🏨 ROOM BOOKINGS');
    console.log('-'.repeat(60));
    const bookings = await prisma.booking.findMany({
      include: { room: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Total bookings: ${bookings.length}`);
    bookings.forEach((booking, idx) => {
      console.log(`\n${idx + 1}. Booking #${booking.id}`);
      console.log(`   Room: ${booking.room.title}`);
      console.log(`   User: ${booking.user.email}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Total: $${booking.totalPrice}`);
      console.log(`   Payment Intent: ${booking.paymentIntentId || 'None'}`);
      console.log(`   Created: ${booking.createdAt}`);
    });
    
    // Check Dining Reservations
    console.log('\n' + '='.repeat(60));
    console.log('\n🍽️  DINING RESERVATIONS');
    console.log('-'.repeat(60));
    const dining = await prisma.diningReservation.findMany({
      include: { restaurant: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Total reservations: ${dining.length}`);
    dining.forEach((res, idx) => {
      console.log(`\n${idx + 1}. Reservation #${res.id}`);
      console.log(`   Restaurant: ${res.restaurant.name}`);
      console.log(`   User: ${res.user.email}`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Date: ${res.date}`);
      console.log(`   Time: ${res.time}`);
      console.log(`   Guests: ${res.guests}`);
      console.log(`   Payment Intent: ${res.paymentIntentId || 'None'}`);
      console.log(`   Created: ${res.createdAt}`);
    });
    
    // Check Deal Redemptions
    console.log('\n' + '='.repeat(60));
    console.log('\n🎁 DEAL REDEMPTIONS');
    console.log('-'.repeat(60));
    const deals = await prisma.dealRedemption.findMany({
      include: { deal: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Total redemptions: ${deals.length}`);
    deals.forEach((redemption, idx) => {
      console.log(`\n${idx + 1}. Redemption #${redemption.id}`);
      console.log(`   Deal: ${redemption.deal.title}`);
      console.log(`   User: ${redemption.user.email}`);
      console.log(`   Status: ${redemption.status}`);
      console.log(`   Code: ${redemption.redemptionCode}`);
      console.log(`   Payment Intent: ${redemption.paymentIntentId || 'None'}`);
      console.log(`   Created: ${redemption.createdAt}`);
    });
    
    // Check Package Bookings
    console.log('\n' + '='.repeat(60));
    console.log('\n📦 PACKAGE BOOKINGS');
    console.log('-'.repeat(60));
    const packages = await prisma.packageBooking.findMany({
      include: { package: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Total package bookings: ${packages.length}`);
    packages.forEach((booking, idx) => {
      console.log(`\n${idx + 1}. Package Booking #${booking.id}`);
      console.log(`   Package: ${booking.package.name}`);
      console.log(`   User: ${booking.user.email}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Total: $${booking.totalPrice}`);
      console.log(`   Payment Intent: ${booking.paymentIntentId || 'None'}`);
      console.log(`   Created: ${booking.createdAt}`);
    });
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 SUMMARY');
    console.log('-'.repeat(60));
    
    const bookingsWithPayment = bookings.filter(b => b.paymentIntentId).length;
    const diningWithPayment = dining.filter(d => d.paymentIntentId).length;
    const dealsWithPayment = deals.filter(d => d.paymentIntentId).length;
    const packagesWithPayment = packages.filter(p => p.paymentIntentId).length;
    
    console.log(`Room Bookings: ${bookings.length} total, ${bookingsWithPayment} with payment`);
    console.log(`Dining Reservations: ${dining.length} total, ${diningWithPayment} with payment`);
    console.log(`Deal Redemptions: ${deals.length} total, ${dealsWithPayment} with payment`);
    console.log(`Package Bookings: ${packages.length} total, ${packagesWithPayment} with payment`);
    
    const totalWithPayment = bookingsWithPayment + diningWithPayment + dealsWithPayment + packagesWithPayment;
    const totalRecords = bookings.length + dining.length + deals.length + packages.length;
    
    console.log(`\nTotal Records: ${totalRecords}`);
    console.log(`Records with Payment: ${totalWithPayment}`);
    
    if (totalWithPayment === 0) {
      console.log('\n⚠️  No payment records found!');
      console.log('This means either:');
      console.log('1. No payments have been completed yet');
      console.log('2. Payment confirmation is not saving paymentIntentId');
      console.log('\n💡 Try completing a payment in the browser to test.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPaymentRecords();
