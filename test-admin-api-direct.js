// Direct test of admin API to find the issue
const http = require('http');

console.log('=== DIRECT ADMIN API TEST ===');

// Test 1: Check if server is running
console.log('\n1. Testing server connection...');
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
      console.log('\n2. API Response Analysis:');
      console.log('Success:', result.success);
      console.log('Data Type:', typeof result.data);
      console.log('Data Length:', result.data ? result.data.length : 'undefined');
      
      if (result.success && result.data) {
        console.log('\n3. Salon Analysis:');
        const pending = result.data.filter(s => s.status === 'pending');
        const approved = result.data.filter(s => s.status === 'approved');
        const rejected = result.data.filter(s => s.status === 'rejected');
        
        console.log('Total Salons:', result.data.length);
        console.log('Pending:', pending.length);
        console.log('Approved:', approved.length);
        console.log('Rejected:', rejected.length);
        
        console.log('\n4. Pending Salons List:');
        pending.forEach((salon, index) => {
          console.log(`${index + 1}. ${salon.salonName} - ${salon.email}`);
        });
        
        console.log('\n5. Data Structure Check:');
        console.log('First salon keys:', Object.keys(result.data[0] || {}));
        console.log('First salon sample:', JSON.stringify(result.data[0] || {}, null, 2));
      } else {
        console.log('\n❌ API Error:');
        console.log('Error:', result.message);
      }
    } catch (error) {
      console.error('\n❌ Parse Error:', error);
      console.log('Raw Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Request Error:', error);
  if (error.code === 'ECONNREFUSED') {
    console.log('\n🔥 SERVER NOT RUNNING!');
    console.log('Please start the server: npm run dev');
  }
});

req.end();

console.log('\n⏳ Waiting for response...');
