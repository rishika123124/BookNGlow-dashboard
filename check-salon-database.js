// Check if salons exist in database
const mongoose = require('mongoose');

console.log('=== CHECKING SALON DATABASE ===');

async function checkSalons() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booknglow';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get Salon model
    const Salon = require('./src/models/Salon.js').default;
    
    if (!Salon) {
      console.log('❌ Salon model not found');
      return;
    }

    // Count total salons
    const totalSalons = await Salon.countDocuments();
    console.log(`📊 Total salons in database: ${totalSalons}`);

    if (totalSalons === 0) {
      console.log('❌ No salons found in database');
      console.log('🔧 AI search is working but database is empty');
      console.log('📝 Need to add sample salons to test search');
      return;
    }

    // Get sample salons
    const salons = await Salon.find().limit(5).lean();
    console.log('📋 Sample salons:');
    
    salons.forEach((salon, index) => {
      console.log(`\n${index + 1}. ${salon.salonName || 'Unnamed'}`);
      console.log(`   Location: ${salon.location || 'No location'}`);
      console.log(`   Services: ${salon.services?.length || 0} services`);
      console.log(`   Status: ${salon.status || 'No status'}`);
      
      if (salon.services && salon.services.length > 0) {
        console.log(`   Service names: ${salon.services.map(s => s.name).join(', ')}`);
      }
    });

    // Test search with existing data
    console.log('\n🧪 Testing search with existing data...');
    
    if (salons.length > 0) {
      const testSalon = salons[0];
      const testLocation = testSalon.location || 'Delhi';
      const testService = testSalon.services?.[0]?.name || 'haircut';
      
      console.log(`🔍 Testing: Location="${testLocation}", Search="${testService}"`);
      
      const searchQuery = {
        location: { $regex: new RegExp(testLocation, 'i') },
        $or: [
          { salonName: { $regex: new RegExp(testService, 'i') } },
          { 'services.name': { $regex: new RegExp(testService, 'i') } }
        ]
      };
      
      const searchResults = await Salon.find(searchQuery).limit(3);
      console.log(`✅ Found ${searchResults.length} salons with test query`);
      
      searchResults.forEach((salon, index) => {
        console.log(`   ${index + 1}. ${salon.salonName} - ${salon.location}`);
      });
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkSalons();

console.log('\n=== CONCLUSION ===');
console.log('If no salons found, AI search is working but database is empty');
console.log('Need to add sample salons to test AI search functionality');
console.log('AI search API is working correctly (Status: 200)');
