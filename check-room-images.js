const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
    const room = await prisma.room.findFirst({ where: { id: 87 } });
    console.log('Room 87:');
    console.log('Title:', room.title);
    console.log('Images (raw):', room.images);
    console.log('Images (parsed):', JSON.parse(room.images));
    await prisma.$disconnect();
}

checkImages();
