const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countRooms() {
    try {
        const total = await prisma.room.count();
        const byCity = await prisma.room.groupBy({
            by: ['location'],
            _count: true
        });

        console.log(`\n📊 Total Rooms: ${total}`);
        console.log('\n📍 By City:');
        byCity.forEach(city => {
            console.log(`   ${city.location}: ${city._count} rooms`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

countRooms();
