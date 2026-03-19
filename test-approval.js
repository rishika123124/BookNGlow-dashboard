// Test script to check admin approval API
const { mockSalons } = require('./src/app/api/admin/salons/mock-data');

console.log('=== SALON APPROVAL TEST ===');
console.log('Total Mock Salons:', mockSalons.length);
console.log('Pending Salons:', mockSalons.filter(s => s.status === 'pending').length);
console.log('Approved Salons:', mockSalons.filter(s => s.status === 'approved').length);
console.log('Rejected Salons:', mockSalons.filter(s => s.status === 'rejected').length);

console.log('\n=== PENDING SALONS LIST ===');
mockSalons.filter(s => s.status === 'pending').forEach((salon, index) => {
  console.log(`${index + 1}. ${salon.salonName} (${salon.gender}) - ${salon.email}`);
});

console.log('\n=== NEW USER SALON DETAILS ===');
const newUserSalon = mockSalons.find(s => s.salonName.includes('NEW USER'));
if (newUserSalon) {
  console.log('Name:', newUserSalon.salonName);
  console.log('Owner:', newUserSalon.ownerName);
  console.log('Email:', newUserSalon.email);
  console.log('Phone:', newUserSalon.phone);
  console.log('Gender:', newUserSalon.gender);
  console.log('Type:', newUserSalon.salonType);
  console.log('Status:', newUserSalon.status);
  console.log('Active:', newUserSalon.isActive);
} else {
  console.log('New user salon not found!');
}
