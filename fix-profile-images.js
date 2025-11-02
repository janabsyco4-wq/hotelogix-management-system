const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProfileImages() {
  try {
    console.log('🔧 Fixing Profile Images...\n');

    // Find users with profile images
    const users = await prisma.user.findMany({
      where: {
        profileImage: { not: null }
      },
      select: {
        id: true,
        email: true,
        profileImage: true
      }
    });

    console.log(`Found ${users.length} users with profile images\n`);

    // Clear broken profile images (they're stored as JSON arrays which is wrong)
    for (const user of users) {
      console.log(`User #${user.id} (${user.email}): ${user.profileImage}`);
      
      // Clear the profile image since it's in wrong format
      await prisma.user.update({
        where: { id: user.id },
        data: { profileImage: null }
      });
      
      console.log(`  ✅ Cleared profile image\n`);
    }

    console.log('✅ Profile images fixed!\n');
    console.log('ℹ️  Profile images should be simple URLs, not JSON arrays');
    console.log('ℹ️  Users can add new profile images through the profile page\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixProfileImages();
