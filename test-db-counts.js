const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  try {
    const rooms = await prisma.room.count();
    const restaurants = await prisma.restaurant.count();
    const deals = await prisma.deal.count();
    const packages = await prisma.package.count();
    const bookings = await prisma.booking.count();
    const users = await prisma.user.count();
    const reservations = await prisma.diningReservation.count();
    const redemptions = await prisma.dealRedemption.count();
    const packageBookings = await prisma.packageBooking.count();

    console.log('=== DATABASE COUNTS ===');
    console.log('Rooms:', rooms);
    console.log('Restaurants:', restaurants);
    console.log('Deals:', deals);
    console.log('Packages:', packages);
    console.log('Bookings:', bookings);
    console.log('Users:', users);
    console.log('Dining Reservations:', reservations);
    console.log('Deal Redemptions:', redemptions);
    console.log('Package Bookings:', packageBookings);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCounts();
