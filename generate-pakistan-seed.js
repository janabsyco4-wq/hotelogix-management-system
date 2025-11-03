const fs = require('fs');

// Pakistani cities
const cities = [
  { name: 'Okara', code: 'OK' },
  { name: 'Lahore', code: 'LH' },
  { name: 'Sheikhupura', code: 'SK' },
  { name: 'Multan', code: 'MT' }
];

// Room types with price ranges (in PKR)
const roomTypes = [
  { type: 'Budget Room', priceRange: [2000, 5000], capacity: 2, size: '15-20 sqm', bedType: 'Double Bed', count: 3 },
  { type: 'Economy Room', priceRange: [5000, 10000], capacity: 3, size: '20-25 sqm', bedType: 'Queen Bed', count: 3 },
  { type: 'Standard Room', priceRange: [10000, 15000], capacity: 2, size: '25-30 sqm', bedType: 'King Bed', count: 4 },
  { type: 'Deluxe Room', priceRange: [15000, 25000], capacity: 4, size: '30-40 sqm', bedType: 'King Bed + Sofa Bed', count: 4 },
  { type: 'Business Room', priceRange: [20000, 30000], capacity: 2, size: '28-35 sqm', bedType: 'King Bed', count: 3 },
  { type: 'Junior Suite', priceRange: [25000, 35000], capacity: 3, size: '35-45 sqm', bedType: 'King Bed', count: 3 },
  { type: 'Executive Suite', priceRange: [35000, 50000], capacity: 6, size: '50-65 sqm', bedType: 'King Bed + Sofa Bed', count: 3 },
  { type: 'Family Suite', priceRange: [30000, 45000], capacity: 6, size: '55-70 sqm', bedType: 'King + Twin Beds', count: 3 },
  { type: 'Presidential Suite', priceRange: [50000, 100000], capacity: 8, size: '80-120 sqm', bedType: 'King + Queen Beds', count: 2 },
  { type: 'Royal Suite', priceRange: [100000, 150000], capacity: 10, size: '120-180 sqm', bedType: 'Multiple King Beds', count: 1 }
];

const amenitiesByType = {
  'Budget Room': ['Free WiFi', 'Air Conditioning', 'TV', 'Attached Bathroom', 'Room Service'],
  'Economy Room': ['Free WiFi', 'Air Conditioning', 'LED TV', 'Work Desk', 'Mini Fridge', 'Tea/Coffee Maker'],
  'Standard Room': ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Desk', 'Mini Fridge', 'Safe', 'Premium Bedding'],
  'Deluxe Room': ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding', 'Bathrobe', 'City View'],
  'Business Room': ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Printer Access', 'Business Center', 'Meeting Room Access'],
  'Junior Suite': ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Living Area', 'Mini Bar', 'Premium Coffee', 'Work Station', 'City View'],
  'Executive Suite': ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Separate Living Room', 'Mini Bar', 'Premium Bedding', 'Executive Lounge', 'Butler Service'],
  'Family Suite': ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack', 'Dining Area'],
  'Presidential Suite': ['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge', 'Butler Service', 'Private Terrace'],
  'Royal Suite': ['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Multiple Bedrooms', 'Dining Hall', 'Premium Bedding', 'Panoramic Views', 'Personal Concierge', '24/7 Butler', 'Private Terrace', 'Jacuzzi', 'Home Theater']
};

function generateRooms() {
  const rooms = [];
  let roomCounter = 1;

  cities.forEach(city => {
    roomTypes.forEach(roomType => {
      for (let i = 0; i < roomType.count; i++) {
        const price = Math.floor(Math.random() * (roomType.priceRange[1] - roomType.priceRange[0])) + roomType.priceRange[0];
        const roomNum = `${city.code}-${roomCounter.toString().padStart(3, '0')}`;
        
        rooms.push({
          roomNumber: roomNum,
          type: roomType.type,
          title: `${roomType.type} - ${city.name}`,
          description: `Experience authentic Pakistani hospitality in our ${roomType.type.toLowerCase()} located in ${city.name}. Perfect for ${roomType.capacity <= 2 ? 'solo travelers or couples' : roomType.capacity <= 4 ? 'small families' : 'large families or groups'}.`,
          location: `${city.name}, Punjab`,
          capacity: roomType.capacity,
          pricePerNight: price,
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
          ]),
          amenities: JSON.stringify(amenitiesByType[roomType.type]),
          size: roomType.size,
          bedType: roomType.bedType,
          isAvailable: true,
          featured: roomType.priceRange[0] >= 35000
        });
        roomCounter++;
      }
    });
  });

  return rooms;
}

// Generate seed file
const rooms = generateRooms();

