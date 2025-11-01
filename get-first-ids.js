const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getFirstIds() {
    const room = await prisma.room.findFirst();
    const restaurant = await prisma.restaurant.findFirst();
    const deal = await prisma.deal.findFirst();
    const pkg = await prisma.package.findFirst();

    console.log('First Record IDs:');
    console.log('Room ID:', room.id);
    console.log('Restaurant ID:', restaurant.id);
    console.log('Deal ID:', deal.id);
    console.log('Package ID:', pkg.id);

    await prisma.$disconnect();
}

getFirstIds();
