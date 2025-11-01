const http = require('http');

function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testAdminAPI() {
    try {
        // First, login to get a token
        console.log('Logging in as admin...');
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@hotelogix.com',
            password: 'admin123'
        });

        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.data);
            return;
        }

        const token = loginRes.data.token;
        console.log('✅ Login successful');

        console.log('\n=== Testing Admin Endpoints ===\n');

        // Test all endpoints
        const endpoints = [
            '/api/rooms',
            '/api/restaurants',
            '/api/deals',
            '/api/packages',
            '/api/admin/bookings',
            '/api/admin/users',
            '/api/admin/reservations',
            '/api/admin/redemptions',
            '/api/admin/package-bookings'
        ];

        for (const endpoint of endpoints) {
            try {
                const res = await makeRequest('GET', endpoint, null, token);
                if (res.status === 200) {
                    const count = Array.isArray(res.data) ? res.data.length : '?';
                    console.log(`✅ ${endpoint}: ${count} items`);
                } else {
                    console.log(`❌ ${endpoint}: ${res.status} - ${res.data.error || 'Error'}`);
                }
            } catch (err) {
                console.log(`❌ ${endpoint}: ${err.message}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAdminAPI();
