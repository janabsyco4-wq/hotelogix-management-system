const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Testing login endpoint...\n');
  
  const credentials = [
    { email: 'admin@stoneycreek.com', password: 'admin123', name: 'Admin' },
    { email: 'john@example.com', password: 'user123', name: 'User' }
  ];
  
  for (const cred of credentials) {
    console.log(`Testing ${cred.name} login...`);
    console.log(`Email: ${cred.email}`);
    console.log(`Password: ${cred.password}`);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: cred.email,
          password: cred.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Login successful!');
        console.log(`Token: ${data.token.substring(0, 20)}...`);
        console.log(`User: ${data.user.name} (${data.user.role})`);
      } else {
        console.log('❌ Login failed!');
        console.log(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log('❌ Request failed!');
      console.log(`Error: ${error.message}`);
    }
    
    console.log('\n---\n');
  }
}

testLogin();
