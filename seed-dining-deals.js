const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDiningAndDeals() {
  console.log('🍽️ Seeding Dining and Deals data...\n');

  try {
    // Create Restaurants
    console.log('Adding restaurants...');
    const restaurants = await prisma.restaurant.createMany({
      data: [
        {
          name: 'The Blue Bistro',
          cuisine: 'American Fine Dining',
          description: 'Upscale American cuisine with a modern twist. Features locally sourced ingredients and an extensive wine list.',
          location: 'Kansas City, MO',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
          ]),
          priceRange: '$$$',
          rating: 4.7,
          openingHours: JSON.stringify({
            monday: '5:00 PM - 10:00 PM',
            tuesday: '5:00 PM - 10:00 PM',
            wednesday: '5:00 PM - 10:00 PM',
            thursday: '5:00 PM - 10:00 PM',
            friday: '5:00 PM - 11:00 PM',
            saturday: '5:00 PM - 11:00 PM',
            sunday: '5:00 PM - 9:00 PM'
          }),
          menu: JSON.stringify([
            { name: 'Grilled Ribeye Steak', price: 42.99, category: 'Entrees' },
            { name: 'Pan-Seared Salmon', price: 34.99, category: 'Entrees' },
            { name: 'Lobster Risotto', price: 38.99, category: 'Entrees' },
            { name: 'Caesar Salad', price: 12.99, category: 'Appetizers' }
          ]),
          amenities: JSON.stringify(['WiFi', 'Outdoor Seating', 'Bar', 'Private Dining', 'Valet Parking']),
          featured: true,
          isActive: true
        },
        {
          name: 'Sakura Sushi & Grill',
          cuisine: 'Japanese',
          description: 'Authentic Japanese cuisine featuring fresh sushi, sashimi, and hibachi grills. Traditional atmosphere with modern touches.',
          location: 'Kansas City, MO',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'
          ]),
          priceRange: '$$',
          rating: 4.6,
          openingHours: JSON.stringify({
            monday: '11:30 AM - 2:30 PM, 5:00 PM - 10:00 PM',
            tuesday: '11:30 AM - 2:30 PM, 5:00 PM - 10:00 PM',
            wednesday: '11:30 AM - 2:30 PM, 5:00 PM - 10:00 PM',
            thursday: '11:30 AM - 2:30 PM, 5:00 PM - 10:00 PM',
            friday: '11:30 AM - 2:30 PM, 5:00 PM - 11:00 PM',
            saturday: '12:00 PM - 11:00 PM',
            sunday: '12:00 PM - 9:00 PM'
          }),
          menu: JSON.stringify([
            { name: 'Sushi Platter', price: 28.99, category: 'Sushi' },
            { name: 'Hibachi Chicken', price: 22.99, category: 'Hibachi' },
            { name: 'Ramen Bowl', price: 16.99, category: 'Noodles' },
            { name: 'Edamame', price: 6.99, category: 'Appetizers' }
          ]),
          amenities: JSON.stringify(['WiFi', 'Sake Bar', 'Hibachi Tables', 'Takeout']),
          featured: true,
          isActive: true
        },
        {
          name: 'Mama Mia Trattoria',
          cuisine: 'Italian',
          description: 'Family-style Italian restaurant serving homemade pasta, wood-fired pizzas, and classic Italian dishes.',
          location: 'Independence, MO',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'
          ]),
          priceRange: '$$',
          rating: 4.5,
          openingHours: JSON.stringify({
            monday: '11:00 AM - 9:00 PM',
            tuesday: '11:00 AM - 9:00 PM',
            wednesday: '11:00 AM - 9:00 PM',
            thursday: '11:00 AM - 9:00 PM',
            friday: '11:00 AM - 10:00 PM',
            saturday: '11:00 AM - 10:00 PM',
            sunday: '12:00 PM - 9:00 PM'
          }),
          menu: JSON.stringify([
            { name: 'Spaghetti Carbonara', price: 18.99, category: 'Pasta' },
            { name: 'Margherita Pizza', price: 16.99, category: 'Pizza' },
            { name: 'Chicken Parmigiana', price: 21.99, category: 'Entrees' },
            { name: 'Bruschetta', price: 9.99, category: 'Appetizers' }
          ]),
          amenities: JSON.stringify(['WiFi', 'Outdoor Patio', 'Wine Selection', 'Family Friendly']),
          featured: false,
          isActive: true
        },
        {
          name: 'The Morning Brew Café',
          cuisine: 'Café & Breakfast',
          description: 'Cozy café serving breakfast all day, specialty coffees, fresh pastries, and light lunch options.',
          location: 'Independence, MO',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop'
          ]),
          priceRange: '$',
          rating: 4.4,
          openingHours: JSON.stringify({
            monday: '6:00 AM - 3:00 PM',
            tuesday: '6:00 AM - 3:00 PM',
            wednesday: '6:00 AM - 3:00 PM',
            thursday: '6:00 AM - 3:00 PM',
            friday: '6:00 AM - 3:00 PM',
            saturday: '7:00 AM - 4:00 PM',
            sunday: '7:00 AM - 4:00 PM'
          }),
          menu: JSON.stringify([
            { name: 'Avocado Toast', price: 11.99, category: 'Breakfast' },
            { name: 'Pancake Stack', price: 9.99, category: 'Breakfast' },
            { name: 'Cappuccino', price: 4.99, category: 'Beverages' },
            { name: 'Club Sandwich', price: 12.99, category: 'Lunch' }
          ]),
          amenities: JSON.stringify(['WiFi', 'Outdoor Seating', 'Takeout', 'Vegan Options']),
          featured: false,
          isActive: true
        },
        {
          name: 'Steakhouse 1855',
          cuisine: 'Steakhouse',
          description: 'Premium steakhouse offering USDA Prime beef, fresh seafood, and an award-winning wine cellar.',
          location: 'Kansas City, MO',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop'
          ]),
          priceRange: '$$$$',
          rating: 4.8,
          openingHours: JSON.stringify({
            monday: 'Closed',
            tuesday: '5:00 PM - 10:00 PM',
            wednesday: '5:00 PM - 10:00 PM',
            thursday: '5:00 PM - 10:00 PM',
            friday: '5:00 PM - 11:00 PM',
            saturday: '5:00 PM - 11:00 PM',
            sunday: '5:00 PM - 9:00 PM'
          }),
          menu: JSON.stringify([
            { name: 'Filet Mignon', price: 52.99, category: 'Steaks' },
            { name: 'Porterhouse', price: 58.99, category: 'Steaks' },
            { name: 'Lobster Tail', price: 48.99, category: 'Seafood' },
            { name: 'Truffle Fries', price: 14.99, category: 'Sides' }
          ]),
          amenities: JSON.stringify(['WiFi', 'Wine Cellar', 'Private Rooms', 'Valet Parking', 'Live Music']),
          featured: true,
          isActive: true
        }
      ]
    });
    console.log(`✅ Added ${restaurants.count} restaurants\n`);

    // Create Deals
    console.log('Adding deals...');
    const deals = await prisma.deal.createMany({
      data: [
        {
          title: 'Weekend Getaway Special',
          description: 'Book 2 nights and get 25% off your stay! Includes complimentary breakfast and late checkout.',
          type: 'room',
          discount: 25,
          originalPrice: 399.98,
          dealPrice: 299.99,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
          ]),
          terms: 'Valid for weekend stays only. Subject to availability. Cannot be combined with other offers.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2025-12-31'),
          location: 'Both',
          featured: true,
          isActive: true,
          maxRedemptions: 100
        },
        {
          title: 'Dine & Stay Package',
          description: 'One night stay plus $50 dining credit at any of our restaurants. Perfect for food lovers!',
          type: 'package',
          discount: 20,
          originalPrice: 229.99,
          dealPrice: 183.99,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
          ]),
          terms: 'Dining credit valid at participating restaurants. Must be used during stay.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-03-31'),
          location: 'Both',
          featured: true,
          isActive: true,
          maxRedemptions: 50
        },
        {
          title: 'Early Bird Breakfast Deal',
          description: 'Book breakfast at The Morning Brew Café before 8 AM and get 30% off your meal!',
          type: 'dining',
          discount: 30,
          originalPrice: 15.00,
          dealPrice: 10.50,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=600&fit=crop'
          ]),
          terms: 'Valid Monday-Friday, 6 AM - 8 AM only. Dine-in only.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-01-31'),
          location: 'Independence, MO',
          featured: false,
          isActive: true,
          maxRedemptions: 200
        },
        {
          title: 'Sushi Night Special',
          description: 'All-you-can-eat sushi at Sakura for just $39.99 per person. Available Tuesday and Wednesday nights.',
          type: 'dining',
          discount: 35,
          originalPrice: 60.00,
          dealPrice: 39.99,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'
          ]),
          terms: 'Available Tuesday and Wednesday 5 PM - 9 PM. Reservations required.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-02-28'),
          location: 'Kansas City, MO',
          featured: true,
          isActive: true,
          maxRedemptions: 150
        },
        {
          title: 'Family Fun Package',
          description: '2 nights stay + 4 attraction tickets + family dinner. Everything your family needs for a perfect getaway!',
          type: 'package',
          discount: 30,
          originalPrice: 699.99,
          dealPrice: 489.99,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop'
          ]),
          terms: 'Valid for families of 4. Includes 2 adults and 2 children under 12.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-06-30'),
          location: 'Both',
          featured: true,
          isActive: true,
          maxRedemptions: 30
        },
        {
          title: 'Business Traveler Special',
          description: 'Extended stay discount: Book 5+ nights and save 40%. Includes workspace and high-speed WiFi.',
          type: 'room',
          discount: 40,
          originalPrice: 749.95,
          dealPrice: 449.97,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop'
          ]),
          terms: 'Minimum 5 night stay required. Business rooms only.',
          validFrom: new Date('2025-11-01'),
          validUntil: new Date('2026-12-31'),
          location: 'Both',
          featured: false,
          isActive: true,
          maxRedemptions: 75
        }
      ]
    });
    console.log(`✅ Added ${deals.count} deals\n`);

    // Create Packages
    console.log('Adding packages...');
    const packages = await prisma.package.createMany({
      data: [
        {
          name: 'Romantic Escape',
          description: 'Perfect for couples! Includes luxury suite, champagne, couples massage, and romantic dinner.',
          includes: JSON.stringify([
            'Executive Suite for 2 nights',
            'Champagne and chocolates on arrival',
            'Couples spa massage (60 minutes)',
            'Romantic dinner at The Blue Bistro',
            'Late checkout (2 PM)',
            'Rose petal turndown service'
          ]),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
          ]),
          price: 599.99,
          duration: '2 nights',
          location: 'Kansas City, MO',
          featured: true,
          isActive: true
        },
        {
          name: 'Family Adventure',
          description: 'Action-packed family package with accommodations, meals, and attraction tickets.',
          includes: JSON.stringify([
            'Family Suite for 3 nights',
            'Daily breakfast for 4',
            '4 attraction tickets',
            'Family dinner voucher',
            'Kids welcome pack',
            'Board games and activities'
          ]),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop'
          ]),
          price: 799.99,
          duration: '3 nights',
          location: 'Independence, MO',
          featured: true,
          isActive: true
        },
        {
          name: 'Business Executive',
          description: 'Everything a business traveler needs for a productive stay.',
          includes: JSON.stringify([
            'Business Room for 5 nights',
            'Executive lounge access',
            'Daily breakfast',
            'Meeting room (4 hours)',
            'High-speed WiFi',
            'Printing services',
            'Airport shuttle'
          ]),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
          ]),
          price: 899.99,
          duration: '5 nights',
          location: 'Both',
          featured: false,
          isActive: true
        },
        {
          name: 'Culinary Experience',
          description: 'For food enthusiasts! Explore our finest dining options with this gourmet package.',
          includes: JSON.stringify([
            'Deluxe Room for 2 nights',
            'Chef\'s tasting menu at The Blue Bistro',
            'Sushi masterclass at Sakura',
            'Wine tasting experience',
            'Cooking class',
            'Recipe book'
          ]),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'
          ]),
          price: 699.99,
          duration: '2 nights',
          location: 'Kansas City, MO',
          featured: true,
          isActive: true
        }
      ]
    });
    console.log(`✅ Added ${packages.count} packages\n`);

    console.log('✅ Dining and Deals seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Restaurants: ${restaurants.count}`);
    console.log(`   - Deals: ${deals.count}`);
    console.log(`   - Packages: ${packages.count}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDiningAndDeals();
