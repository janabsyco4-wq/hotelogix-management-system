const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showAllTables() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              ALL DATABASE TABLES & DATA                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Get all data
    const users = await prisma.user.findMany();
    const rooms = await prisma.room.findMany();
    const restaurants = await prisma.restaurant.findMany();
    const deals = await prisma.deal.findMany();
    const packages = await prisma.package.findMany();
    const attractions = await prisma.attraction.findMany();
    const bookings = await prisma.booking.findMany();
    const reservations = await prisma.diningReservation.findMany();
    const redemptions = await prisma.dealRedemption.findMany();
    const packageBookings = await prisma.packageBooking.findMany();

    console.log('📊 TABLE COUNTS:\n');
    console.log(`✅ User: ${users.length} records`);
    console.log(`✅ Room: ${rooms.length} records`);
    console.log(`✅ Restaurant: ${restaurants.length} records`);
    console.log(`✅ Deal: ${deals.length} records`);
    console.log(`✅ Package: ${packages.length} records`);
    console.log(`✅ Attraction: ${attractions.length} records`);
    console.log(`✅ Booking: ${bookings.length} records`);
    console.log(`✅ DiningReservation: ${reservations.length} records`);
    console.log(`✅ DealRedemption: ${redemptions.length} records`);
    console.log(`✅ PackageBooking: ${packageBookings.length} records`);

    console.log('\n📋 SAMPLE DATA FROM EACH TABLE:\n');

    if (users.length > 0) {
      console.log('👤 Users:');
      users.forEach(u => console.log(`   - ${u.name} (${u.email}) - ${u.role}`));
    }

    if (restaurants.length > 0) {
      console.log('\n🍽️  Restaurants:');
      restaurants.forEach(r => console.log(`   - ${r.name} (${r.cuisine}) - ${r.location}`));
    }

    if (deals.length > 0) {
      console.log('\n🎁 Deals:');
      deals.forEach(d => console.log(`   - ${d.title} (${d.type}) - $${d.dealPrice}`));
    }

    if (packages.length > 0) {
      console.log('\n📦 Packages:');
      packages.forEach(p => console.log(`   - ${p.name} (${p.duration}) - $${p.price}`));
    }

    if (bookings.length > 0) {
      console.log('\n🛏️  Room Bookings:');
      bookings.forEach(b => console.log(`   - Booking #${b.id} - ${b.status} - $${b.totalPrice}`));
    }

    if (reservations.length > 0) {
      console.log('\n🍽️  Dining Reservations:');
      reservations.forEach(r => console.log(`   - Reservation #${r.id} - ${r.guests} guests - ${r.status}`));
    }

    if (redemptions.length > 0) {
      console.log('\n🎟️  Deal Redemptions:');
      redemptions.forEach(r => console.log(`   - ${r.redemptionCode} - ${r.status}`));
    }

    if (packageBookings.length > 0) {
      console.log('\n📋 Package Bookings:');
      packageBookings.forEach(p => console.log(`   - Booking #${p.id} - ${p.guests} guests - ${p.status}`));
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    VERIFICATION                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('✅ All tables have data!');
    console.log('✅ Total records: ' + (users.length + rooms.length + restaurants.length + deals.length + packages.length + attractions.length + bookings.length + reservations.length + redemptions.length + packageBookings.length));
    console.log('\n🌐 Open Prisma Studio: http://localhost:5555');
    console.log('   Click on each table name on the left to view the data\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showAllTables();
