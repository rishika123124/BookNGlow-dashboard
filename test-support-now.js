// Quick test for support form
// Run with: node test-support-now.js

console.log('=== QUICK SUPPORT FORM TEST ===');

const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: '[Booking Issues] Test booking problem',
  message: 'Category: Booking Issues\n\nI need help with my booking. Please assist.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
  category: 'booking',
  subject: 'Test booking problem',
  message: 'I need help with my booking. Please assist.',
  createdAt: new Date()
};

console.log('Test data prepared:');
console.log('Name:', testData.name);
console.log('Email:', testData.email);
console.log('Subject:', testData.subject);
console.log('Message:', testData.message);
console.log('Category:', testData.category);
console.log('Created At:', testData.createdAt);

const http = require('http');
const postData = JSON.stringify(testData);

console.log('\n=== SENDING TO API ===');
console.log('POST /api/support');
console.log('Content-Type: application/json');
console.log('Body length:', postData.length);

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
  console.log('Status Code:', res.statusCode);
  console.log('Status Message:', res.statusCode === 200 ? 'OK' : 'ERROR');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    
    try {
      const parsed = JSON.parse(data);
      
      console.log('\n=== PARSED RESPONSE ===');
      console.log('Success:', parsed.success);
      console.log('Message:', parsed.message);
      
      if (parsed.success) {
        console.log('\n✅ SUCCESS!');
        console.log('✅ Support request submitted successfully');
        console.log('✅ Message ID:', parsed.data?.id);
        console.log('✅ Status:', parsed.data?.status);
        console.log('✅ Check admin dashboard: /admin/support');
        
        console.log('\n🎉 EXPECTED USER ALERT:');
        console.log('✅ Support Request Submitted Successfully!');
        console.log('Your support request has been submitted successfully. Our team will contact you soon.');
        console.log('Message ID:', parsed.data?.id);
        console.log('Check admin dashboard to see your message.');
        
      } else {
        console.log('\n❌ ERROR!');
        console.log('❌ Error message:', parsed.message);
      }
    } catch (e) {
      console.log('\n❌ JSON PARSE ERROR:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ REQUEST ERROR:', e.message);
  console.error('❌ Make sure server is running: npm run dev');
  console.error('❌ Check port 3000 is available');
});

req.write(postData);
req.end();

console.log('\n=== WAITING FOR RESPONSE ===');
console.log('Request sent. Waiting for server response...');
