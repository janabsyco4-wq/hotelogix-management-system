const ngrok = require('@ngrok/ngrok');

(async function () {
    try {
        // Start tunnel with authtoken
        const listener = await ngrok.forward({
            addr: 5000,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz'
        });

        const url = listener.url();

        console.log('\n🎉 Ngrok tunnel started!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 Your backend is now accessible at:');
        console.log('🌐 ' + url);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📋 Next steps:');
        console.log('1. Copy the URL above');
        console.log('2. Update Vercel environment variable REACT_APP_API_URL');
        console.log('3. Redeploy your frontend on Vercel');
        console.log('\n⚠️  Keep this terminal open! Closing it will stop the tunnel.\n');

        // Keep the process running
        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Stopping ngrok tunnel...');
            await listener.close();
            process.exit();
        });

    } catch (error) {
        console.error('❌ Error starting ngrok:', error.message);
        process.exit(1);
    }
})();
