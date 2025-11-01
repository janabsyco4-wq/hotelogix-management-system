const ngrok = require('@ngrok/ngrok');

let listener = null;
let isShuttingDown = false;

async function startTunnel() {
    try {
        console.log('🔄 Starting ngrok tunnel...');
        
        listener = await ngrok.forward({
            addr: 5000,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
            authtoken_from_env: false
        });

        const url = listener.url();

        console.log('\n✅ Ngrok tunnel started successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 Your backend is now accessible at:');
        console.log('🌐 ' + url);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📋 Next steps:');
        console.log('1. Copy the URL above');
        console.log('2. Update Vercel: REACT_APP_API_URL = ' + url);
        console.log('3. Redeploy your frontend on Vercel');
        console.log('\n⚠️  Keep this terminal open! Closing it will stop the tunnel.');
        console.log('⏰ Tunnel will stay active as long as this process runs.\n');

        // Test the connection
        setTimeout(async () => {
            try {
                const response = await fetch(url + '/api/health');
                if (response.ok) {
                    console.log('✅ Backend connection verified!');
                } else {
                    console.log('⚠️  Backend responded but with error:', response.status);
                }
            } catch (error) {
                console.log('⚠️  Could not verify backend connection:', error.message);
            }
        }, 2000);

    } catch (error) {
        console.error('❌ Error starting ngrok:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
async function shutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    console.log('\n\n🛑 Stopping ngrok tunnel...');
    try {
        if (listener) {
            await listener.close();
            console.log('✅ Tunnel closed successfully');
        }
    } catch (error) {
        console.error('Error closing tunnel:', error.message);
    }
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', () => {
    if (!isShuttingDown) {
        console.log('\n⚠️  Process exiting unexpectedly');
    }
});

// Start the tunnel
startTunnel();

// Keep process alive
setInterval(() => {
    // Just keep the process running
}, 10000);
