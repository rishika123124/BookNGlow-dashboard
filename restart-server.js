// Restart server to clear model cache
// Run with: node restart-server.js

console.log('=== RESTARTING SERVER TO CLEAR MODEL CACHE ===');

const { spawn } = require('child_process');

// Kill any existing Node.js processes
console.log('Stopping any existing Node.js processes...');
spawn('taskkill', ['/F', 'IM', 'node.exe'], { stdio: 'ignore' });

// Wait a moment
setTimeout(() => {
  console.log('Starting fresh server...');
  
  // Start the server
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  server.on('close', (code) => {
    console.log(`Server process exited with code: ${code}`);
  });
  
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
  
  console.log('\n=== SERVER RESTARTED ===');
  console.log('✅ Model cache should be cleared');
  console.log('✅ New SupportMessage enum should be loaded');
  console.log('✅ Test support form again');
  console.log('✅ Go to: http://localhost:3000/support');
  
}, 2000);
