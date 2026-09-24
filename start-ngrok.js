/**
 * Ngrok Tunnel Starter for Hotelogix Backend
 * 
 * Developer: Shehrooz Hafeez
 * Email: shehroozhafeezpriv@gmail.com
 * Phone: +92 301 4594964
 * Project: Hotelogix - AI-Powered Hotel Management System
 * Year: 2026
 */

const ngrok = require('@ngrok/ngrok');

async function startNgrok() {
  console.log('🚀 Starting ngrok tunnel...');
  console.log('📧 Developer: Shehrooz Hafeez');
  console.log('📞 Contact: +92 301 4594964\n');

  try {
    // Start ngrok tunnel on port 5000
    const listener = await ngrok.forward({
      addr: 5000,
      authtoken_from_env: true, // Uses NGROK_AUTHTOKEN from .env
    });

    const url = listener.url();
    
    console.log('✅ Ngrok tunnel started successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Public URL: ${url}`);
    console.log(`🏠 Local URL:  http://localhost:5000`);
    console.log(`📡 API Health: ${url}/api/health`);
    console.log(`📋 API Docs:   ${url}/api`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Update your frontend .env file with:');
    console.log(`   REACT_APP_API_URL=${url}/api`);
    console.log('\n⚠️  Keep this terminal running to maintain the tunnel');
    console.log('   Press Ctrl+C to stop\n');

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping ngrok tunnel...');
      await listener.close();
      console.log('✅ Tunnel closed. Goodbye!');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error starting ngrok:', error.message);
    
    if (error.message.includes('authtoken')) {
      console.log('\n💡 Setup Instructions:');
      console.log('1. Sign up at: https://dashboard.ngrok.com/signup');
      console.log('2. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken');
      console.log('3. Add to your .env file: NGROK_AUTHTOKEN=your_token_here');
      console.log('4. Restart this script\n');
    }
    
    process.exit(1);
  }
}

// Start ngrok
startNgrok();
