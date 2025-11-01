const https = require('https');

const data = JSON.stringify({
  name: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  password: 'password123'
});

const options = {
  hostname: 'mistrustful-raelyn-simply.ngrok-free.dev',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'Node.js'
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse:', responseData);
    
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('\n✅ Registration works!');
    } else {
      console.log('\n❌ Registration failed');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();
