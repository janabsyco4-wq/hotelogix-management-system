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

console.log('🔧 Fixing ID parameters for MongoDB...\n');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace parseInt(id) with String(id) for MongoDB ObjectIds
    content = content.replace(/parseInt\(id\)/g, 'String(id)');
    content = content.replace(/parseInt\(req\.params\.id\)/g, 'String(req.params.id)');
    content = content.replace(/parseInt\(roomId\)/g, 'String(roomId)');
    content = content.replace(/parseInt\(userId\)/g, 'String(userId)');
    content = content.replace(/parseInt\(restaurantId\)/g, 'String(restaurantId)');
    content = content.replace(/parseInt\(dealId\)/g, 'String(dealId)');
    content = content.replace(/parseInt\(packageId\)/g, 'String(packageId)');
    content = content.replace(/parseInt\(bookingId\)/g, 'String(bookingId)');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${file}`);
    } else {
      console.log(`⏭️  Skipped ${file} (no changes needed)`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log('\n🎉 All ID parameters fixed for MongoDB!');
console.log('💡 Restart your server for changes to take effect');
