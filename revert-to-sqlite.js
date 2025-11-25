const fs = require('fs');
const path = require('path');

const routesDir = './server/routes';
const files = [
  'rooms.js',
  'restaurants.js',
  'packages.js',
  'deals.js',
  'bookings.js',
  'attractions.js'
];

console.log('🔄 Reverting code changes back to SQLite...\n');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Revert String(id) back to parseInt(id) for SQLite
    content = content.replace(/String\(id\)/g, 'parseInt(id)');
    content = content.replace(/String\(req\.params\.id\)/g, 'parseInt(req.params.id)');
    content = content.replace(/String\(roomId\)/g, 'parseInt(roomId)');
    content = content.replace(/String\(userId\)/g, 'parseInt(userId)');
    content = content.replace(/String\(restaurantId\)/g, 'parseInt(restaurantId)');
    content = content.replace(/String\(dealId\)/g, 'parseInt(dealId)');
    content = content.replace(/String\(packageId\)/g, 'parseInt(packageId)');
    content = content.replace(/String\(bookingId\)/g, 'parseInt(bookingId)');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Reverted ${file}`);
    } else {
      console.log(`⏭️  Skipped ${file} (no changes needed)`);
    }
    
  } catch (error) {
    console.error(`❌ Error reverting ${file}:`, error.message);
  }
});

console.log('\n🎉 All code reverted to SQLite!');
console.log('💡 Restart your server for changes to take effect');
