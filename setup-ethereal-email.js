// This script creates a free Ethereal email account for testing
const nodemailer = require('nodemailer');

async function createEtherealAccount() {
  try {
    console.log('🔄 Creating free test email account...\n');
    
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Test email account created!\n');
    console.log('📧 Email Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('EMAIL_USER=' + testAccount.user);
    console.log('EMAIL_PASS=' + testAccount.pass);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 Add these to your .env file:\n');
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASS=${testAccount.pass}\n`);
    
    console.log('🌐 View sent emails at: https://ethereal.email/messages\n');
    console.log('💡 These credentials work forever - save them!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createEtherealAccount();
