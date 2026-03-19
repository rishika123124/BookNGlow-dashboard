// Test salon schema
const mongoose = require('mongoose');
require('dotenv').config();

async function testSalonSchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get Salon model
    const Salon = require('./src/models/Salon.js').default;
    
    // Find a salon
    const salon = await Salon.findOne();
    console.log('Found salon:', salon.salonName);
    console.log('Offers type:', typeof salon.offers);
    console.log('Offers length:', salon.offers?.length);
    console.log('First offer type:', typeof salon.offers?.[0]);
    console.log('Offers array:', salon.offers);

    // Try to add an offer
    const newOffer = {
      title: 'Test Offer',
      discount: 10,
      description: 'Test description',
      validDate: '2024-12-31',
      createdAt: new Date(),
      isActive: true
    };

    console.log('Trying to add offer:', newOffer);
    
    if (!salon.offers) {
      salon.offers = [];
    }
    
    // Check if offers array is still using old string format
    if (salon.offers.length > 0 && typeof salon.offers[0] === 'string') {
      console.log('Converting offers from string format to object format');
      salon.offers = []; // Reset to empty array for new format
    }
    
    salon.offers.push(newOffer);
    
    console.log('Offers after push:', salon.offers);
    
    // Try to save
    await salon.save();
    console.log('Offer saved successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
  }
}

testSalonSchema();
