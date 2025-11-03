const fs = require('fs');
const { execSync } = require('child_process');

console.log('🧹 Cleaning up unnecessary files and preparing for Git...\n');

// Files to delete (temporary/test files)
const filesToDelete = [
  'server/services/emailService-updated.js',
  'server/services/emailService-backup.js',
  'EMAIL_TEMPLATE_STATUS.md',
  'EMAIL_TEMPLATES_FINAL.md',
  'fix-email-templates.js',
  'fix-double-dollar.js',
  'update-email-templates.js',
  'test-send-email.js',
  'check-reservations.js',
  'check-restaurant-data.js',
  'test-restaurant-api.js',
  'seed-dining-reservations.js',
  'GIT_UPDATE_COMPLETE.md',
  'SERVICES_STATUS_REPORT.md',
  'NGROK_SETUP.md',
  'FINAL_STATUS.md',
  'FINAL_DEPLOYMENT_STATUS.md',
  'SYSTEM_READY.md',
  'ENHANCED_ANALYTICS_GUIDE.md',
  'IMAGE_UPDATE_SUMMARY.md',
  'SYSTEM_STATUS.md'
];

// Delete unnecessary files
let deletedCount = 0;
filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    }
  } catch (error) {
    console.log(`⚠️  Could not delete ${file}: ${error.message}`);
  }
});

console.log(`\n🗑️  Deleted ${deletedCount} unnecessary files\n`);

// Keep these important files
console.log('📝 Keeping important files:');
const keepFiles = [
  'README.md',
  'FEATURE_ROADMAP.md',
  'test-all-apis.js',
  'test-authenticated-apis.js',
  'test-backend-complete.js',
  'test-frontend-navigation.md',
  'fix-all-currency.js',
  'seed-pakistan-extras.js',
  'cleanup-and-update.js',
  'update-city-images.js',
  'generate-realistic-analytics.js',
  'generate-pakistan-seed.js',
  'update-frontend-pakistan.js',
  'start-ngrok-npm.js'
];

keepFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  }
});

console.log('\n📦 Preparing Git commit...\n');

try {
  // Check git status
  console.log('📊 Git Status:');
  const status = execSync('git status --short', { encoding: 'utf-8' });
  console.log(status || '  No changes detected');

  console.log('\n✅ Cleanup complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Review changes: git status');
  console.log('  2. Add files: git add .');
  console.log('  3. Commit: git commit -m "Pakistani localization complete - All features working"');
  console.log('  4. Push: git push origin main');

} catch (error) {
  console.log('⚠️  Git commands not available or not in a git repository');
  console.log('   You can manually run git commands after cleanup');
}

console.log('\n🎉 Cleanup complete!');
