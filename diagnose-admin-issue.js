const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function diagnoseAdminIssue() {
    console.log('🔍 Diagnosing Admin Dashboard Issue\n');
    console.log('='.repeat(70));

    try {
        // Step 1: Login as admin
        console.log('\n1️⃣ Testing Admin Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@hotelogix.com',
                password: 'admin123'
            })
        });

        const loginData = await loginRes.json();
        if (!loginData.token) {
            console.error('❌ Admin login failed:', loginData);
            return;
        }
        console.log('✅ Admin login successful');
        const token = loginData.token;

        // Step 2: Test all admin endpoints
        console.log('\n2️⃣ Testing Admin Endpoints...');

        const endpoints = [
            { name: 'Rooms', url: '/rooms' },
            { name: 'Restaurants', url: '/restaurants' },
            { name: 'Deals', url: '/deals' },
            { name: 'Packages', url: '/packages' },
            { name: 'Bookings', url: '/admin/bookings' },
            { name: 'Users', url: '/admin/users' },
            { name: 'Reservations', url: '/admin/reservations' },
            { name: 'Redemptions', url: '/admin/redemptions' },
            { name: 'Package Bookings', url: '/admin/package-bookings' }
        ];

        const results = {};

        for (const endpoint of endpoints) {
            try {
                const res = await fetch(`${API_URL}${endpoint.url}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                results[endpoint.name] = Array.isArray(data) ? data.length : 0;
                console.log(`   ✅ ${endpoint.name}: ${results[endpoint.name]} items`);
            } catch (err) {
                results[endpoint.name] = 0;
                console.log(`   ❌ ${endpoint.name}: Error - ${err.message}`);
            }
        }

        // Step 3: Calculate payment stats
        console.log('\n3️⃣ Calculating Payment Stats...');

        const bookingsRes = await fetch(`${API_URL}/admin/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await bookingsRes.json();

        const reservationsRes = await fetch(`${API_URL}/admin/reservations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const reservations = await reservationsRes.json();

        const redemptionsRes = await fetch(`${API_URL}/admin/redemptions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const redemptions = await redemptionsRes.json();

        const packageBookingsRes = await fetch(`${API_URL}/admin/package-bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const packageBookings = await packageBookingsRes.json();

        const paidBookings = bookings.filter(b => b.paymentIntentId);
        const paidReservations = reservations.filter(r => r.paymentIntentId);
        const paidRedemptions = redemptions.filter(r => r.paymentIntentId);
        const paidPackages = packageBookings.filter(p => p.paymentIntentId);

        const roomRevenue = paidBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const packageRevenue = paidPackages.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
        const diningDeposits = paidReservations.length * 50;
        const dealRevenue = paidRedemptions.length * 78;
        const totalRevenue = roomRevenue + packageRevenue + diningDeposits + dealRevenue;

        console.log(`   Total Bookings: ${bookings.length}`);
        console.log(`   Paid Bookings: ${paidBookings.length}`);
        console.log(`   Total Reservations: ${reservations.length}`);
        console.log(`   Paid Reservations: ${paidReservations.length}`);
        console.log(`   Total Redemptions: ${redemptions.length}`);
        console.log(`   Paid Redemptions: ${paidRedemptions.length}`);
        console.log(`   Total Package Bookings: ${packageBookings.length}`);
        console.log(`   Paid Package Bookings: ${paidPackages.length}`);
        console.log(`   \n   💰 Total Revenue: $${totalRevenue.toFixed(2)}`);

        // Step 4: Summary
        console.log('\n' + '='.repeat(70));
        console.log('📊 SUMMARY');
        console.log('='.repeat(70));

        if (results.Bookings === 0 && results.Users === 0) {
            console.log('\n⚠️  ISSUE FOUND: All counts showing 0');
            console.log('\nPossible causes:');
            console.log('1. Frontend not sending auth token correctly');
            console.log('2. Browser cache issue - try hard refresh (Ctrl+Shift+R)');
            console.log('3. Need to login again in the browser');
            console.log('4. CORS or network issue');
            console.log('\n💡 Solutions:');
            console.log('1. Clear browser cache and cookies');
            console.log('2. Logout and login again');
            console.log('3. Open browser DevTools (F12) and check Console for errors');
            console.log('4. Check Network tab for failed API requests');
        } else {
            console.log('\n✅ Backend is working correctly!');
            console.log(`   Total items: ${Object.values(results).reduce((a, b) => a + b, 0)}`);
            console.log(`   Revenue: $${totalRevenue.toFixed(2)}`);
            console.log('\nIf dashboard shows 0, try:');
            console.log('1. Hard refresh browser (Ctrl+Shift+R)');
            console.log('2. Check browser console for errors (F12)');
            console.log('3. Logout and login again');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('   Stack:', error.stack);
    }
}

diagnoseAdminIssue();
