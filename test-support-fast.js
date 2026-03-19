// Fast test for support page
const http = require('http');

console.log('=== FAST SUPPORT TEST ===');

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: '[booking] Test booking issue',
  message: 'Category: booking\n\nI need help with my booking.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
  category: 'booking',
  subject: 'Test booking issue',
  message: 'I need help with my booking.',
  createdAt: new Date()
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
      if (parsed.success) {
        console.log('✅ SUCCESS! Support request submitted');
        console.log('✅ Message ID:', parsed.data?.id);
        console.log('✅ Status:', parsed.data?.status);
        console.log('✅ Check admin dashboard: /admin/support');
      } else {
        console.log('❌ FAILED:', parsed.message);
      }
    } catch (e) {
      console.log('❌ Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();

console.log('Testing support API...');
