const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMoreRooms() {
  console.log('🏨 Adding 5 more rooms to reach 48 total...\n');

  const newRooms = [
    {
      roomNumber: '113',
      type: 'Standard Room',
      title: 'Budget Standard Room',
      description: 'Affordable standard room with essential amenities for budget-conscious travelers.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 99.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Cable TV', 'Coffee Maker']),
      size: '20 sqm',
      bedType: 'Double Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '407',
      type: 'Junior Suite',
      title: 'Boutique Junior Suite',
      description: 'Stylish junior suite with unique decor and modern amenities.',
      location: 'Kansas City, MO',
      capacity: 3,
      pricePerNight: 209.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Bar', 'Premium Coffee', 'Seating Area', 'Bathrobe']),
      size: '45 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '408',
      type: 'Business Room',
      title: 'Premium Business Room',
      description: 'Top-tier business room with advanced work facilities and premium amenities.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 169.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Ergonomic Chair', 'Printer Access', 'Meeting Room Access', 'Business Lounge']),
      size: '33 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '314',
      type: 'Family Suite',
      title: 'Ultimate Family Suite',
      description: 'The largest family suite with entertainment center and multiple bedrooms.',
      location: 'Independence, MO',
      capacity: 8,
      pricePerNight: 239.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Kitchen', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack', 'Dining Area', 'Entertainment Center']),
      size: '70 sqm',
      bedType: 'King Bed + Twin Beds + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '409',
      type: 'Deluxe Room',
      title: 'Signature Deluxe Room',
      description: 'Premium deluxe room with signature amenities and elegant furnishings.',
      location: 'Kansas City, MO',
      capacity: 4,
      pricePerNight: 194.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding', 'Bathrobe', 'City View']),
      size: '39 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
  ];

  try {
    for (const room of newRooms) {
      const created = await prisma.room.create({ data: room });
      console.log(`✅ Added: ${created.roomNumber} - ${created.title}`);
    }

    console.log('\n📊 Final Room Count:');
    const total = await prisma.room.count();
    console.log(`   Total Rooms: ${total}`);

    const kc = await prisma.room.count({ where: { location: 'Kansas City, MO' } });
    const ind = await prisma.room.count({ where: { location: 'Independence, MO' } });
    console.log(`   Kansas City: ${kc}`);
    console.log(`   Independence: ${ind}`);

    console.log('\n✅ Successfully added 5 more rooms!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreRooms();
