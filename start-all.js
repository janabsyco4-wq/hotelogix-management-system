const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting all Hotelogix servers...\n');

const servers = [
    { name: 'Backend', cmd: 'npm', args: ['start'], cwd: 'server', color: '\x1b[36m', port: 5000 },
    { name: 'Frontend', cmd: 'npm', args: ['start'], cwd: 'client', color: '\x1b[32m', port: 3000 },
    { name: 'AI Model', cmd: 'python', args: ['recommendation_api.py'], cwd: 'ai-model', color: '\x1b[33m', port: 5002 },
    { name: 'Chatbot', cmd: 'python', args: ['hotelogix_chatbot_api.py'], cwd: 'chatbot', color: '\x1b[35m', port: 5001 }
];

const processes = [];
let startedCount = 0;

servers.forEach((server, index) => {
    setTimeout(() => {
        console.log(`${server.color}▶ Starting ${server.name} on port ${server.port}...\x1b[0m`);
        
        const proc = spawn(server.cmd, server.args, {
            cwd: path.join(__dirname, server.cwd),
            shell: true,
            stdio: 'pipe',
            env: { ...process.env }
        });

        let hasOutput = false;

        proc.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                hasOutput = true;
                console.log(`${server.color}[${server.name}]\x1b[0m ${output}`);
                if (output.includes('Running') || output.includes('started') || output.includes('listening')) {
                    startedCount++;
                    console.log(`${server.color}✅ ${server.name} is ready!\x1b[0m`);
                }
            }
        });

        proc.stderr.on('data', (data) => {
            const output = data.toString().trim();
            if (output && !output.includes('DeprecationWarning')) {
                console.log(`${server.color}[${server.name}]\x1b[0m ${output}`);
            }
        });

        proc.on('error', (error) => {
            console.log(`${server.color}❌ [${server.name}] Error: ${error.message}\x1b[0m`);
        });

        proc.on('close', (code) => {
            console.log(`${server.color}[${server.name}] Stopped (code ${code})\x1b[0m`);
        });

        processes.push({ name: server.name, proc });
    }, index * 2000); // Stagger starts by 2 seconds
});

setTimeout(() => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Server URLs:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Backend:  http://localhost:5000');
    console.log('   Frontend: http://localhost:3000');
    console.log('   AI Model: http://localhost:5002');
    console.log('   Chatbot:  http://localhost:5001');
    console.log('\n⚠️  Press Ctrl+C to stop all servers\n');
}, 10000);

process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping all servers...');
    processes.forEach(({ name, proc }) => {
        console.log(`   Stopping ${name}...`);
        proc.kill('SIGTERM');
    });
    setTimeout(() => process.exit(0), 2000);
});
