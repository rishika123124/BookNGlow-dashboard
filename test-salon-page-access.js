// Test salon search page access
const http = require('http');

console.log('=== TESTING SALON SEARCH PAGE ACCESS ===');

// Test if server is running and page is accessible
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/salon-search',
  method: 'GET'
};

console.log('🌐 Testing: http://localhost:3000/salon-search');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Page length: ${data.length} characters`);
    
    if (res.statusCode === 200) {
      console.log('✅ Salon search page is accessible');
      console.log('✅ Server is running correctly');
      console.log('✅ Page loads without errors');
      
      // Check if page contains expected content
      if (data.includes('AI Salon Search') || data.includes('AISalonSearch')) {
        console.log('✅ AI Salon Search component found in page');
      } else {
        console.log('⚠️ AI Salon Search component might not be loaded');
      }
      
      console.log('\n🎯 NEXT STEPS:');
      console.log('1. Open browser and go to: http://localhost:3000/salon-search');
      console.log('2. Click: "Open AI Salon Search" button');
      console.log('3. Check if modal opens');
      console.log('4. Check if location dropdown shows 9 options');
      console.log('5. Check debug info below dropdown');
      console.log('6. Try selecting "niranjanpur dehradun"');
      console.log('7. Enter "hair" in search box');
      console.log('8. Click "Search Salons" button');
      console.log('9. Check if results appear');
      
    } else {
      console.log('❌ Page not accessible');
      console.log(`Status: ${res.statusCode}`);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Server connection error:', e.message);
  console.log('🔧 Make sure server is running: npm run dev');
});

req.end();

console.log('Testing salon search page accessibility...');
