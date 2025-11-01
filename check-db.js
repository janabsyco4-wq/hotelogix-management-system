const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath);

console.log('📊 Checking database...\n');

// Check if password column exists
db.all("PRAGMA table_info(User)", (err, columns) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('User table columns:');
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  const hasPassword = columns.some(col => col.name === 'password');
  console.log(`\n✅ Password column exists: ${hasPassword}\n`);
  
  // Get all users
  db.all("SELECT id, email, name, role, password FROM User", (err, users) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`\n  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Has Password: ${user.password ? 'Yes (hashed)' : 'No'}`);
      if (user.password) {
        console.log(`  Password Hash: ${user.password.substring(0, 20)}...`);
      }
    });
    
    db.close();
  });
});
