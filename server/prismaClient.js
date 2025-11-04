const { PrismaClient } = require('@prisma/client');

// Create a single Prisma Client instance with proper configuration
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'minimal',
});

// Handle cleanup on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
