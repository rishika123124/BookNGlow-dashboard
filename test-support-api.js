// Simple test script for support API
// Run with: node test-support-api.js

const http = require('http');

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: 'Test Support Message',
  message: 'This is a test support message from script.',
  category: 'Technical Support'
};

const postData = JSON.stringify(testData);

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

console.log('Testing Support API...');
console.log('Test data:', testData);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('Parsed response:', parsed);
    } catch (e) {
      console.log('Failed to parse response:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  console.error('Error details:', e);
});

req.write(postData);
req.end();

console.log('Request sent. Waiting for response...');
