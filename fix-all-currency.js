const fs = require('fs');
const path = require('path');

const filesToFix = [
  'client/src/pages/Deals.js',
  'client/src/pages/DealView.js',
  'client/src/pages/DealDetail.js',
  'client/src/pages/RedeemDeal.js',
  'client/src/pages/Packages.js',
  'client/src/pages/PackageView.js',
  'client/src/pages/PackageDetail.js',
  'client/src/pages/RestaurantView.js',
  'client/src/pages/RestaurantDetail.js',
  'client/src/pages/Profile.js',
  'client/src/pages/BookPackage.js'
];

console.log('🔄 Fixing all currency references to PKR...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Replace all ${ price patterns
  const patterns = [
    { find: /\$\{deal\.originalPrice\.toFixed\(2\)\}/g, replace: '₨{deal.originalPrice.toLocaleString(\'en-PK\', {minimumFractionDigits: 0})}' },
    { find: /\$\{deal\.dealPrice\.toFixed\(2\)\}/g, replace: '₨{deal.dealPrice.toLocaleString(\'en-PK\', {minimumFractionDigits: 0})}' },
    { find: /\$\{pkg\.price\.toFixed\(2\)\}/g, replace: '₨{pkg.price.toLocaleString(\'en-PK\', {minimumFractionDigits: 0})}' },
    { find: /\$\{item\.price\.toFixed\(2\)\}/g, replace: '₨{item.price.toLocaleString(\'en-PK\', {minimumFractionDigits: 0})}' },
    { find: /\$\{stats\.totalSpent\?\.toFixed\(2\)/g, replace: '₨{stats.totalSpent?.toLocaleString(\'en-PK\', {minimumFractionDigits: 0})' },
    { find: /\$\{\(deal\.originalPrice - deal\.dealPrice\)\.toFixed\(2\)\}/g, replace: '₨{(deal.originalPrice - deal.dealPrice).toLocaleString(\'en-PK\', {minimumFractionDigits: 0})}' },
  ];
  
  patterns.forEach(pattern => {
    if (pattern.find.test(content)) {
      content = content.replace(pattern.find, pattern.replace);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⏭️  No changes needed: ${file}`);
  }
});

console.log('\n✅ Currency fix complete!');
