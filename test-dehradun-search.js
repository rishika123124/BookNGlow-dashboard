// Test AI Salon Search with Dehradun locations
const http = require('http');

console.log('=== DEHRADUN SALON SEARCH TEST ===');

// Dehradun locations
const dehradunLocations = [
  'Rajpur Road',
  'Jakhan',
  'Ballupur',
  'Niranjanpur',
  'Clement Town',
  'Prem Nagar',
  'ISBT',
  'Patel Nagar'
];

// Common salon services
const searchQueries = [
  'haircut',
  'massage',
  'facial',
  'beauty',
  'spa',
  'hair color',
  'manicure',
  'pedicure'
];

console.log('\n🧪 Testing Dehradun Locations:');
console.log('Available locations:', dehradunLocations.join(', '));
console.log('Search queries:', searchQueries.join(', '));

// Test a few combinations
const testCases = [
  { location: 'Rajpur Road', searchQuery: 'haircut' },
  { location: 'Jakhan', searchQuery: 'massage' },
  { location: 'Ballupur', searchQuery: 'facial' },
  { location: 'Niranjanpur', searchQuery: 'beauty' }
];

testCases.forEach((testCase, index) => {
  console.log(`\n🧪 Test ${index + 1}: ${testCase.location} + "${testCase.searchQuery}"`);
  testAPI(testCase);
});

function testAPI(testData) {
  const { location, searchQuery } = testData;
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/salons/search?location=${encodeURIComponent(location)}&searchQuery=${encodeURIComponent(searchQuery)}`,
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
          console.log(`   📍 Location: ${parsed.data.location}`);
          console.log(`   🔍 Search: ${parsed.data.searchQuery}`);
          
          if (parsed.data.salons.length > 0) {
            const salon = parsed.data.salons[0];
            console.log(`   📋 Sample: ${salon.salonName} (${salon.matchReason})`);
          } else {
            console.log(`   📋 No salons found in ${location}`);
          }
        } else {
          console.log(`   ❌ FAILED: ${parsed.message}`);
        }
      } catch (e) {
        console.log(`   ❌ Parse error: ${e.message}`);
      }
    });
  });

  req.on('error', (e) => {
    console.log(`   ❌ Request error: ${e.message}`);
  });

  req.end();
}

console.log('\n=== FRONTEND TESTING ===');
console.log('1. Go to: http://localhost:3000/salon-search');
console.log('2. Click: "Open AI Salon Search"');
console.log('3. Select: Location from dropdown');
console.log('4. Enter: Search query (e.g., "haircut")');
console.log('5. Click: "Search Salons"');
console.log('6. Expected: Results with Dehradun locations');
console.log('\n=== EXPECTED BEHAVIOR ===');
console.log('✅ Location dropdown shows all Dehradun areas');
console.log('✅ State updates when location is selected');
console.log('✅ Search works with selected location');
console.log('✅ Results show salons in selected area');
console.log('✅ Match reason shows salon or service match');
console.log('✅ Professional UI with dropdown styling');
