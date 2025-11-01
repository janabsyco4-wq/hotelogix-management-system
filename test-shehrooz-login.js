const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testShehroozLogin() {
  console.log('🔍 Testing Shehrooz Login\n');
  
  const credentials = [
    { email: 'shehrooz@gmail.com', password: 'password123' },
    { email: 'shehrooz@gmail.com', password: 'admin123' },
    { email: 'admin@hotelogix.com', password: 'admin123' },
    { email: 'john@example.com', password: 'password123' }
  ];
  
  for (const cred of credentials) {
    console.log(`\nTrying: ${cred.email} / ${cred.password}`);
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      
      const data = await res.json();
      
      if (data.token) {
        console.log(`✅ SUCCESS! Token: ${data.token.substring(0, 20)}...`);
        console.log(`   User: ${data.user.name}`);
        console.log(`   Role: ${data.user.role}`);
      } else {
        console.log(`❌ FAILED: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 If shehrooz login fails, the password might need to be reset.');
  console.log('   Run: node setup-auth.js');
  console.log('   This will reset all user passwords to "password123"');
}

testShehroozLogin();
