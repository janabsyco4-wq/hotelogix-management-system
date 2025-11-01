const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFlows() {
  console.log('🧪 Testing Database and API Flows\n');
  
  try {
    // Test 1: Check data counts
    console.log('📊 Database Counts:');
    const restaurants = await prisma.restaurant.count();
    const deals = await prisma.deal.count();
    const packages = await prisma.package.count();
    const users = await prisma.user.count();
    const roomBookings = await prisma.booking.count();
    const diningReservations = await prisma.diningReservation.count();
    const dealRedemptions = await prisma.dealRedemption.count();
    const packageBookings = await prisma.packageBooking.count();
    
    console.log(`  ✓ Restaurants: ${restaurants}`);
    console.log(`  ✓ Deals: ${deals}`);
    console.log(`  ✓ Packages: ${packages}`);
    console.log(`  ✓ Users: ${users}`);
    console.log(`  ✓ Room Bookings: ${roomBookings}`);
    console.log(`  ✓ Dining Reservations: ${diningReservations}`);
    console.log(`  ✓ Deal Redemptions: ${dealRedemptions}`);
    console.log(`  ✓ Package Bookings: ${packageBookings}\n`);
    
    // Test 2: Sample restaurant data
    console.log('🍽️  Sample Restaurant:');
    const restaurant = await prisma.restaurant.findFirst();
    if (restaurant) {
      console.log(`  ✓ ${restaurant.name} - ${restaurant.cuisine}`);
      console.log(`  ✓ Location: ${restaurant.location}`);
      console.log(`  ✓ Price Range: ${restaurant.priceRange}\n`);
    }
    
    // Test 3: Sample deal data
    console.log('🎁 Sample Deal:');
    const deal = await prisma.deal.findFirst();
    if (deal) {
      console.log(`  ✓ ${deal.title}`);
      console.log(`  ✓ Discount: ${deal.discount}%`);
      console.log(`  ✓ Price: $${deal.originalPrice} → $${deal.dealPrice}\n`);
    }
    
    // Test 4: Sample package data
    console.log('📦 Sample Package:');
    const pkg = await prisma.package.findFirst();
    if (pkg) {
      console.log(`  ✓ ${pkg.name}`);
      console.log(`  ✓ Duration: ${pkg.duration}`);
      console.log(`  ✓ Price: $${pkg.price}\n`);
    }
    
    // Test 5: Check if user bookings exist
    if (users > 0) {
      const user = await prisma.user.findFirst({
        include: {
          bookings: true,
          diningReservations: true,
          dealRedemptions: true,
          packageBookings: true
        }
      });
      
      if (user) {
        console.log(`👤 Sample User: ${user.name}`);
        console.log(`  ✓ Room Bookings: ${user.bookings.length}`);
        console.log(`  ✓ Dining Reservations: ${user.diningReservations.length}`);
        console.log(`  ✓ Deal Redemptions: ${user.dealRedemptions.length}`);
        console.log(`  ✓ Package Bookings: ${user.packageBookings.length}\n`);
      }
    }
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFlows();
