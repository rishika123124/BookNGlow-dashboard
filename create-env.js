const fs = require('fs');

const envContent = `MONGODB_URI=mongodb://localhost:27017/booknglow
JWT_SECRET=your-secret-key-change-this-in-production`;

fs.writeFileSync('.env.local', envContent);

console.log('.env.local file created successfully!');
