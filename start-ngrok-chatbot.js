const ngrok = require('@ngrok/ngrok');
const fs = require('fs');

console.log('\n🔄 Starting ngrok tunnel for Chatbot API...\n');

async function startNgrok() {
    try {
        const listener = await ngrok.forward({
            addr: 5001,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });

        const url = listener.url();
        fs.writeFileSync('ngrok-chatbot-url.txt', url);

        console.log('✅ Chatbot ngrok tunnel started!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📡 Chatbot API accessible at:');
        console.log(`🌐 ${url}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`💾 URL saved to: ngrok-chatbot-url.txt\n`);
    } catch (error) {
        console.error('❌ Failed to start ngrok:', error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping Chatbot ngrok tunnel...');
    process.exit(0);
});

startNgrok();
