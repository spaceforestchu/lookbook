const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.log(`
╔══════════════════════════════════════════╗
║   Admin Password Hash Generator         ║
╚══════════════════════════════════════════╝

Usage: node generate-password.js <your-password>

Example:
  node generate-password.js MySecurePassword123

This will generate a bcrypt hash that you can use in your .env file.
  `);
  process.exit(1);
}

console.log('\n🔐 Generating password hash...\n');

bcrypt.hash(password, 10).then(hash => {
  console.log('✅ Password hash generated successfully!\n');
  console.log('Add this to your backend/.env file:\n');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('\nFull example .env entry:\n');
  console.log(`ADMIN_USERNAME=admin`);
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log(`JWT_SECRET=your-secret-key-change-this`);
  console.log(`JWT_EXPIRY=7d`);
  console.log('\n');
}).catch(error => {
  console.error('❌ Error generating hash:', error);
  process.exit(1);
});

