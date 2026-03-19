// Test AI Salon Search API
const http = require('http');

console.log('=== AI SALON SEARCH API TEST ===');

// Test 1: Search by salon name
console.log('\n🧪 Test 1: Search by salon name');
const test1 = {
  location: 'Delhi',
  searchQuery: 'hair'
};

testAPI(test1);

// Test 2: Search by service
console.log('\n🧪 Test 2: Search by service');
const test2 = {
  location: 'Mumbai',
  searchQuery: 'massage'
};

testAPI(test2);

// Test 3: Search with specific salon name
console.log('\n🧪 Test 3: Search with specific salon name');
const test3 = {
  location: 'Bangalore',
  searchQuery: 'Beauty'
};

testAPI(test3);

function testAPI(testData) {
  const { location, searchQuery } = testData;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(searchQuery)}`,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (parsed.success) {
          console.log(`✅ SUCCESS: Found ${parsed.data.totalResults} salons`);
          console.log(`📍 Location: ${parsed.data.location}`);
          console.log(`🔍 Search: ${parsed.data.searchQuery}`);
          
          if (parsed.data.salons.length > 0) {
            console.log('📋 Sample salon:');
            const salon = parsed.data.salons[0];
            console.log(`   Name: ${salon.salonName}`);
            console.log(`   Location: ${salon.location}`);
            console.log(`   Match Reason: ${salon.matchReason}`);
            console.log(`   Services: ${salon.services.length} services`);
            console.log(`   Rating: ${salon.rating}`);
          }
        } else {
          console.log(`❌ FAILED: ${parsed.message}`);
        }
      } catch (e) {
        console.log(`❌ Parse error: ${e.message}`);
        console.log(`Raw response: ${data}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`❌ Request error: ${e.message}`);
  });

  req.end();
}

console.log('\n=== EXPECTED BEHAVIOR ===');
console.log('✅ API should respond with success: true');
console.log('✅ Should find salons matching location and search query');
console.log('✅ Should match either salonName or services.name');
console.log('✅ Should return formatted salon data with matchReason');
console.log('✅ Case-insensitive matching should work');
console.log('\n=== TESTING INSTRUCTIONS ===');
console.log('1. Make sure server is running: npm run dev');
console.log('2. Make sure MongoDB is connected');
console.log('3. Make sure there are salons in the database');
console.log('4. Run: node test-salon-search.js');
console.log('5. Check results above');
console.log('6. Test in browser: http://localhost:3000/salon-search');
