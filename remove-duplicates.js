const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeDuplicates() {
  console.log('🧹 Starting duplicate removal...\n');

  try {
    // Get all data
    const restaurants = await prisma.restaurant.findMany();
    const deals = await prisma.deal.findMany();
    const packages = await prisma.package.findMany();
    const reservations = await prisma.diningReservation.findMany();
    const redemptions = await prisma.dealRedemption.findMany();
    const packageBookings = await prisma.packageBooking.findMany();

    console.log('📊 Current counts:');
    console.log(`   Restaurants: ${restaurants.length}`);
    console.log(`   Deals: ${deals.length}`);
    console.log(`   Packages: ${packages.length}`);
    console.log(`   Dining Reservations: ${reservations.length}`);
    console.log(`   Deal Redemptions: ${redemptions.length}`);
    console.log(`   Package Bookings: ${packageBookings.length}\n`);

    // Find duplicates by name/title
    const restaurantNames = {};
    const duplicateRestaurants = [];
    restaurants.forEach(r => {
      if (restaurantNames[r.name]) {
        duplicateRestaurants.push(r.id);
      } else {
        restaurantNames[r.name] = r.id;
      }
    });

    const dealTitles = {};
    const duplicateDeals = [];
    deals.forEach(d => {
      if (dealTitles[d.title]) {
        duplicateDeals.push(d.id);
      } else {
        dealTitles[d.title] = d.id;
      }
    });

    const packageNames = {};
    const duplicatePackages = [];
    packages.forEach(p => {
      if (packageNames[p.name]) {
        duplicatePackages.push(p.id);
      } else {
        packageNames[p.name] = p.id;
      }
    });

    console.log('🔍 Found duplicates:');
    console.log(`   Duplicate Restaurants: ${duplicateRestaurants.length}`);
    console.log(`   Duplicate Deals: ${duplicateDeals.length}`);
    console.log(`   Duplicate Packages: ${duplicatePackages.length}\n`);

    // Delete duplicates
    if (duplicateRestaurants.length > 0) {
      // First delete related reservations
      const deletedReservations = await prisma.diningReservation.deleteMany({
        where: { restaurantId: { in: duplicateRestaurants } }
      });
      console.log(`   Deleted ${deletedReservations.count} reservations linked to duplicate restaurants`);

      const deletedRestaurants = await prisma.restaurant.deleteMany({
        where: { id: { in: duplicateRestaurants } }
      });
      console.log(`✅ Deleted ${deletedRestaurants.count} duplicate restaurants`);
    }

    if (duplicateDeals.length > 0) {
      // First delete related redemptions
      const deletedRedemptions = await prisma.dealRedemption.deleteMany({
        where: { dealId: { in: duplicateDeals } }
      });
      console.log(`   Deleted ${deletedRedemptions.count} redemptions linked to duplicate deals`);

      const deletedDeals = await prisma.deal.deleteMany({
        where: { id: { in: duplicateDeals } }
      });
      console.log(`✅ Deleted ${deletedDeals.count} duplicate deals`);
    }

    if (duplicatePackages.length > 0) {
      // First delete related bookings
      const deletedBookings = await prisma.packageBooking.deleteMany({
        where: { packageId: { in: duplicatePackages } }
      });
      console.log(`   Deleted ${deletedBookings.count} bookings linked to duplicate packages`);

      const deletedPackages = await prisma.package.deleteMany({
        where: { id: { in: duplicatePackages } }
      });
      console.log(`✅ Deleted ${deletedPackages.count} duplicate packages`);
    }

    // Get final counts
    const finalCounts = await Promise.all([
      prisma.restaurant.count(),
      prisma.deal.count(),
      prisma.package.count(),
      prisma.diningReservation.count(),
      prisma.dealRedemption.count(),
      prisma.packageBooking.count()
    ]);

    console.log('\n📊 Final counts:');
    console.log(`   Restaurants: ${finalCounts[0]}`);
    console.log(`   Deals: ${finalCounts[1]}`);
    console.log(`   Packages: ${finalCounts[2]}`);
    console.log(`   Dining Reservations: ${finalCounts[3]}`);
    console.log(`   Deal Redemptions: ${finalCounts[4]}`);
    console.log(`   Package Bookings: ${finalCounts[5]}`);
    console.log(`   TOTAL BOOKINGS: ${finalCounts[3] + finalCounts[4] + finalCounts[5]}`);

    console.log('\n✅ Duplicate removal complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicates();
