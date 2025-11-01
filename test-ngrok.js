const https = require('https');

const url = 'https://mistrustful-raelyn-simply.ngrok-free.dev/api/health';

https.get(url, {
    headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Node.js'
    }
}, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);

        if (res.statusCode === 200) {
            console.log('\n✅ Ngrok is working perfectly!');
            console.log('🎉 Your backend is accessible online!');
        }
    });
}).on('error', (err) => {
    console.error('❌ Error:', err.message);
});
