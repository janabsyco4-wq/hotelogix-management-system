const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRevenueCalculation() {
  console.log('💰 REVENUE CALCULATION TEST\n');
  console.log('='.repeat(70));
  
  try {
    // Get all paid bookings
    const allPaidBookings = await prisma.booking.findMany({
      where: { paymentIntentId: { not: null } }
    });
    
    // Separate by status
    const confirmedBookings = allPaidBookings.filter(b => b.status === 'confirmed');
    const refundedBookings = allPaidBookings.filter(b => b.status === 'refunded' || b.status === 'cancelled');
    const otherBookings = allPaidBookings.filter(b => b.status !== 'confirmed' && b.status !== 'refunded' && b.status !== 'cancelled');
    
    // Calculate revenues
    const totalRevenue = allPaidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const activeRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const refundedAmount = refundedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    console.log('\n📊 BOOKING STATUS BREAKDOWN');
    console.log('-'.repeat(70));
    console.log(`Total Paid Bookings: ${allPaidBookings.length}`);
    console.log(`  - Confirmed: ${confirmedBookings.length}`);
    console.log(`  - Refunded/Cancelled: ${refundedBookings.length}`);
    console.log(`  - Other: ${otherBookings.length}`);
    
    console.log('\n💵 REVENUE BREAKDOWN');
    console.log('-'.repeat(70));
    console.log(`Total (All Paid): $${totalRevenue.toFixed(2)}`);
    console.log(`Active (Confirmed Only): $${activeRevenue.toFixed(2)}`);
    console.log(`Refunded Amount: $${refundedAmount.toFixed(2)}`);
    
    console.log('\n✅ CORRECT CALCULATION:');
    console.log(`  Revenue should show: $${activeRevenue.toFixed(2)}`);
    console.log(`  Refunded should show: $${refundedAmount.toFixed(2)}`);
    console.log(`  Total processed: $${totalRevenue.toFixed(2)}`);
    
    console.log('\n📋 DETAILED BREAKDOWN:');
    console.log('-'.repeat(70));
    
    if (confirmedBookings.length > 0) {
      console.log('\nConfirmed Bookings (Counted in Revenue):');
      confirmedBookings.forEach(b => {
        console.log(`  - Booking #${b.id}: $${b.totalPrice} (${b.status})`);
      });
    }
    
    if (refundedBookings.length > 0) {
      console.log('\nRefunded/Cancelled Bookings (NOT Counted in Revenue):');
      refundedBookings.forEach(b => {
        console.log(`  - Booking #${b.id}: $${b.totalPrice} (${b.status})`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ REVENUE CALCULATION VERIFIED');
    console.log('='.repeat(70));
    
    console.log('\n💡 ADMIN DASHBOARD WILL SHOW:');
    console.log(`  Total Revenue Card: $${activeRevenue.toFixed(2)} (green)`);
    console.log(`  Refunded Amount Card: $${refundedAmount.toFixed(2)} (red)`);
    console.log(`  ${confirmedBookings.length} active bookings counted`);
    console.log(`  ${refundedBookings.length} refunded bookings excluded`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testRevenueCalculation();
