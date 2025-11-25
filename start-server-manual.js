// Manual server starter - bypasses Prisma generation issues
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting backend server manually...\n');

// Set environment to bypass Prisma issues
process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = '1';

// Start the server
const serverPath = path.join(__dirname, 'server', 'index.js');
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  }
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});
