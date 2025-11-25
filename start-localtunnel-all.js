const localtunnel = require('localtunnel');
const fs = require('fs');

console.log('\n🔄 Starting localtunnel for all services...\n');
console.log('💡 Localtunnel is FREE and allows multiple tunnels!\n');

let tunnels = [];

async function startTunnels() {
    try {
        // Backend tunnel
        console.log('📡 Starting Backend tunnel (port 5000)...');
        const backendTunnel = await localtunnel({ port: 5000 });
        tunnels.push(backendTunnel);
        console.log(`✅ Backend: ${backendTunnel.url}`);
        fs.writeFileSync('ngrok-backend-url.txt', backendTunnel.url);
        
        // AI Model tunnel
        console.log('📡 Starting AI Model tunnel (port 5002)...');
        const aiTunnel = await localtunnel({ port: 5002 });
        tunnels.push(aiTunnel);
        console.log(`✅ AI Model: ${aiTunnel.url}`);
        fs.writeFileSync('ngrok-ai-url.txt', aiTunnel.url);
        
        // Chatbot tunnel
        console.log('📡 Starting Chatbot tunnel (port 5001)...');
        const chatbotTunnel = await localtunnel({ port: 5001 });
        tunnels.push(chatbotTunnel);
        console.log(`✅ Chatbot: ${chatbotTunnel.url}`);
        fs.writeFileSync('ngrok-chatbot-url.txt', chatbotTunnel.url);
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 ALL TUNNELS ACTIVE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n📋 Update your client/.env with:\n`);
        console.log(`REACT_APP_API_URL=${backendTunnel.url}`);
        console.log(`REACT_APP_AI_MODEL_URL=${aiTunnel.url}`);
        console.log(`REACT_APP_CHATBOT_URL=${chatbotTunnel.url}`);
        console.log('\n⚠️  Keep this process running!\n');
        
        // Handle tunnel errors
        tunnels.forEach((tunnel, index) => {
            tunnel.on('close', () => {
                console.log(`⚠️  Tunnel ${index + 1} closed`);
            });
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Make sure localtunnel is installed:');
        console.log('   npm install localtunnel');
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Closing all tunnels...');
    tunnels.forEach(tunnel => tunnel.close());
    process.exit(0);
});

startTunnels();
