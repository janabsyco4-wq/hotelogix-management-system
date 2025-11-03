const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Cleaning up duplicates and updating images...\n');

  // 1. Remove duplicate restaurants (keep only Pakistani ones)
  const allRestaurants = await prisma.restaurant.findMany();
  console.log(`Found ${allRestaurants.length} restaurants`);
  
  // Keep only restaurants with Pakistani locations
  const toDelete = allRestaurants.filter(r => 
    !r.location.includes('Lahore') && 
    !r.location.includes('Multan') && 
    !r.location.includes('Okara') && 
    !r.location.includes('Sheikhupura')
  );
  
  for (const restaurant of toDelete) {
    await prisma.restaurant.delete({ where: { id: restaurant.id } });
  }
  console.log(`✅ Removed ${toDelete.length} non-Pakistani restaurants\n`);

  // 2. Update images with relevant Pakistani photos
  
  // Lahore restaurants - traditional Pakistani food
  const lahoreRestaurants = await prisma.restaurant.findMany({
    where: { location: { contains: 'Lahore' } }
  });
  
  for (const restaurant of lahoreRestaurants) {
    const images = JSON.stringify([
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', // Pakistani food
      'https://images.unsplash.com/photo-1596040033229-a0b13b1f8c7e?w=800'  // Restaurant interior
    ]);
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${lahoreRestaurants.length} Lahore restaurants`);

  // Multan restaurants - BBQ/Sajji
  const multanRestaurants = await prisma.restaurant.findMany({
    where: { location: { contains: 'Multan' } }
  });
  
  for (const restaurant of multanRestaurants) {
    const images = JSON.stringify([
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // BBQ
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'  // Grilled meat
    ]);
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${multanRestaurants.length} Multan restaurants`);

  // Okara restaurants - Dhaba style
  const okaraRestaurants = await prisma.restaurant.findMany({
    where: { location: { contains: 'Okara' } }
  });
  
  for (const restaurant of okaraRestaurants) {
    const images = JSON.stringify([
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // Restaurant
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800'  // Food
    ]);
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${okaraRestaurants.length} Okara restaurants`);

  // Sheikhupura restaurants
  const sheikhupuraRestaurants = await prisma.restaurant.findMany({
    where: { location: { contains: 'Sheikhupura' } }
  });
  
  for (const restaurant of sheikhupuraRestaurants) {
    const images = JSON.stringify([
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // Fine dining
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'  // Food platter
    ]);
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${sheikhupuraRestaurants.length} Sheikhupura restaurants\n`);

  // 3. Update deals with relevant images
  const deals = await prisma.deal.findMany();
  
  const dealImages = {
    'Tour': [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', // Travel
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'  // Tourism
    ],
    'Cultural': [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', // Architecture
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'  // Culture
    ],
    'Experience': [
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800', // Nature
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'  // Mountains
    ],
    'Recreation': [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', // Lake
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'  // Beach/Water
    ],
    'Food': [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // Food
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'  // Pizza/Food
    ]
  };
  
  for (const deal of deals) {
    const images = JSON.stringify(dealImages[deal.type] || dealImages['Tour']);
    await prisma.deal.update({
      where: { id: deal.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${deals.length} deals\n`);

  // 4. Update packages with travel images
  const packages = await prisma.package.findMany();
  
  for (const pkg of packages) {
    let images;
    if (pkg.location.includes('Lahore')) {
      images = JSON.stringify([
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', // Historic building
        'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'  // Architecture
      ]);
    } else if (pkg.location.includes('Multan')) {
      images = JSON.stringify([
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800', // Mosque
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800'  // Islamic architecture
      ]);
    } else if (pkg.location.includes('Sheikhupura')) {
      images = JSON.stringify([
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', // Lake
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'  // Nature
      ]);
    } else {
      images = JSON.stringify([
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', // Travel
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'  // Tourism
      ]);
    }
    
    await prisma.package.update({
      where: { id: pkg.id },
      data: { images }
    });
  }
  console.log(`✅ Updated ${packages.length} packages\n`);

  console.log('🎉 Cleanup and image update complete!');
}

cleanup()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
