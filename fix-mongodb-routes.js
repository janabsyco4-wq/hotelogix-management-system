const fs = require('fs');
const path = require('path');

const routesDir = './server/routes';
const files = [
  'rooms.js',
  'restaurants.js',
  'packages.js',
  'deals.js',
  'bookings.js',
  'recommendations.js'
];

console.log('🔧 Fixing MongoDB routes - removing JSON.parse calls...\n');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove JSON.parse for images
    content = content.replace(/JSON\.parse\((\w+)\.images\s*\|\|\s*'\[\]'\)/g, '$1.images');
    content = content.replace(/JSON\.parse\((\w+)\.images\)/g, '$1.images');
    
    // Remove JSON.parse for amenities
    content = content.replace(/JSON\.parse\((\w+)\.amenities\s*\|\|\s*'\[\]'\)/g, '$1.amenities');
    content = content.replace(/JSON\.parse\((\w+)\.amenities\)/g, '$1.amenities');
    
    // Remove JSON.parse for includes (packages)
    content = content.replace(/JSON\.parse\((\w+)\.includes\s*\|\|\s*'\[\]'\)/g, '$1.includes');
    content = content.replace(/JSON\.parse\((\w+)\.includes\)/g, '$1.includes');
    
    // Remove JSON.parse for menu (restaurants)
    content = content.replace(/JSON\.parse\((\w+)\.menu\s*\|\|\s*'\[\]'\)/g, '$1.menu');
    content = content.replace(/JSON\.parse\((\w+)\.menu\)/g, '$1.menu');
    
    // Keep openingHours as is (it's a string in MongoDB)
    
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

console.log('\n🎉 All routes fixed for MongoDB!');
console.log('💡 Restart your server for changes to take effect');
