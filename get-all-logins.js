const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllLogins() {
  console.log('🔐 Hotelogix Pakistan - User Login Credentials\n');
  console.log('='.repeat(70));

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        createdAt: true
      },
      orderBy: { role: 'desc' }
    });

    console.log(`\n📊 Total Users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.role === 'admin' ? '👨‍💼 ADMIN' : '👤 USER'} - ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${user.role === 'admin' ? 'admin123' : 'user123'}`);
      console.log(`   📱 Phone: ${user.phone || 'N/A'}`);
      console.log(`   🏙️  City: ${user.city || 'N/A'}`);
      console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    console.log('='.repeat(70));
    console.log('\n🌐 Access URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Login Page: http://localhost:3000/login');
    console.log('   Admin Dashboard: http://localhost:3000/admin');
    console.log('   Database UI: http://localhost:5555');

    console.log('\n📝 Default Passwords:');
    console.log('   Admin accounts: admin123');
    console.log('   User accounts: user123');

    console.log('\n🎯 Quick Login:');
    console.log('   Admin: admin@hotelogix.com / admin123');
    console.log('   User: john@example.com / user123');

    console.log('\n' + '='.repeat(70));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getAllLogins();
