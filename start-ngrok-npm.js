const ngrok = require('@ngrok/ngrok');
const http = require('http');

console.log('\n🔄 Starting ngrok tunnel for backend...\n');
console.log('⏳ Connecting to ngrok...\n');

async function startNgrok() {
    try {
        // Start ngrok tunnel using the npm package
        const listener = await ngrok.forward({
            addr: 5000,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });

        const url = listener.url();

        console.log('✅ Ngrok tunnel started successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 Your backend is now accessible at:');
        console.log(`🌐 ${url}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📋 Next steps:');
        console.log('1. Copy the URL above');
        console.log(`2. Update client/.env: REACT_APP_API_URL=${url}`);
        console.log('3. Restart your frontend');
        console.log('\n⚠️  Keep this process running! Closing it will stop the tunnel.');
        console.log('⏰ Tunnel will stay active as long as this process runs.\n');

        // Keep checking backend connection
        setInterval(() => {
            http.get('http://localhost:5000/api/health', (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ Backend connection verified');
                }
            }).on('error', (err) => {
                console.log('⚠️  Backend connection issue:', err.message);
            });
        }, 60000); // Check every minute

    } catch (error) {
        console.error('❌ Failed to start ngrok:', error.message);
        console.log('\n💡 This error usually means ngrok needs authentication:');
        console.log('   1. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken');
        console.log('   2. Set it as environment variable:');
        console.log('      $env:NGROK_AUTHTOKEN="your_token_here"');
        console.log('   3. Or run: ngrok config add-authtoken YOUR_TOKEN');
        console.log('   4. Then restart this script\n');
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping ngrok tunnel...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Stopping ngrok tunnel...');
    process.exit(0);
});

startNgrok();
