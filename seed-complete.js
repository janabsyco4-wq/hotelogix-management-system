const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting COMPLETE database seed...\n');

    // Get or create users
    let adminUser = await prisma.user.findUnique({ where: { email: 'admin@hotelogix.com' } });
    let johnUser = await prisma.user.findUnique({ where: { email: 'john@example.com' } });
    let shehroozUser = await prisma.user.findUnique({ where: { email: 'shehrooz@gmail.com' } });

    if (!shehroozUser) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        shehroozUser = await prisma.user.create({
            data: {
                name: 'shehrooz hafeez',
                email: 'shehrooz@gmail.com',
                password: hashedPassword,
                phone: '+1234567890',
                role: 'admin'
            }
        });
        console.log('✅ Created shehrooz user');
    }

    if (!adminUser || !johnUser) {
        console.log('❌ Admin or John user not found. Please run the main seed first.');
        return;
    }

    console.log('✅ Found all required users');

    // Seed Restaurants
    console.log('\n📍 Seeding Restaurants...');
    const restaurants = await prisma.restaurant.createMany({
        data: [
            {
                name: 'Steakhouse 1855',
                cuisine: 'American Steakhouse',
                description: 'Premium steaks and fine dining experience with an extensive wine selection.',
                location: 'Kansas City, MO',
                images: JSON.stringify(['https://images.unsplash.com/photo-1544025162-d76694265947?w=800']),
                priceRange: '$$$',
                rating: 4.7,
                openingHours: JSON.stringify({ monday: '5:00 PM - 10:00 PM', tuesday: '5:00 PM - 10:00 PM' }),
                menu: JSON.stringify([{ name: 'Ribeye Steak', price: 45 }]),
                amenities: JSON.stringify(['WiFi', 'Parking', 'Bar']),
                featured: true,
                isActive: true
            },
            {
                name: 'Italian Bistro',
                cuisine: 'Italian',
                description: 'Authentic Italian cuisine with homemade pasta and wood-fired pizzas.',
                location: 'Kansas City, MO',
                images: JSON.stringify(['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800']),
                priceRange: '$$',
                rating: 4.5,
                openingHours: JSON.stringify({ monday: '11:00 AM - 10:00 PM' }),
                menu: JSON.stringify([{ name: 'Margherita Pizza', price: 18 }]),
                amenities: JSON.stringify(['WiFi', 'Outdoor Seating']),
                featured: true,
                isActive: true
            },
            {
                name: 'Sushi Palace',
                cuisine: 'Japanese',
                description: 'Fresh sushi and traditional Japanese dishes in an elegant setting.',
                location: 'Independence, MO',
                images: JSON.stringify(['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800']),
                priceRange: '$$$',
                rating: 4.8,
                openingHours: JSON.stringify({ monday: '12:00 PM - 9:00 PM' }),
                menu: JSON.stringify([{ name: 'Sushi Platter', price: 35 }]),
                amenities: JSON.stringify(['WiFi', 'Private Dining']),
                featured: true,
                isActive: true
            },
            {
                name: 'Breakfast Corner',
                cuisine: 'American Breakfast',
                description: 'All-day breakfast with pancakes, waffles, and hearty omelets.',
                location: 'Kansas City, MO',
                images: JSON.stringify(['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800']),
                priceRange: '$',
                rating: 4.3,
                openingHours: JSON.stringify({ monday: '6:00 AM - 2:00 PM' }),
                menu: JSON.stringify([{ name: 'Pancake Stack', price: 12 }]),
                amenities: JSON.stringify(['WiFi', 'Family Friendly']),
                featured: false,
                isActive: true
            },
            {
                name: 'BBQ Smokehouse',
                cuisine: 'BBQ',
                description: 'Kansas City style BBQ with slow-smoked meats and homemade sauces.',
                location: 'Independence, MO',
                images: JSON.stringify(['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800']),
                priceRange: '$$',
                rating: 4.6,
                openingHours: JSON.stringify({ monday: '11:00 AM - 9:00 PM' }),
                menu: JSON.stringify([{ name: 'Brisket Plate', price: 22 }]),
                amenities: JSON.stringify(['Parking', 'Takeout']),
                featured: false,
                isActive: true
            }
        ],
    });
    console.log(`✅ Created ${restaurants.count} restaurants`);

    // Get restaurant IDs
    const allRestaurants = await prisma.restaurant.findMany();

    // Seed Dining Reservations
    console.log('\n🍽️ Seeding Dining Reservations...');
    const reservations = await prisma.diningReservation.createMany({
        data: [
            {
                userId: shehroozUser.id,
                restaurantId: allRestaurants[0].id,
                date: new Date('2025-12-15'),
                time: '19:00',
                guests: 2,
                specialRequests: 'Window seat please',
                status: 'pending'
            },
            {
                userId: johnUser.id,
                restaurantId: allRestaurants[1].id,
                date: new Date('2025-12-20'),
                time: '18:30',
                guests: 4,
                status: 'confirmed'
            },
            {
                userId: shehroozUser.id,
                restaurantId: allRestaurants[2].id,
                date: new Date('2025-12-25'),
                time: '20:00',
                guests: 2,
                status: 'confirmed'
            },
            {
                userId: adminUser.id,
                restaurantId: allRestaurants[3].id,
                date: new Date('2025-12-10'),
                time: '08:00',
                guests: 1,
                status: 'confirmed'
            },
            {
                userId: johnUser.id,
                restaurantId: allRestaurants[4].id,
                date: new Date('2025-12-18'),
                time: '12:00',
                guests: 6,
                specialRequests: 'Birthday celebration',
                status: 'pending'
            }
        ],
    });
    console.log(`✅ Created ${reservations.count} dining reservations`);

    // Seed Deals
    console.log('\n🎁 Seeding Deals...');
    const deals = await prisma.deal.createMany({
        data: [
            {
                title: 'Early Bird Breakfast Deal',
                description: 'Get 30% off breakfast when you dine before 9 AM',
                type: 'dining',
                discount: 30,
                originalPrice: 25,
                dealPrice: 17.50,
                images: JSON.stringify(['https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800']),
                terms: 'Valid Monday-Friday only. Cannot be combined with other offers.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-01-31'),
                location: 'Both',
                featured: true,
                isActive: true,
                maxRedemptions: 100,
                currentRedemptions: 15
            },
            {
                title: 'Weekend Spa Package',
                description: 'Relaxing spa treatment with massage and facial',
                type: 'spa',
                discount: 25,
                originalPrice: 200,
                dealPrice: 150,
                images: JSON.stringify(['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800']),
                terms: 'Weekends only. Advance booking required.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-03-31'),
                location: 'Kansas City, MO',
                featured: true,
                isActive: true,
                maxRedemptions: 50,
                currentRedemptions: 8
            },
            {
                title: 'Family Fun Package',
                description: 'Includes room upgrade and attraction tickets',
                type: 'package',
                discount: 20,
                originalPrice: 300,
                dealPrice: 240,
                images: JSON.stringify(['https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800']),
                terms: 'Valid for families of 4 or more.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-06-30'),
                location: 'Both',
                featured: true,
                isActive: true,
                maxRedemptions: 30,
                currentRedemptions: 5
            },
            {
                title: 'Romantic Dinner for Two',
                description: '3-course meal with wine pairing',
                type: 'dining',
                discount: 35,
                originalPrice: 120,
                dealPrice: 78,
                images: JSON.stringify(['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800']),
                terms: 'Reservations required 48 hours in advance.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-02-14'),
                location: 'Kansas City, MO',
                featured: true,
                isActive: true,
                maxRedemptions: 40,
                currentRedemptions: 12
            },
            {
                title: 'Golf & Stay Package',
                description: 'One night stay with 18 holes of golf',
                type: 'activity',
                discount: 15,
                originalPrice: 250,
                dealPrice: 212.50,
                images: JSON.stringify(['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800']),
                terms: 'Subject to tee time availability.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-09-30'),
                location: 'Independence, MO',
                featured: false,
                isActive: true,
                maxRedemptions: 25,
                currentRedemptions: 3
            },
            {
                title: 'Midweek Room Special',
                description: 'Save on room rates Tuesday-Thursday',
                type: 'room',
                discount: 40,
                originalPrice: 150,
                dealPrice: 90,
                images: JSON.stringify(['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800']),
                terms: 'Valid Tuesday-Thursday only. Minimum 2-night stay.',
                validFrom: new Date('2025-11-01'),
                validUntil: new Date('2026-12-31'),
                location: 'Both',
                featured: false,
                isActive: true,
                maxRedemptions: 200,
                currentRedemptions: 45
            }
        ],
    });
    console.log(`✅ Created ${deals.count} deals`);

    // Get deal IDs
    const allDeals = await prisma.deal.findMany();

    // Seed Deal Redemptions
    console.log('\n🎟️ Seeding Deal Redemptions...');
    const redemptions = await prisma.dealRedemption.createMany({
        data: [
            { userId: shehroozUser.id, dealId: allDeals[0].id, redemptionCode: 'BREAK001', status: 'active' },
            { userId: johnUser.id, dealId: allDeals[0].id, redemptionCode: 'BREAK002', status: 'used', redeemedAt: new Date() },
            { userId: shehroozUser.id, dealId: allDeals[1].id, redemptionCode: 'SPA001', status: 'active' },
            { userId: adminUser.id, dealId: allDeals[2].id, redemptionCode: 'FAM001', status: 'active' },
            { userId: johnUser.id, dealId: allDeals[3].id, redemptionCode: 'ROM001', status: 'used', redeemedAt: new Date() },
            { userId: shehroozUser.id, dealId: allDeals[3].id, redemptionCode: 'ROM002', status: 'active' },
            { userId: adminUser.id, dealId: allDeals[4].id, redemptionCode: 'GOLF001', status: 'active' },
            { userId: johnUser.id, dealId: allDeals[5].id, redemptionCode: 'ROOM001', status: 'active' }
        ],
    });
    console.log(`✅ Created ${redemptions.count} deal redemptions`);

    // Seed Packages
    console.log('\n📦 Seeding Packages...');
    const packages = await prisma.package.createMany({
        data: [
            {
                name: 'Romantic Escape',
                description: '2 nights in a deluxe suite with champagne, roses, and couples spa treatment',
                includes: JSON.stringify(['2 nights accommodation', 'Champagne & roses', 'Couples massage', 'Romantic dinner']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800']),
                price: 599,
                duration: '2 nights',
                location: 'Kansas City, MO',
                featured: true,
                isActive: true
            },
            {
                name: 'Family Adventure',
                description: '3 nights with attraction tickets and daily breakfast for the whole family',
                includes: JSON.stringify(['3 nights accommodation', 'Attraction tickets', 'Daily breakfast', 'Kids activities']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800']),
                price: 899,
                duration: '3 nights',
                location: 'Both',
                featured: true,
                isActive: true
            },
            {
                name: 'Business Traveler',
                description: 'Extended stay package with workspace and meeting room access',
                includes: JSON.stringify(['5 nights accommodation', 'Meeting room access', 'High-speed WiFi', 'Daily breakfast']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800']),
                price: 749,
                duration: '5 nights',
                location: 'Kansas City, MO',
                featured: true,
                isActive: true
            },
            {
                name: 'Weekend Getaway',
                description: 'Perfect weekend escape with dining and entertainment',
                includes: JSON.stringify(['2 nights accommodation', 'Dinner for two', 'Late checkout', 'Welcome drinks']),
                images: JSON.stringify(['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800']),
                price: 399,
                duration: 'Weekend',
                location: 'Independence, MO',
                featured: false,
                isActive: true
            }
        ],
    });
    console.log(`✅ Created ${packages.count} packages`);

    // Get package IDs
    const allPackages = await prisma.package.findMany();

    // Seed Package Bookings
    console.log('\n📋 Seeding Package Bookings...');
    const packageBookings = await prisma.packageBooking.createMany({
        data: [
            {
                userId: shehroozUser.id,
                packageId: allPackages[0].id,
                startDate: new Date('2025-12-20'),
                guests: 2,
                totalPrice: 599,
                status: 'confirmed'
            },
            {
                userId: johnUser.id,
                packageId: allPackages[1].id,
                startDate: new Date('2025-12-15'),
                guests: 4,
                totalPrice: 899,
                status: 'pending'
            },
            {
                userId: adminUser.id,
                packageId: allPackages[2].id,
                startDate: new Date('2025-12-10'),
                guests: 1,
                totalPrice: 749,
                status: 'confirmed'
            },
            {
                userId: shehroozUser.id,
                packageId: allPackages[3].id,
                startDate: new Date('2025-12-22'),
                guests: 2,
                totalPrice: 399,
                status: 'confirmed'
            }
        ],
    });
    console.log(`✅ Created ${packageBookings.count} package bookings`);

    console.log('\n✅ Complete seed finished successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Restaurants: ${restaurants.count}`);
    console.log(`   • Dining Reservations: ${reservations.count}`);
    console.log(`   • Deals: ${deals.count}`);
    console.log(`   • Deal Redemptions: ${redemptions.count}`);
    console.log(`   • Packages: ${packages.count}`);
    console.log(`   • Package Bookings: ${packageBookings.count}`);
    console.log(`   • TOTAL NEW RECORDS: ${restaurants.count + reservations.count + deals.count + redemptions.count + packages.count + packageBookings.count}`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
