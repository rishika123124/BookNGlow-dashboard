// Test complete salon registration workflow
const { mockSalons } = require('./src/app/api/admin/salons/mock-data');

console.log('=== COMPLETE SALON REGISTRATION WORKFLOW TEST ===');

// Step 1: Simulate new salon registration
const newSalon = {
  _id: Date.now().toString(),
  salonName: 'TEST REGISTRATION SALON',
  ownerName: 'Test Owner',
  email: 'test@registration.com',
  phone: '9876543299',
  address: '123 Test Street',
  city: 'Dehradun',
  state: 'Uttarakhand',
  pincode: '248001',
  services: [{ name: 'Haircut', price: 300 }],
  offers: ['Test discount'],
  phoneVerified: true,
  gender: 'female',
  salonType: 'female',
  contactInfo: 'test@registration.com',
  openingTime: '9:00 AM',
  closingTime: '8:00 PM',
  status: 'pending',
  isActive: false,
  isPremium: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Step 2: Add to mock data (simulate registration)
mockSalons.unshift(newSalon);

console.log('\n=== STEP 1: SALON REGISTRATION ===');
console.log('New Salon Registered:', newSalon.salonName);
console.log('Status:', newSalon.status);
console.log('Active:', newSalon.isActive);

// Step 3: Check admin dashboard data
console.log('\n=== STEP 2: ADMIN DASHBOARD DATA ===');
const totalSalons = mockSalons.length;
const pendingSalons = mockSalons.filter(s => s.status === 'pending');
const approvedSalons = mockSalons.filter(s => s.status === 'approved');
const rejectedSalons = mockSalons.filter(s => s.status === 'rejected');

console.log('Total Salons:', totalSalons);
console.log('Pending Salons:', pendingSalons.length);
console.log('Approved Salons:', approvedSalons.length);
console.log('Rejected Salons:', rejectedSalons.length);

// Step 4: Check if new salon appears in pending
console.log('\n=== STEP 3: ADMIN APPROVAL QUEUE ===');
console.log('Pending Salons List:');
pendingSalons.forEach((salon, index) => {
  const isNew = salon.salonName === 'TEST REGISTRATION SALON';
  console.log(`${index + 1}. ${salon.salonName} (${salon.gender}) - ${salon.email} ${isNew ? '✅ NEW' : ''}`);
});

// Step 5: Simulate admin approval
console.log('\n=== STEP 4: ADMIN APPROVAL SIMULATION ===');
const salonToApprove = mockSalons.find(s => s.salonName === 'TEST REGISTRATION SALON');
if (salonToApprove) {
  // Update status to approved
  salonToApprove.status = 'approved';
  salonToApprove.isActive = true;
  salonToApprove.approvedAt = new Date();
  
  console.log('Salon Approved:', salonToApprove.salonName);
  console.log('New Status:', salonToApprove.status);
  console.log('New Active:', salonToApprove.isActive);
}

// Step 6: Check public display data
console.log('\n=== STEP 5: PUBLIC DISPLAY FILTER ===');
const publicSalons = mockSalons.filter(salon => 
  salon.isActive === true && 
  salon.status === 'approved'
);

console.log('Public Salons (Approved + Active):', publicSalons.length);
console.log('Public Salons List:');
publicSalons.forEach((salon, index) => {
  console.log(`${index + 1}. ${salon.salonName} (${salon.gender}) - ${salon.status}`);
});

// Step 7: Check category filtering
console.log('\n=== STEP 6: CATEGORY FILTERING ===');
const femaleSalons = publicSalons.filter(s => s.gender === 'female');
const maleSalons = publicSalons.filter(s => s.gender === 'male');
const unisexSalons = publicSalons.filter(s => s.gender === 'unisex');

console.log('Female Section:', femaleSalons.length);
console.log('Male Section:', maleSalons.length);
console.log('Unisex Section:', unisexSalons.length);

console.log('\n=== WORKFLOW TEST COMPLETE ===');
console.log('✅ Registration → Admin Dashboard → Approval → Public Display');
