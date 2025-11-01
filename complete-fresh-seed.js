const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function completeFreshSeed() {
  console.log('🔄 COMPLETE FRESH DATABASE SEED\n');

  try {
    // Step 1: Delete ALL data
    console.log('Step 1: Clearing all data...');
    await prisma.diningReservation.deleteMany({});
    await prisma.dealRedemption.deleteMany({});
    await prisma.packageBooking.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.deal.deleteMany({});
    await prisma.package.deleteMany({});
    await prisma.attraction.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ All data cleared\n');

    // Step 2: Create Users
    console.log('Step 2: Creating users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@hotelogix.com',
        password: hashedPassword,
        phone: '+1-555-0100',
        role: 'admin'
      }
    });

    const johnUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        phone: '+1-555-0101',
        role: 'user'
      }
    });

    const shehroozUser = await prisma.user.create({
      data: {
        name: 'shehrooz hafeez',
        email: 'shehrooz@gmail.com',
        password: userPassword,
        phone: '+1-555-0102',
        role: 'admin'
      }
    });
    console.log('✅ Created 3 users\n');

    // Step 3: Create 48 Rooms (simplified - just create exactly 48)
    console.log('Step 3: Creating 48 rooms...');
    const roomTypes = ['Standard Room', 'Business Room', 'Deluxe Room', 'Junior Suite', 'Executive Suite', 'Family Suite'];
    const locations = ['Kansas City, MO', 'Independence, MO'];
    
    for (let i = 1; i <= 48; i++) {
      const typeIndex = (i - 1) % roomTypes.length;
      const locationIndex = i <= 24 ? 0 : 1;
      
      await prisma.room.create({
        data: {
          roomNumber: `${100 + i}`,
          type: roomTypes[typeIndex],
          title: `${roomTypes[typeIndex]} ${i}`,
          description: `Comfortable ${roomTypes[typeIndex].toLowerCase()} with modern amenities`,
          location: locations[locationIndex],
          capacity: typeIndex < 2 ? 2 : typeIndex < 4 ? 3 : 4,
          pricePerNight: 100 + (typeIndex * 50),
          images: JSON.stringify(['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800']),
          amenities: JSON.stringify(['WiFi', 'TV', 'AC']),
          size: '25 sqm',
          bedType: 'Queen Bed',
          isAvailable: true,
          featured: i <= 24
        }
      });
    }
    console.log('✅ Created 48 rooms\n');

    // Step 4: Create 5 Restaurants
    console.log('Step 4: Creating 5 restaurants...');
    const restaurants = await Promise.all([
      prisma.restaurant.create({
        data: {
          name: 'Steakhouse 1855',
          cuisine: 'American Steakhouse',
          description: 'Premium steaks and fine dining',
          location: 'Kansas City, MO',
          images: JSON.stringify(['https://images.unsplash.com/photo-1544025162-d76694265947?w=800']),
          priceRange: '$$$',
          rating: 4.7,
          openingHours: JSON.stringify({ monday: '5:00 PM - 10:00 PM' }),
          menu: JSON.stringify([{ name: 'Ribeye', price: 45 }]),
          amenities: JSON.stringify(['WiFi', 'Bar']),
          featured: true,
          isActive: true
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Italian Bistro',
          cuisine: 'Italian',
          description: 'Authentic Italian cuisine',
          location: 'Kansas City, MO',
          images: JSON.stringify(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800']),
          priceRange: '$$',
          rating: 4.5,
          openingHours: JSON.stringify({ monday: '11:00 AM - 10:00 PM' }),
          menu: JSON.stringify([{ name: 'Pizza', price: 18 }]),
          amenities: JSON.stringify(['WiFi']),
          featured: true,
          isActive: true
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Sushi Palace',
          cuisine: 'Japanese',
          description: 'Fresh sushi',
          location: 'Independence, MO',
          images: JSON.stringify(['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800']),
          priceRange: '$$$',
          rating: 4.8,
          openingHours: JSON.stringify({ monday: '12:00 PM - 9:00 PM' }),
          menu: JSON.stringify([{ name: 'Sushi', price: 35 }]),
          amenities: JSON.stringify(['WiFi']),
          featured: true,
          isActive: true
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'Breakfast Corner',
          cuisine: 'American Breakfast',
          description: 'All-day breakfast',
          location: 'Kansas City, MO',
          images: JSON.stringify(['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800']),
          priceRange: '$',
          rating: 4.3,
          openingHours: JSON.stringify({ monday: '6:00 AM - 2:00 PM' }),
          menu: JSON.stringify([{ name: 'Pancakes', price: 12 }]),
          amenities: JSON.stringify(['WiFi']),
          featured: false,
          isActive: true
        }
      }),
      prisma.restaurant.create({
        data: {
          name: 'BBQ Smokehouse',
          cuisine: 'BBQ',
          description: 'Kansas City BBQ',
          location: 'Independence, MO',
          images: JSON.stringify(['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800']),
          priceRange: '$$',
          rating: 4.6,
          openingHours: JSON.stringify({ monday: '11:00 AM - 9:00 PM' }),
          menu: JSON.stringify([{ name: 'Brisket', price: 22 }]),
          amenities: JSON.stringify(['Parking']),
          featured: false,
          isActive: true
        }
      })
    ]);
    console.log('✅ Created 5 restaurants\n');

    // Step 5: Create 6 Deals
    console.log('Step 5: Creating 6 deals...');
    const deals = await Promise.all([
      prisma.deal.create({
        data: {
          title: 'Early Bird Breakfast',
          description: '30% off breakfast',
          type: 'dining',
          discount: 30,
          originalPrice: 25,
          dealPrice: 17.50,
          images: JSON.stringify(['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800']),
          terms: 'Valid Monday-Friday',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-01-31'),
          location: 'Both',
          featured: true,
          isActive: true,
          maxRedemptions: 100,
          currentRedemptions: 15
        }
      }),
      prisma.deal.create({
        data: {
          title: 'Weekend Spa Package',
          description: 'Spa treatment',
          type: 'spa',
          discount: 25,
          originalPrice: 200,
          dealPrice: 150,
          images: JSON.stringify(['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800']),
          terms: 'Weekends only',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-03-31'),
          location: 'Kansas City, MO',
          featured: true,
          isActive: true,
          maxRedemptions: 50,
          currentRedemptions: 8
        }
      }),
      prisma.deal.create({
        data: {
          title: 'Family Fun Package',
          description: 'Room upgrade and tickets',
          type: 'package',
          discount: 20,
          originalPrice: 300,
          dealPrice: 240,
          images: JSON.stringify(['https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800']),
          terms: 'For families of 4+',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-06-30'),
          location: 'Both',
          featured: true,
          isActive: true,
          maxRedemptions: 30,
          currentRedemptions: 5
        }
      }),
      prisma.deal.create({
        data: {
          title: 'Romantic Dinner',
          description: '3-course meal',
          type: 'dining',
          discount: 35,
          originalPrice: 120,
          dealPrice: 78,
          images: JSON.stringify(['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800']),
          terms: 'Reservations required',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-02-14'),
          location: 'Kansas City, MO',
          featured: true,
          isActive: true,
          maxRedemptions: 40,
          currentRedemptions: 12
        }
      }),
      prisma.deal.create({
        data: {
          title: 'Golf & Stay',
          description: 'One night with golf',
          type: 'activity',
          discount: 15,
          originalPrice: 250,
          dealPrice: 212.50,
          images: JSON.stringify(['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800']),
          terms: 'Subject to availability',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-09-30'),
          location: 'Independence, MO',
          featured: false,
          isActive: true,
          maxRedemptions: 25,
          currentRedemptions: 3
        }
      }),
      prisma.deal.create({
        data: {
          title: 'Midweek Room Special',
          description: 'Save on rooms',
          type: 'room',
          discount: 40,
          originalPrice: 150,
          dealPrice: 90,
          images: JSON.stringify(['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800']),
          terms: 'Tuesday-Thursday only',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-12-31'),
          location: 'Both',
          featured: false,
          isActive: true,
          maxRedemptions: 200,
          currentRedemptions: 45
        }
      })
    ]);
    console.log('✅ Created 6 deals\n');

    // Step 6: Create 4 Packages
    console.log('Step 6: Creating 4 packages...');
    const packages = await Promise.all([
      prisma.package.create({
        data: {
          name: 'Romantic Escape',
          description: '2 nights in deluxe suite',
          includes: JSON.stringify(['2 nights', 'Champagne', 'Spa']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']),
          price: 599,
          duration: '2 nights',
          location: 'Kansas City, MO',
          featured: true,
          isActive: true
        }
      }),
      prisma.package.create({
        data: {
          name: 'Family Adventure',
          description: '3 nights with tickets',
          includes: JSON.stringify(['3 nights', 'Tickets', 'Breakfast']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800']),
          price: 899,
          duration: '3 nights',
          location: 'Both',
          featured: true,
          isActive: true
        }
      }),
      prisma.package.create({
        data: {
          name: 'Business Traveler',
          description: 'Extended stay',
          includes: JSON.stringify(['5 nights', 'Meeting room', 'WiFi']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800']),
          price: 749,
          duration: '5 nights',
          location: 'Kansas City, MO',
          featured: true,
          isActive: true
        }
      }),
      prisma.package.create({
        data: {
          name: 'Weekend Getaway',
          description: 'Perfect weekend',
          includes: JSON.stringify(['2 nights', 'Dinner', 'Late checkout']),
          images: JSON.stringify(['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800']),
          price: 399,
          duration: 'Weekend',
          location: 'Independence, MO',
          featured: false,
          isActive: true
        }
      })
    ]);
    console.log('✅ Created 4 packages\n');

    // Step 7: Create 5 Attractions
    console.log('Step 7: Creating 5 attractions...');
    await prisma.attraction.createMany({
      data: [
        {
          title: 'Union Station',
          subtitle: 'Historic Landmark',
          description: 'Beautiful historic train station',
          image: 'https://via.placeholder.com/400x250',
          location: 'Kansas City, MO'
        },
        {
          title: 'Nelson-Atkins Museum',
          subtitle: 'Art Museum',
          description: 'World-class art collection',
          image: 'https://via.placeholder.com/400x250',
          location: 'Kansas City, MO'
        },
        {
          title: 'Harry S. Truman Library',
          subtitle: 'Presidential Library',
          description: 'Presidential history',
          image: 'https://via.placeholder.com/400x250',
          location: 'Independence, MO'
        },
        {
          title: 'Country Club Plaza',
          subtitle: 'Shopping District',
          description: 'Upscale shopping',
          image: 'https://via.placeholder.com/400x250',
          location: 'Kansas City, MO'
        },
        {
          title: 'Independence Square',
          subtitle: 'Historic Downtown',
          description: 'Historic shops and restaurants',
          image: 'https://via.placeholder.com/400x250',
          location: 'Independence, MO'
        }
      ]
    });
    console.log('✅ Created 5 attractions\n');

    // Step 8: Create 7 Room Bookings
    console.log('Step 8: Creating 7 room bookings...');
    const rooms = await prisma.room.findMany({ take: 7 });
    for (let i = 0; i < 7; i++) {
      await prisma.booking.create({
        data: {
          userId: i % 2 === 0 ? johnUser.id : shehroozUser.id,
          roomId: rooms[i].id,
          checkIn: new Date('2025-12-10'),
          checkOut: new Date('2025-12-15'),
          totalPrice: rooms[i].pricePerNight * 5,
          status: i < 3 ? 'confirmed' : i < 5 ? 'pending' : 'cancelled'
        }
      });
    }
    console.log('✅ Created 7 room bookings\n');

    // Step 9: Create 5 Dining Reservations
    console.log('Step 9: Creating 5 dining reservations...');
    for (let i = 0; i < 5; i++) {
      await prisma.diningReservation.create({
        data: {
          userId: i % 2 === 0 ? shehroozUser.id : johnUser.id,
          restaurantId: restaurants[i].id,
          date: new Date('2025-12-15'),
          time: '19:00',
          guests: 2 + i,
          status: i < 3 ? 'confirmed' : 'pending'
        }
      });
    }
    console.log('✅ Created 5 dining reservations\n');

    // Step 10: Create 8 Deal Redemptions
    console.log('Step 10: Creating 8 deal redemptions...');
    for (let i = 0; i < 8; i++) {
      await prisma.dealRedemption.create({
        data: {
          userId: i % 3 === 0 ? adminUser.id : i % 3 === 1 ? johnUser.id : shehroozUser.id,
          dealId: deals[i % 6].id,
          redemptionCode: `CODE${1000 + i}`,
          status: i < 4 ? 'active' : 'used',
          redeemedAt: i >= 4 ? new Date() : null
        }
      });
    }
    console.log('✅ Created 8 deal redemptions\n');

    // Step 11: Create 4 Package Bookings
    console.log('Step 11: Creating 4 package bookings...');
    for (let i = 0; i < 4; i++) {
      await prisma.packageBooking.create({
        data: {
          userId: i % 2 === 0 ? shehroozUser.id : johnUser.id,
          packageId: packages[i].id,
          startDate: new Date('2025-12-20'),
          guests: 2 + i,
          totalPrice: packages[i].price,
          status: i < 2 ? 'confirmed' : 'pending'
        }
      });
    }
    console.log('✅ Created 4 package bookings\n');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                  SEED COMPLETE!                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('📊 Final Counts:');
    console.log('   • Users: 3');
    console.log('   • Rooms: 48');
    console.log('   • Restaurants: 5');
    console.log('   • Deals: 6');
    console.log('   • Packages: 4');
    console.log('   • Attractions: 5');
    console.log('   • Room Bookings: 7');
    console.log('   • Dining Reservations: 5');
    console.log('   • Deal Redemptions: 8');
    console.log('   • Package Bookings: 4');
    console.log('   📋 TOTAL BOOKINGS: 24\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeFreshSeed();
