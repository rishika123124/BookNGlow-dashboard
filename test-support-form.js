// Test script for support form submission
// Run with: node test-support-form.js

const http = require('http');

console.log('=== TESTING SUPPORT FORM SUBMISSION ===');

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: '[Booking Issues] Test booking problem',
  message: 'Category: Booking Issues\n\nI have a problem with my booking. Please help me.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
  category: 'booking',
  subject: 'Test booking problem',
  message: 'I have a problem with my booking. Please help me.',
  createdAt: new Date()
};

const postData = JSON.stringify(testData);

console.log('Test data:', JSON.stringify(testData, null, 2));

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/support',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log('\n=== API RESPONSE ===');
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n=== PARSED RESPONSE ===');
      console.log('Success:', parsed.success);
      console.log('Message:', parsed.message);
      
      if (parsed.data) {
        console.log('Data:', parsed.data);
      }
      
      if (parsed.success) {
        console.log('\n✅ SUCCESS: Support request submitted successfully!');
        console.log('✅ Check admin dashboard at /admin/support for new message');
      } else {
        console.log('\n❌ ERROR: Support request failed');
        console.log('❌ Error:', parsed.message);
      }
    } catch (e) {
      console.log('\n❌ Failed to parse response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ REQUEST ERROR:', e.message);
  console.error('❌ Make sure the server is running on localhost:3000');
  console.error('❌ Run: npm run dev');
});

req.write(postData);
req.end();

console.log('\n=== REQUEST SENT ===');
console.log('Waiting for response...');
