// Test if location dropdown is working now
const http = require('http');

console.log('=== CHECKING LOCATION DROPDOWN ===');

// Test the /api/salons endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/salons',
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
      
      if (parsed.success && parsed.data) {
        console.log('✅ API working correctly');
        console.log(`Found ${parsed.data.length} salons`);
        
        // Extract locations like the component does
        const locations = [...new Set(parsed.data.map(salon => salon.location).filter(loc => loc))];
        console.log('Available locations:', locations);
        
        console.log('\n🎯 EXPECTED IN DROPDOWN:');
        locations.forEach((loc, index) => {
          console.log(`${index + 1}. ${loc}`);
        });
        
        console.log('\n🧪 TESTING INSTRUCTIONS:');
        console.log('1. Go to: http://localhost:3000/salon-search');
        console.log('2. Click: "Open AI Salon Search"');
        console.log('3. Location dropdown should show:');
        locations.forEach((loc) => {
          console.log(`   - ${loc}`);
        });
        console.log('4. Select any location');
        console.log('5. Enter search query (e.g., "hair")');
        console.log('6. Click "Search Salons"');
        console.log('7. Expected: Results for selected location');
        
        console.log('\n✅ LOCATION DROPDOWN SHOULD WORK NOW!');
        
      } else {
        console.log('❌ API not working:', parsed.message);
      }
    } catch (e) {
      console.log('❌ Parse error:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Request error:', e.message);
});

req.end();

console.log('Testing /api/salons endpoint...');
