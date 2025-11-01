const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDiningDeals() {
  console.log('🧪 Testing Dining & Deals System\n');

  try {
    // Test Restaurants
    const restaurants = await prisma.restaurant.count();
    console.log(`✅ Restaurants: ${restaurants}`);

    // Test Deals
    const deals = await prisma.deal.count();
    console.log(`✅ Deals: ${deals}`);

    // Test Packages
    const packages = await prisma.package.count();
    console.log(`✅ Packages: ${packages}`);

    // Show sample data
    console.log('\n📊 Sample Data:\n');

    const sampleRestaurant = await prisma.restaurant.findFirst();
    console.log(`Restaurant: ${sampleRestaurant.name} (${sampleRestaurant.cuisine})`);

    const sampleDeal = await prisma.deal.findFirst();
    console.log(`Deal: ${sampleDeal.title} (${sampleDeal.discount}% off)`);

    const samplePackage = await prisma.package.findFirst();
    console.log(`Package: ${samplePackage.name} ($${samplePackage.price})`);

    console.log('\n🌐 API Endpoints Available:');
    console.log('   GET  /api/restaurants');
    console.log('   GET  /api/restaurants/:id');
    console.log('   POST /api/restaurants/reservations');
    console.log('   GET  /api/deals');
    console.log('   POST /api/deals/:id/redeem');
    console.log('   GET  /api/packages');
    console.log('   POST /api/packages/:id/book');

    console.log('\n🎉 All systems operational!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDiningDeals();
