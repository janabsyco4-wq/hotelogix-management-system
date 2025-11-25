const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getRooms() {
  try {
    const rooms = await prisma.room.findMany();
    console.log(JSON.stringify(rooms, null, 2));
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

getRooms();
