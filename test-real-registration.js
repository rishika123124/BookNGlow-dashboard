// Real-time salon registration test
const { mockSalons } = require('./src/app/api/admin/salons/mock-data');

console.log('=== REAL-TIME SALON REGISTRATION TEST ===');

// Step 1: Check current status
console.log('\n--- BEFORE REGISTRATION ---');
console.log('Total Salons:', mockSalons.length);
console.log('Pending Salons:', mockSalons.filter(s => s.status === 'pending').length);

// Step 2: Simulate new salon registration (like user just registered)
const newRealSalon = {
  _id: Date.now().toString(),
  salonName: 'REAL USER SALON - JUST NOW',
  ownerName: 'Real User',
  email: 'realuser@justnow.com',
  phone: '9876543299',
  address: '123 Real Street',
  city: 'Dehradun',
  state: 'Uttarakhand',
  pincode: '248001',
  services: [{ name: 'Haircut', price: 400 }],
  offers: ['Real user discount'],
  phoneVerified: true,
  gender: 'female',
  salonType: 'female',
  contactInfo: 'realuser@justnow.com',
  openingTime: '9:00 AM',
  closingTime: '8:00 PM',
  status: 'pending',
  isActive: false,
  isPremium: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Step 3: Add to mock data (simulate registration API)
mockSalons.unshift(newRealSalon);

console.log('\n--- AFTER REGISTRATION ---');
console.log('✅ New Salon Registered:', newRealSalon.salonName);
console.log('✅ Status:', newRealSalon.status);
console.log('✅ Total Salons:', mockSalons.length);
console.log('✅ Pending Salons:', mockSalons.filter(s => s.status === 'pending').length);

// Step 4: Show what admin should see
console.log('\n--- ADMIN DASHBOARD SHOULD SHOW ---');
const pendingForAdmin = mockSalons.filter(s => s.status === 'pending');
console.log('Pending Requests for Admin:', pendingForAdmin.length);
pendingForAdmin.forEach((salon, index) => {
  const isReal = salon.salonName.includes('REAL USER');
  console.log(`${index + 1}. ${salon.salonName} - ${salon.email} ${isReal ? '🆕 NEW!' : ''}`);
});

// Step 5: Show API response format
console.log('\n--- API RESPONSE FORMAT ---');
const apiResponse = {
  success: true,
  data: mockSalons
};
console.log('API Response Structure:', JSON.stringify(apiResponse, null, 2).substring(0, 300) + '...');

console.log('\n=== TEST COMPLETE ===');
console.log('🎯 Admin dashboard में अब show होना चाहिए!');
console.log('📍 Check console logs in browser for: "ADMIN DASHBOARD PENDING SALONS"');
