const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPaymentAnalytics() {
  console.log('📊 Testing Payment Analytics Calculations\n');
  console.log('='.repeat(70));
  
  try {
    // Fetch all bookings with payments
    const paidBookings = await prisma.booking.findMany({
      where: { paymentIntentId: { not: null } },
      include: { room: true, user: true }
    });

    const paidReservations = await prisma.diningReservation.findMany({
      where: { paymentIntentId: { not: null } },
      include: { restaurant: true, user: true }
    });

    const paidRedemptions = await prisma.dealRedemption.findMany({
      where: { paymentIntentId: { not: null } },
      include: { deal: true, user: true }
    });

    const paidPackages = await prisma.packageBooking.findMany({
      where: { paymentIntentId: { not: null } },
      include: { package: true, user: true }
    });

    // Calculate revenue
    const roomRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const packageRevenue = paidPackages.reduce((sum, p) => sum + p.totalPrice, 0);
    const diningDeposits = paidReservations.length * 50; // $25 per guest × 2 average
    const dealRevenue = paidRedemptions.length * 78; // Average deal price

    const totalRevenue = roomRevenue + packageRevenue + diningDeposits + dealRevenue;
    const totalPaidBookings = paidBookings.length + paidReservations.length + paidRedemptions.length + paidPackages.length;

    // Display results
    console.log('\n💰 REVENUE OVERVIEW');
    console.log('-'.repeat(70));
    console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`Total Paid Bookings: ${totalPaidBookings}`);
    console.log('');

    console.log('📊 REVENUE BREAKDOWN');
    console.log('-'.repeat(70));
    console.log(`🛏️  Room Bookings:      $${roomRevenue.toFixed(2).padStart(10)} (${paidBookings.length} bookings)`);
    console.log(`📦 Package Bookings:   $${packageRevenue.toFixed(2).padStart(10)} (${paidPackages.length} bookings)`);
    console.log(`🍽️  Dining Deposits:    $${diningDeposits.toFixed(2).padStart(10)} (${paidReservations.length} reservations)`);
    console.log(`🎁 Deal Redemptions:   $${dealRevenue.toFixed(2).padStart(10)} (${paidRedemptions.length} redemptions)`);
    console.log('-'.repeat(70));
    console.log(`   TOTAL:              $${totalRevenue.toFixed(2).padStart(10)}`);
    console.log('');

    console.log('📈 PERCENTAGE BREAKDOWN');
    console.log('-'.repeat(70));
    console.log(`🛏️  Room Bookings:      ${((roomRevenue / totalRevenue) * 100).toFixed(1)}%`);
    console.log(`📦 Package Bookings:   ${((packageRevenue / totalRevenue) * 100).toFixed(1)}%`);
    console.log(`🍽️  Dining Deposits:    ${((diningDeposits / totalRevenue) * 100).toFixed(1)}%`);
    console.log(`🎁 Deal Redemptions:   ${((dealRevenue / totalRevenue) * 100).toFixed(1)}%`);
    console.log('');

    console.log('📋 RECENT TRANSACTIONS (Last 5)');
    console.log('-'.repeat(70));
    
    const allTransactions = [
      ...paidBookings.map(b => ({ ...b, type: '🛏️ Room', amount: b.totalPrice })),
      ...paidPackages.map(p => ({ ...p, type: '📦 Package', amount: p.totalPrice })),
      ...paidReservations.map(r => ({ ...r, type: '🍽️ Dining', amount: 50 })),
      ...paidRedemptions.map(r => ({ ...r, type: '🎁 Deal', amount: 78 }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    allTransactions.slice(0, 5).forEach((txn, idx) => {
      console.log(`${idx + 1}. ${txn.type} - $${txn.amount.toFixed(2)}`);
      console.log(`   User: ${txn.user.email}`);
      console.log(`   Payment ID: ${txn.paymentIntentId}`);
      console.log(`   Date: ${new Date(txn.createdAt).toLocaleString()}`);
      console.log('');
    });

    console.log('='.repeat(70));
    console.log('✅ Payment analytics calculated successfully!');
    console.log('\n💡 View in Admin Dashboard:');
    console.log('   1. Login as admin at http://localhost:3000/login');
    console.log('   2. Go to http://localhost:3000/admin');
    console.log('   3. Click the "💳 Payments" tab');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentAnalytics();
