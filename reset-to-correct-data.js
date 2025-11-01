const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetToCorrectData() {
  console.log('🔄 Resetting to correct data counts...\n');

  try {
    // Delete ALL restaurants, deals, packages and their related data
    console.log('🗑️  Deleting all existing data...');
    
    await prisma.diningReservation.deleteMany({});
    console.log('   ✅ Deleted all dining reservations');
    
    await prisma.dealRedemption.deleteMany({});
    console.log('   ✅ Deleted all deal redemptions');
    
    await prisma.packageBooking.deleteMany({});
    console.log('   ✅ Deleted all package bookings');
    
    await prisma.restaurant.deleteMany({});
    console.log('   ✅ Deleted all restaurants');
    
    await prisma.deal.deleteMany({});
    console.log('   ✅ Deleted all deals');
    
    await prisma.package.deleteMany({});
    console.log('   ✅ Deleted all packages');

    console.log('\n✅ All data cleared. Now run: node seed-complete.js');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetToCorrectData();
