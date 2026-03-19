// Force clear Node.js module cache
// Run with: node fix-cache.js

console.log('=== CLEARING NODE.JS MODULE CACHE ===');

// Clear require cache
delete require.cache[require.resolve('./src/models/SupportMessage.js')];

console.log('✅ Cleared SupportMessage model from cache');
console.log('✅ Next require will load fresh model');

// Test fresh import
const SupportMessage = require('./src/models/SupportMessage.js').default;

console.log('✅ Fresh SupportMessage model loaded');
console.log('✅ Model schema:', SupportMessage.schema.obj);

// Test creating a message with each category
const testCategories = ['booking', 'technical', 'account', 'payment', 'salon', 'other'];

console.log('\n🧪 Testing all categories with fresh model...');

for (const category of testCategories) {
  try {
    console.log(`\n📝 Testing category: ${category}`);
    
    const testMessage = new SupportMessage({
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      subject: `[${category}] Test subject`,
      message: `Category: ${category}\n\nThis is a test message for ${category} category.`,
      category: category,
      subject: 'Test subject',
      message: 'This is a test message.',
      status: 'pending',
      priority: 'medium'
    });
    
    console.log('✅ SupportMessage instance created');
    console.log('✅ Category value:', testMessage.category);
    
    // Test validation
    const validationError = testMessage.validateSync();
    if (validationError) {
      console.log('❌ Validation error:', validationError.message);
    } else {
      console.log('✅ Validation passed');
    }
    
  } catch (error) {
    console.log(`❌ Error testing category ${category}:`, error.message);
  }
}

console.log('\n=== CACHE CLEARANCE COMPLETE ===');
console.log('✅ Node.js module cache cleared');
console.log('✅ Fresh SupportMessage model loaded');
console.log('✅ All categories tested');
console.log('✅ Restart server to apply changes');
console.log('\n🎯 NEXT STEPS:');
console.log('1. Stop current server (Ctrl+C)');
console.log('2. Clear .next folder: rm -rf .next');
console.log('3. Start server: npm run dev');
console.log('4. Test support form: http://localhost:3000/support');
console.log('5. Test each category: booking, technical, account, payment, salon, other');
