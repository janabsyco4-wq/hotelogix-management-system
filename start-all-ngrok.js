const ngrok = require('@ngrok/ngrok');
const fs = require('fs');

console.log('\n🔄 Starting all ngrok tunnels...\n');

async function startAllTunnels() {
    try {
        // Backend tunnel (port 5000)
        console.log('📡 Starting backend tunnel...');
        const backendListener = await ngrok.forward({
            addr: 5000,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });
        const backendUrl = backendListener.url();
        fs.writeFileSync('ngrok-backend-url.txt', backendUrl);
        console.log(`✅ Backend: ${backendUrl}\n`);

        // AI Model tunnel (port 5002)
        console.log('📡 Starting AI Model tunnel...');
        const aiListener = await ngrok.forward({
            addr: 5002,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });
        const aiUrl = aiListener.url();
        fs.writeFileSync('ngrok-ai-url.txt', aiUrl);
        console.log(`✅ AI Model: ${aiUrl}\n`);

        // Chatbot tunnel (port 5001)
        console.log('📡 Starting Chatbot tunnel...');
        const chatbotListener = await ngrok.forward({
            addr: 5001,
            authtoken: '34tY80VDLr1vFKO0GBoXKaTfTMe_4R888vLczaDELkRUu5Qiz',
        });
        const chatbotUrl = chatbotListener.url();
        fs.writeFileSync('ngrok-chatbot-url.txt', chatbotUrl);
        console.log(`✅ Chatbot: ${chatbotUrl}\n`);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 ALL TUNNELS RUNNING!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n📋 Update your client/.env with:\n`);
        console.log(`REACT_APP_API_URL=${backendUrl}`);
        console.log(`REACT_APP_AI_MODEL_URL=${aiUrl}`);
        console.log(`REACT_APP_CHATBOT_URL=${chatbotUrl}`);
        console.log('\n⚠️  Keep this process running!\n');

    } catch (error) {
        console.error('❌ Failed to start tunnels:', error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping all ngrok tunnels...');
    process.exit(0);
});

startAllTunnels();
