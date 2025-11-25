const ngrok = require('@ngrok/ngrok');
const { exec } = require('child_process');
const fs = require('fs');

console.log('\n🔄 Starting tunnels with multiple services...\n');

async function startTunnels() {
    try {
        // Start ngrok for backend (port 5000)
        console.log('📡 Starting ngrok for Backend (port 5000)...');
        const backendListener = await ngrok.forward({ addr: 5000 });
        const backendUrl = backendListener.url();
        console.log(`✅ Backend: ${backendUrl}`);
        fs.writeFileSync('ngrok-backend-url.txt', backendUrl);
        
        console.log('\n💡 For AI Model and Chatbot, you have these options:');
        console.log('\n1. Upgrade ngrok to paid plan ($8/month) for 3 tunnels');
        console.log('   Visit: https://dashboard.ngrok.com/billing/subscription');
        console.log('\n2. Use localtunnel (free alternative):');
        console.log('   npm install -g localtunnel');
        console.log('   lt --port 5001 --subdomain hotelogix-chatbot');
        console.log('   lt --port 5002 --subdomain hotelogix-ai');
        console.log('\n3. Use Cloudflare Tunnel (free):');
        console.log('   Download: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/');
        console.log('   cloudflared tunnel --url http://localhost:5001');
        console.log('   cloudflared tunnel --url http://localhost:5002');
        console.log('\n4. Deploy Python APIs to free hosting:');
        console.log('   - Render.com (recommended)');
        console.log('   - Railway.app');
        console.log('   - Fly.io');
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Current URLs:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Backend:  ${backendUrl}`);
        console.log(`AI Model: http://localhost:5002 (local only)`);
        console.log(`Chatbot:  http://localhost:5001 (local only)`);
        console.log('\n⚠️  Keep this process running!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Closing tunnel...');
    process.exit(0);
});

startTunnels();
