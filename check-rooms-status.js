const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRoomsStatus() {
    console.log('🏨 Hotelogix Room Status Report');
    console.log('================================\n');

    try {
        // Get total rooms
        const totalRooms = await prisma.room.count();
        console.log(`📊 Total Rooms: ${totalRooms}\n`);

        // Get rooms by location
        const kansasCityRooms = await prisma.room.count({
            where: { location: 'Kansas City, MO' }
        });
        const independenceRooms = await prisma.room.count({
            where: { location: 'Independence, MO' }
        });

        console.log('📍 By Location:');
        console.log(`   Kansas City, MO: ${kansasCityRooms} rooms`);
        console.log(`   Independence, MO: ${independenceRooms} rooms\n`);

        // Get rooms by type
        const roomsByType = await prisma.room.groupBy({
            by: ['type'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        });

        console.log('🏷️  By Room Type:');
        roomsByType.forEach(group => {
            console.log(`   ${group.type}: ${group._count.id} rooms`);
        });
        console.log();

        // Get price range
        const priceStats = await prisma.room.aggregate({
            _min: { pricePerNight: true },
            _max: { pricePerNight: true },
            _avg: { pricePerNight: true }
        });

        console.log('💰 Price Range:');
        console.log(`   Minimum: $${priceStats._min.pricePerNight}`);
        console.log(`   Maximum: $${priceStats._max.pricePerNight}`);
        console.log(`   Average: $${priceStats._avg.pricePerNight.toFixed(2)}\n`);

        // Get availability
        const availableRooms = await prisma.room.count({
            where: { isAvailable: true }
        });
        const featuredRooms = await prisma.room.count({
            where: { featured: true }
        });

        console.log('✅ Availability:');
        console.log(`   Available: ${availableRooms} rooms`);
        console.log(`   Featured: ${featuredRooms} rooms\n`);

        // Get capacity stats
        const capacityStats = await prisma.room.aggregate({
            _min: { capacity: true },
            _max: { capacity: true },
            _avg: { capacity: true }
        });

        console.log('👥 Capacity:');
        console.log(`   Minimum: ${capacityStats._min.capacity} guests`);
        console.log(`   Maximum: ${capacityStats._max.capacity} guests`);
        console.log(`   Average: ${capacityStats._avg.capacity.toFixed(1)} guests\n`);

        // Sample rooms from each location
        console.log('🔍 Sample Rooms:\n');

        const kcSample = await prisma.room.findFirst({
            where: { location: 'Kansas City, MO' }
        });
        console.log(`   Kansas City Sample: ${kcSample.roomNumber} - ${kcSample.title} ($${kcSample.pricePerNight})`);

        const indSample = await prisma.room.findFirst({
            where: { location: 'Independence, MO' }
        });
        console.log(`   Independence Sample: ${indSample.roomNumber} - ${indSample.title} ($${indSample.pricePerNight})\n`);

        console.log('================================');
        console.log('✅ All rooms loaded successfully!');
        console.log('\n🌐 Access Points:');
        console.log('   Frontend: http://localhost:3000');
        console.log('   Backend API: http://localhost:5000/api/rooms');
        console.log('   Prisma Studio: http://localhost:5555');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkRoomsStatus();
