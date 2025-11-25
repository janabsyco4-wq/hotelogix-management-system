const ngrok = require('@ngrok/ngrok');
const fs = require('fs');

console.log('\n🔄 Starting ngrok tunnel for AI Model API...\n');

async function startNgrok() {
    try {
        const listener = await ngrok.forward({
            addr: 5002,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });

        const url = listener.url();
        fs.writeFileSync('ngrok-ai-url.txt', url);

        console.log('✅ AI Model ngrok tunnel started!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 AI Model API accessible at:');
        console.log(`🌐 ${url}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`💾 URL saved to: ngrok-ai-url.txt\n`);
    } catch (error) {
        console.error('❌ Failed to start ngrok:', error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping AI ngrok tunnel...');
    process.exit(0);
});

startNgrok();
