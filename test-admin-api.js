// Test admin API endpoint directly
const http = require('http');

console.log('=== ADMIN API TEST ===');

// Test the admin salons API
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/salons',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n=== API RESPONSE ===');
      console.log('Success:', result.success);
      console.log('Data Length:', result.data ? result.data.length : 0);
      
      if (result.success && result.data) {
        console.log('\n=== PENDING SALONS FROM API ===');
        const pending = result.data.filter(s => s.status === 'pending');
        console.log('Pending Count:', pending.length);
        
        pending.forEach((salon, index) => {
          console.log(`${index + 1}. ${salon.salonName} - ${salon.email}`);
        });
        
        console.log('\n=== ALL SALONS FROM API ===');
        result.data.forEach((salon, index) => {
          console.log(`${index + 1}. ${salon.salonName} (${salon.status}) - ${salon.gender}`);
        });
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
