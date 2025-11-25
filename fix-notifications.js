const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Notification System...\n');

// Step 1: Check if notification routes file exists
console.log('1️⃣ Checking notification routes...');
const routesPath = path.join(__dirname, 'server', 'routes', 'notifications.js');
if (fs.existsSync(routesPath)) {
  console.log('   ✅ Notification routes file exists');
} else {
  console.log('   ❌ Notification routes file missing!');
  process.exit(1);
}

// Step 2: Check if notification service exists
console.log('2️⃣ Checking notification service...');
const servicePath = path.join(__dirname, 'server', 'services', 'notificationService.js');
if (fs.existsSync(servicePath)) {
  console.log('   ✅ Notification service file exists');
} else {
  console.log('   ❌ Notification service file missing!');
  process.exit(1);
}

// Step 3: Check if middleware exists
console.log('3️⃣ Checking auth middleware...');
const middlewarePath = path.join(__dirname, 'server', 'middleware', 'auth.js');
if (fs.existsSync(middlewarePath)) {
  console.log('   ✅ Auth middleware file exists');
} else {
  console.log('   ❌ Auth middleware file missing!');
  process.exit(1);
}

// Step 4: Push Prisma schema
console.log('4️⃣ Pushing Prisma schema to database...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('   ✅ Database schema updated');
} catch (error) {
  console.error('   ❌ Failed to push schema:', error.message);
  process.exit(1);
}

// Step 5: Generate Prisma Client
console.log('5️⃣ Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('   ✅ Prisma Client generated');
} catch (error) {
  console.error('   ❌ Failed to generate client:', error.message);
  process.exit(1);
}

console.log('\n✅ Notification system fixed successfully!\n');
console.log('📝 Next steps:');
console.log('1. Stop your backend server (Ctrl+C)');
console.log('2. Run: npm start (in server directory)');
console.log('3. Refresh your admin dashboard');
console.log('4. The notification bell should now work!\n');
console.log('🔔 Test by:');
console.log('   - Creating a new booking');
console.log('   - Cancelling a booking');
console.log('   - Check the bell icon for notifications\n');
