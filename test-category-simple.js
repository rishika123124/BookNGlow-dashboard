// Simple test for category enum
// Run with: node test-category-simple.js

const http = require('http');

console.log('=== CATEGORY ENUM TEST ===');

// Test single category
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: '[technical] Test subject',
  message: 'Category: technical\n\nThis is a test message.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
  category: 'technical',
  subject: 'Test subject',
  message: 'This is a test message.',
  createdAt: new Date()
};

console.log('Test data:', JSON.stringify(testData, null, 2));

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

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Message:', parsed.message);
      
      if (parsed.success) {
        console.log('✅ SUCCESS! Category enum is working');
        console.log('✅ Message ID:', parsed.data?.id);
      } else {
        console.log('❌ FAILED: ' + parsed.message);
      }
    } catch (e) {
      console.log('❌ Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();

console.log('Request sent. Waiting for response...');
