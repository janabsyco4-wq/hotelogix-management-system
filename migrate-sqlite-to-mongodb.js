const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

// MongoDB Prisma Client
const prisma = new PrismaClient();

// SQLite connection
const db = new sqlite3.Database('./prisma/dev.db');
const dbAll = promisify(db.all.bind(db));

async function migrateData() {
  console.log('🔄 Starting migration from SQLite to MongoDB...\n');

  try {
    // 1. Migrate Users
    console.log('👤 Migrating users...');
    const users = await dbAll('SELECT * FROM User');
    const userIdMap = new Map(); // Map old IDs to new ObjectIds
    
    for (const user of users) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          password: user.password,
          name: user.name,
          phone: user.phone,
          address: user.address,
          city: user.city,
          country: user.country,
          profileImage: user.profileImage,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      });
      userIdMap.set(user.id, newUser.id);
    }
    console.log(`✅ Migrated ${users.length} users\n`);

    // 2. Migrate Rooms
    console.log('🏨 Migrating rooms...');
    const rooms = await dbAll('SELECT * FROM Room');
    const roomIdMap = new Map();
    
    for (const room of rooms) {
      const newRoom = await prisma.room.create({
        data: {
          roomNumber: room.roomNumber,
          type: room.type,
          title: room.title,
          description: room.description,
          location: room.location,
          capacity: room.capacity,
          pricePerNight: room.pricePerNight,
          images: JSON.parse(room.images || '[]'),
          amenities: JSON.parse(room.amenities || '[]'),
          size: room.size,
          bedType: room.bedType,
          isAvailable: room.isAvailable === 1,
          featured: room.featured === 1,
          averageRating: room.averageRating || 0,
          reviewCount: room.reviewCount || 0,
          createdAt: new Date(room.createdAt),
          updatedAt: new Date(room.updatedAt)
        }
      });
      roomIdMap.set(room.id, newRoom.id);
    }
    console.log(`✅ Migrated ${rooms.length} rooms\n`);

    // 3. Migrate Restaurants
    console.log('🍽️  Migrating restaurants...');
    const restaurants = await dbAll('SELECT * FROM Restaurant');
    const restaurantIdMap = new Map();
    
    for (const restaurant of restaurants) {
      const newRestaurant = await prisma.restaurant.create({
        data: {
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          location: restaurant.location,
          images: JSON.parse(restaurant.images || '[]'),
          priceRange: restaurant.priceRange,
          rating: restaurant.rating,
          openingHours: restaurant.openingHours,
          menu: restaurant.menu,
          amenities: JSON.parse(restaurant.amenities || '[]'),
          featured: restaurant.featured === 1,
          isActive: restaurant.isActive === 1,
          createdAt: new Date(restaurant.createdAt),
          updatedAt: new Date(restaurant.updatedAt)
        }
      });
      restaurantIdMap.set(restaurant.id, newRestaurant.id);
    }
    console.log(`✅ Migrated ${restaurants.length} restaurants\n`);

    // 4. Migrate Deals
    console.log('💰 Migrating deals...');
    const deals = await dbAll('SELECT * FROM Deal');
    const dealIdMap = new Map();
    
    for (const deal of deals) {
      const newDeal = await prisma.deal.create({
        data: {
          title: deal.title,
          description: deal.description,
          type: deal.type,
          discount: deal.discount,
          originalPrice: deal.originalPrice,
          dealPrice: deal.dealPrice,
          images: JSON.parse(deal.images || '[]'),
          terms: deal.terms,
          validFrom: new Date(deal.validFrom),
          validUntil: new Date(deal.validUntil),
          location: deal.location,
          featured: deal.featured === 1,
          isActive: deal.isActive === 1,
          maxRedemptions: deal.maxRedemptions,
          currentRedemptions: deal.currentRedemptions || 0,
          createdAt: new Date(deal.createdAt),
          updatedAt: new Date(deal.updatedAt)
        }
      });
      dealIdMap.set(deal.id, newDeal.id);
    }
    console.log(`✅ Migrated ${deals.length} deals\n`);

    // 5. Migrate Packages
    console.log('📦 Migrating packages...');
    const packages = await dbAll('SELECT * FROM Package');
    const packageIdMap = new Map();
    
    for (const pkg of packages) {
      const newPackage = await prisma.package.create({
        data: {
          name: pkg.name,
          description: pkg.description,
          includes: JSON.parse(pkg.includes || '[]'),
          images: JSON.parse(pkg.images || '[]'),
          price: pkg.price,
          duration: pkg.duration,
          location: pkg.location,
          featured: pkg.featured === 1,
          isActive: pkg.isActive === 1,
          createdAt: new Date(pkg.createdAt),
          updatedAt: new Date(pkg.updatedAt)
        }
      });
      packageIdMap.set(pkg.id, newPackage.id);
    }
    console.log(`✅ Migrated ${packages.length} packages\n`);

    // 6. Migrate Attractions
    console.log('🎡 Migrating attractions...');
    const attractions = await dbAll('SELECT * FROM Attraction');
    
    for (const attraction of attractions) {
      await prisma.attraction.create({
        data: {
          title: attraction.title,
          subtitle: attraction.subtitle,
          description: attraction.description,
          image: attraction.image,
          location: attraction.location,
          createdAt: new Date(attraction.createdAt),
          updatedAt: new Date(attraction.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${attractions.length} attractions\n`);

    // 7. Migrate Bookings
    console.log('📅 Migrating bookings...');
    const bookings = await dbAll('SELECT * FROM Booking');
    const bookingIdMap = new Map();
    
    for (const booking of bookings) {
      const newBooking = await prisma.booking.create({
        data: {
          userId: userIdMap.get(booking.userId),
          roomId: roomIdMap.get(booking.roomId),
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          totalPrice: booking.totalPrice,
          status: booking.status,
          paymentIntentId: booking.paymentIntentId,
          cancellationReason: booking.cancellationReason,
          cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : null,
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt)
        }
      });
      bookingIdMap.set(booking.id, newBooking.id);
    }
    console.log(`✅ Migrated ${bookings.length} bookings\n`);

    // 8. Migrate Dining Reservations
    console.log('🍴 Migrating dining reservations...');
    const diningReservations = await dbAll('SELECT * FROM DiningReservation');
    
    for (const reservation of diningReservations) {
      await prisma.diningReservation.create({
        data: {
          userId: userIdMap.get(reservation.userId),
          restaurantId: restaurantIdMap.get(reservation.restaurantId),
          date: new Date(reservation.date),
          time: reservation.time,
          guests: reservation.guests,
          specialRequests: reservation.specialRequests,
          status: reservation.status,
          paymentIntentId: reservation.paymentIntentId,
          createdAt: new Date(reservation.createdAt),
          updatedAt: new Date(reservation.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${diningReservations.length} dining reservations\n`);

    // 9. Migrate Deal Redemptions
    console.log('🎟️  Migrating deal redemptions...');
    const dealRedemptions = await dbAll('SELECT * FROM DealRedemption');
    
    for (const redemption of dealRedemptions) {
      await prisma.dealRedemption.create({
        data: {
          userId: userIdMap.get(redemption.userId),
          dealId: dealIdMap.get(redemption.dealId),
          redemptionCode: redemption.redemptionCode,
          status: redemption.status,
          redeemedAt: redemption.redeemedAt ? new Date(redemption.redeemedAt) : null,
          paymentIntentId: redemption.paymentIntentId,
          createdAt: new Date(redemption.createdAt),
          updatedAt: new Date(redemption.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${dealRedemptions.length} deal redemptions\n`);

    // 10. Migrate Package Bookings
    console.log('📦 Migrating package bookings...');
    const packageBookings = await dbAll('SELECT * FROM PackageBooking');
    
    for (const pkgBooking of packageBookings) {
      await prisma.packageBooking.create({
        data: {
          userId: userIdMap.get(pkgBooking.userId),
          packageId: packageIdMap.get(pkgBooking.packageId),
          startDate: new Date(pkgBooking.startDate),
          guests: pkgBooking.guests,
          totalPrice: pkgBooking.totalPrice,
          status: pkgBooking.status,
          paymentIntentId: pkgBooking.paymentIntentId,
          createdAt: new Date(pkgBooking.createdAt),
          updatedAt: new Date(pkgBooking.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${packageBookings.length} package bookings\n`);

    // 11. Migrate Reviews
    console.log('⭐ Migrating reviews...');
    const reviews = await dbAll('SELECT * FROM Review');
    
    for (const review of reviews) {
      await prisma.review.create({
        data: {
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          userId: userIdMap.get(review.userId),
          roomId: roomIdMap.get(review.roomId),
          bookingId: bookingIdMap.get(review.bookingId),
          helpful: review.helpful || 0,
          notHelpful: review.notHelpful || 0,
          status: review.status,
          createdAt: new Date(review.createdAt),
          updatedAt: new Date(review.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${reviews.length} reviews\n`);

    // 12. Migrate Notifications
    console.log('🔔 Migrating notifications...');
    const notifications = await dbAll('SELECT * FROM Notification');
    
    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          type: notification.type,
          title: notification.title,
          message: notification.message,
          relatedId: notification.relatedId ? notification.relatedId.toString() : null,
          relatedType: notification.relatedType,
          isRead: notification.isRead === 1,
          priority: notification.priority,
          createdAt: new Date(notification.createdAt),
          updatedAt: new Date(notification.updatedAt)
        }
      });
    }
    console.log(`✅ Migrated ${notifications.length} notifications\n`);

    console.log('🎉 Migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Rooms: ${rooms.length}`);
    console.log(`   - Restaurants: ${restaurants.length}`);
    console.log(`   - Deals: ${deals.length}`);
    console.log(`   - Packages: ${packages.length}`);
    console.log(`   - Attractions: ${attractions.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log(`   - Dining Reservations: ${diningReservations.length}`);
    console.log(`   - Deal Redemptions: ${dealRedemptions.length}`);
    console.log(`   - Package Bookings: ${packageBookings.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Notifications: ${notifications.length}`);
    console.log('\n✨ All your data is now in MongoDB Atlas!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    db.close();
    await prisma.$disconnect();
  }
}

migrateData()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
