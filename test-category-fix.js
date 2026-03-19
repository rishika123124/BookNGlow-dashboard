// Test category enum fix
// Run with: node test-category-fix.js

console.log('=== CATEGORY ENUM FIX TEST ===');

// Test all valid category values
const validCategories = ['booking', 'technical', 'account', 'payment', 'salon', 'other'];
const testMessages = [];

console.log('\n📝 Testing all valid categories...');

for (const category of validCategories) {
  console.log(`\n🧪 Testing category: ${category}`);
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    subject: `[${category}] Test subject`,
    message: `Category: ${category}\n\nThis is a test message for ${category} category.\n\nContact Details:\nEmail: test@example.com\nPhone: 9876543210`,
    category: category,
    subject: 'Test subject',
    message: `This is a test message for ${category} category.`,
    createdAt: new Date()
  };

  console.log('Test data:', JSON.stringify(testData, null, 2));

  // Test with HTTP request
  const http = require('http');
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

  try {
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

    console.log(`✅ Category ${category} - Status: ${response.status}`);
    
    if (response.status === 200 && response.data.success) {
      console.log(`✅ Category ${category} - SUCCESS!`);
      console.log(`✅ Message ID: ${response.data.data?.id}`);
      console.log(`✅ Status: ${response.data.data?.status}`);
      testMessages.push({
        category,
        success: true,
        id: response.data.data?.id,
        status: response.data.data?.status
      });
    } else {
      console.log(`❌ Category ${category} - FAILED!`);
      console.log(`❌ Error: ${response.data?.message || 'Unknown error'}`);
      testMessages.push({
        category,
        success: false,
        error: response.data?.message || 'Unknown error'
      });
    }
  } catch (error) {
    console.log(`❌ Category ${category} - ERROR: ${error.message}`);
    testMessages.push({
      category,
      success: false,
      error: error.message
    });
  }

  // Small delay between requests
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log('\n=== TEST RESULTS ===');
console.log(`Total categories tested: ${testMessages.length}`);
console.log(`Successful categories: ${testMessages.filter(m => m.success).length}`);
console.log(`Failed categories: ${testMessages.filter(m => !m.success).length}`);

console.log('\n📊 Detailed Results:');
testMessages.forEach(msg => {
  const status = msg.success ? '✅' : '❌';
  const details = msg.success ? `ID: ${msg.id}, Status: ${msg.status}` : `Error: ${msg.error}`;
  console.log(`${status} ${msg.category}: ${details}`);
});

console.log('\n=== EXPECTED BEHAVIOR ===');
console.log('✅ All categories should work without validation errors');
console.log('✅ All messages should save to database');
console.log('✅ All messages should appear in admin dashboard');
console.log('✅ All submissions should show success alerts');

const allSuccess = testMessages.every(m => m.success);
if (allSuccess) {
  console.log('\n🎉 ALL TESTS PASSED!');
  console.log('✅ Category enum fix is working correctly');
  console.log('✅ Support form should now work for all categories');
} else {
  console.log('\n❌ SOME TESTS FAILED!');
  console.log('❌ Check the failed categories above');
  console.log('❌ Verify SupportMessage model enum values');
  console.log('❌ Verify support form category options');
}

console.log('\n=== NEXT STEPS ===');
console.log('1. Test support form in browser');
console.log('2. Select each category and submit');
console.log('3. Check for success alerts');
console.log('4. Check admin dashboard for messages');
console.log('5. Verify database entries');
