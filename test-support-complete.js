// Complete support system test
// Run with: node test-support-complete.js

const mongoose = require('mongoose');
const http = require('http');

console.log('=== COMPLETE SUPPORT SYSTEM TEST ===');

// Test 1: Database Connection
console.log('\n🔍 TEST 1: DATABASE CONNECTION');
try {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booknglow';
  console.log('MongoDB URI:', MONGODB_URI);
  
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Database connected successfully');
  
  // Test SupportMessage model
  const SupportMessage = require('./src/models/SupportMessage.js').default;
  console.log('✅ SupportMessage model loaded');
  
  // Test creating a support message
  const testMessage = new SupportMessage({
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    subject: '[Booking Issues] Test booking problem',
    message: 'Category: Booking Issues\n\nThis is a test message.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
    category: 'booking',
    status: 'pending',
    priority: 'medium'
  });
  
  console.log('📝 Creating test message...');
  const savedMessage = await testMessage.save();
  console.log('✅ Test message saved to database');
  console.log('✅ Message ID:', savedMessage._id);
  console.log('✅ Message status:', savedMessage.status);
  
  // Test fetching messages
  const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
  console.log('✅ Total messages in database:', messages.length);
  console.log('✅ Latest message:', messages[0]?.subject);
  
  await mongoose.disconnect();
  console.log('✅ Database disconnected');
  
} catch (error) {
  console.error('❌ Database test failed:', error.message);
  console.error('❌ Error details:', error);
}

// Test 2: API Endpoint
console.log('\n🔍 TEST 2: API ENDPOINT');
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  subject: '[Booking Issues] Test booking problem',
  message: 'Category: Booking Issues\n\nThis is a test message.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210',
  category: 'booking',
  subject: 'Test booking problem',
  message: 'This is a test message.',
  createdAt: new Date()
};

const postData = JSON.stringify(testData);

console.log('📤 Sending test data to API...');
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
  console.log('\n📥 API Response:');
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n📊 Parsed Response:');
      console.log('Success:', parsed.success);
      console.log('Message:', parsed.message);
      
      if (parsed.data) {
        console.log('Data ID:', parsed.data.id);
        console.log('Data Status:', parsed.data.status);
      }
      
      if (parsed.success) {
        console.log('\n✅ API TEST PASSED!');
        console.log('✅ Support request submitted successfully');
        console.log('✅ Check admin dashboard at /admin/support');
      } else {
        console.log('\n❌ API TEST FAILED!');
        console.log('❌ Error:', parsed.message);
      }
    } catch (e) {
      console.log('\n❌ Failed to parse response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ API REQUEST ERROR:', e.message);
  console.error('❌ Make sure server is running on localhost:3000');
  console.error('❌ Run: npm run dev');
});

req.write(postData);
req.end();

console.log('\n=== TEST INSTRUCTIONS ===');
console.log('1. Make sure MongoDB is running');
console.log('2. Make sure Next.js server is running (npm run dev)');
console.log('3. Check database connection string in .env');
console.log('4. Check SupportMessage model exports');
console.log('5. Check API route implementation');
console.log('6. Check admin dashboard at /admin/support');
console.log('\n=== EXPECTED RESULTS ===');
console.log('✅ Database connection successful');
console.log('✅ Test message saved to database');
console.log('✅ API returns success response');
console.log('✅ Admin dashboard shows new message');
console.log('✅ Complete end-to-end flow working');
