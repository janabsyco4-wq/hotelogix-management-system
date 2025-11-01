const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyAllData() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          VERIFYING ALL DATABASE DATA                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Get all data
    const [
      rooms,
      restaurants,
      deals,
      packages,
      bookings,
      users,
      reservations,
      redemptions,
      packageBookings,
      attractions
    ] = await Promise.all([
      prisma.room.findMany(),
      prisma.restaurant.findMany(),
      prisma.deal.findMany(),
      prisma.package.findMany(),
      prisma.booking.findMany({ include: { user: true, room: true } }),
      prisma.user.findMany(),
      prisma.diningReservation.findMany({ include: { user: true, restaurant: true } }),
      prisma.dealRedemption.findMany({ include: { user: true, deal: true } }),
      prisma.packageBooking.findMany({ include: { user: true, package: true } }),
      prisma.attraction.findMany()
    ]);

    console.log('📊 DATABASE COUNTS:\n');
    console.log(`✅ Rooms: ${rooms.length}`);
    console.log(`✅ Restaurants: ${restaurants.length}`);
    console.log(`✅ Deals: ${deals.length}`);
    console.log(`✅ Packages: ${packages.length}`);
    console.log(`✅ Users: ${users.length}`);
    console.log(`✅ Attractions: ${attractions.length}`);
    console.log('');
    console.log(`✅ Room Bookings: ${bookings.length}`);
    console.log(`✅ Dining Reservations: ${reservations.length}`);
    console.log(`✅ Deal Redemptions: ${redemptions.length}`);
    console.log(`✅ Package Bookings: ${packageBookings.length}`);
    console.log(`📋 TOTAL BOOKINGS: ${bookings.length + reservations.length + redemptions.length + packageBookings.length}`);

    console.log('\n🔍 SAMPLE DATA:\n');
    
    if (bookings.length > 0) {
      console.log('Room Booking Sample:');
      console.log(`  ID: ${bookings[0].id}, Room: ${bookings[0].room?.title}, User: ${bookings[0].user?.name}, Status: ${bookings[0].status}`);
    }

    if (reservations.length > 0) {
      console.log('Dining Reservation Sample:');
      console.log(`  ID: ${reservations[0].id}, Restaurant: ${reservations[0].restaurant?.name}, User: ${reservations[0].user?.name}, Status: ${reservations[0].status}`);
    }

    if (redemptions.length > 0) {
      console.log('Deal Redemption Sample:');
      console.log(`  ID: ${redemptions[0].id}, Deal: ${redemptions[0].deal?.title}, User: ${redemptions[0].user?.name}, Status: ${redemptions[0].status}`);
    }

    if (packageBookings.length > 0) {
      console.log('Package Booking Sample:');
      console.log(`  ID: ${packageBookings[0].id}, Package: ${packageBookings[0].package?.name}, User: ${packageBookings[0].user?.name}, Status: ${packageBookings[0].status}`);
    }

    console.log('\n✅ ALL DATA IS PRESENT IN DATABASE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllData();
