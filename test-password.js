const bcrypt = require('bcryptjs');

// Generate hash for "admin123"
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Generated hash for "admin123":');
console.log(hash);
console.log('\nTesting hash...');

// Test the hash
const isValid = bcrypt.compareSync(password, hash);
console.log('Hash validation result:', isValid);

// Test against the old hash from database
const oldHash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W4uRUOZMqOKJjW9K7.8VfVuTnqG';
console.log('\nTesting old hash from schema.sql:');
console.log('Old hash validation:', bcrypt.compareSync(password, oldHash));

console.log('\n--- SQL UPDATE COMMAND ---');
console.log(`UPDATE admins SET password = '${hash}' WHERE username = 'admin';`);