const seedContent = `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Pakistan Hotels database seed...');
  console.log('🇵🇰 Cities: Okara, Lahore, Sheikhupura, Multan');

  const rooms = ${JSON.stringify(rooms, null, 2)};

  // Create rooms
  const createdRooms = [];
  for (const roomData of rooms) {
    const room = await prisma.room.create({ data: roomData });
    createdRooms.push(room);
  }

  // Create Pakistani attractions
  await prisma.attraction.createMany({
    data: [
      {
        title: 'Badshahi Mosque',
        subtitle: 'Historic Mughal Architecture',
        description: 'One of the largest mosques in the world, built in 1671 by Mughal Emperor Aurangzeb. A masterpiece of Mughal architecture.',
        image: 'https://via.placeholder.com/400x250/4A90E6/FFFFFF?text=Badshahi+Mosque',
        location: 'Lahore, Punjab',
      },
      {
        title: 'Lahore Fort (Shahi Qila)',
        subtitle: 'UNESCO World Heritage Site',
        description: 'A magnificent fort complex with stunning palaces, gardens, and museums showcasing centuries of history.',
        image: 'https://via.placeholder.com/400x250/FF8C00/FFFFFF?text=Lahore+Fort',
        location: 'Lahore, Punjab',
      },
      {
        title: 'Shalimar Gardens',
        subtitle: 'Mughal Gardens',
        description: 'Beautiful Mughal gardens built in 1641, featuring terraced levels, fountains, and lush greenery.',
        image: 'https://via.placeholder.com/400x250/008000/FFFFFF?text=Shalimar+Gardens',
        location: 'Lahore, Punjab',
      },
      {
        title: 'Tomb of Shah Rukn-e-Alam',
        subtitle: 'Sufi Shrine',
        description: 'A magnificent mausoleum and one of the most impressive Sufi shrines in Pakistan, built in 1320-1324.',
        image: 'https://via.placeholder.com/400x250/8B0000/FFFFFF?text=Shah+Rukn+Alam',
        location: 'Multan, Punjab',
      },
      {
        title: 'Hiran Minar',
        subtitle: 'Mughal Monument',
        description: 'A unique Mughal-era monument built by Emperor Jahangir, featuring a water tank and beautiful architecture.',
        image: 'https://via.placeholder.com/400x250/4B0082/FFFFFF?text=Hiran+Minar',
        location: 'Sheikhupura, Punjab',
      },
      {
        title: 'Okara Garrison',
        subtitle: 'Military Heritage',
        description: 'Historic military cantonment area with colonial-era architecture and military museums.',
        image: 'https://via.placeholder.com/400x250/2F4F4F/FFFFFF?text=Okara+Garrison',
        location: 'Okara, Punjab',
      },
    ],
  });

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hotelogix.com',
      password: adminPassword,
      phone: '+92-300-1234567',
      role: 'admin',
    },
  });

  // Create sample user
  const sampleUser = await prisma.user.create({
    data: {
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      password: userPassword,
      phone: '+92-321-9876543',
      role: 'user',
    },
  });

  // Create sample bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: sampleUser.id,
        roomId: createdRooms[10].id,
        checkIn: new Date('2025-12-15'),
        checkOut: new Date('2025-12-18'),
        totalPrice: createdRooms[10].pricePerNight * 3,
        status: 'confirmed',
      },
      {
        userId: sampleUser.id,
        roomId: createdRooms[25].id,
        checkIn: new Date('2025-12-20'),
        checkOut: new Date('2025-12-23'),
        totalPrice: createdRooms[25].pricePerNight * 3,
        status: 'pending',
      },
    ],
  });

  console.log('✅ Pakistan Hotels database seeded successfully!');
  console.log('📊 Created:');
  console.log(\`  - \${rooms.length} Rooms across 4 cities\`);
  console.log('  - 6 Pakistani Attractions');
  console.log('  - 1 Admin User (admin@hotelogix.com)');
  console.log('  - 1 Sample User (ahmed@example.com)');
  console.log('  - 2 Sample Bookings');
  console.log('\\n📍 Cities: Okara, Lahore, Sheikhupura, Multan');
  console.log('💰 Price Range: PKR 2,000 - PKR 150,000');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync('prisma/seed-pakistan.js', seedContent);
console.log('✅ Pakistan seed file generated!');
console.log(`📊 Total rooms: ${rooms.length}`);
console.log('🏨 Room types: Budget, Economy, Standard, Deluxe, Business, Junior Suite, Executive Suite, Family Suite, Presidential Suite, Royal Suite');
console.log('🇵🇰 Cities: Okara, Lahore, Sheikhupura, Multan');
console.log('💰 Price range: PKR 2,000 - PKR 150,000');
