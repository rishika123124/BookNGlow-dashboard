// Test location matching issue
const http = require('http');

console.log('=== LOCATION MATCHING TEST ===');

// Test exact location matching
const testCases = [
  { location: 'niranjanpur', service: 'hair cut' },
  { location: 'niranjanpur dehradun', service: 'hair cut' },
  { location: 'Niranjanpur', service: 'hair cut' },
  { location: 'NIRANJANPUR', service: 'hair cut' }
];

testCases.forEach((testCase, index) => {
  console.log(`\n🧪 Test ${index + 1}: "${testCase.location}" + "${testCase.service}"`);
  testAPI(testCase);
});

function testAPI(testData) {
  const { location, service } = testData;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(service)}`,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        
        if (parsed.success) {
          console.log(`   ✅ SUCCESS: Found ${parsed.data.totalResults} salons`);
          
          if (parsed.data.salons.length > 0) {
            parsed.data.salons.forEach((salon, idx) => {
              console.log(`   📋 ${idx + 1}. ${salon.salonName} (${salon.matchReason})`);
              console.log(`       Location in DB: "${salon.location}"`);
            });
          } else {
            console.log(`   📋 No salons found`);
          }
        } else {
          console.log(`   ❌ FAILED: ${parsed.message}`);
        }
      } catch (e) {
        console.log(`   ❌ Parse error: ${e.message}`);
        console.log(`   Raw response: ${data}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`   ❌ Request error: ${e.message}`);
  });

  req.end();
}

console.log('\n🔍 PROBLEM ANALYSIS:');
console.log('Database has salons with location: "niranjanpur dehradun"');
console.log('But user searches for: "niranjanpur"');
console.log('This mismatch causes no results');

console.log('\n💡 SOLUTION NEEDED:');
console.log('1. Add location aliases to handle partial matches');
console.log('2. Or update dropdown to include exact DB locations');
console.log('3. Or implement fuzzy matching for locations');

console.log('\n✅ LOCATION MATCHING TEST COMPLETE');
