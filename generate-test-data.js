const http = require('http');

console.log('\n🧪 Generating Test Data for AI Analytics...\n');

const userTypes = ['family_vacation', 'business_traveler', 'couple_romantic', 'solo_traveler', 'luxury_seeker'];
const seasons = ['summer', 'winter', 'spring', 'fall'];
const budgets = [100, 150, 200, 300, 500];

let completed = 0;
const total = 10;

async function makeRecommendationRequest(index) {
  return new Promise((resolve) => {
    const userType = userTypes[index % userTypes.length];
    const season = seasons[index % seasons.length];
    const budget = budgets[index % budgets.length];
    
    const postData = JSON.stringify({
      userType: userType,
      season: season,
      dayType: 'weekday',
      bookingAdvance: 7 + index,
      stayDuration: 2 + (index % 3),
      groupSize: 2 + (index % 4),
      budget: budget,
      viewTime: 120,
      previousBookings: 0
    });

    const options = {
      hostname: 'localhost',
      port: 5002,
      path: '/recommend',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        completed++;
        console.log(`✅ Request ${completed}/${total}: ${userType} in ${season} (Budget: $${budget})`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Request ${index + 1} failed:`, error.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function generateData() {
  console.log('Sending 10 recommendation requests...\n');
  
  for (let i = 0; i < total; i++) {
    await makeRecommendationRequest(i);
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between requests
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Test data generation complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Check AI Analytics now:');
  console.log('   http://localhost:3000/ai-analytics\n');
  console.log('You should see:');
  console.log('   - Total Predictions: 10');
  console.log('   - Total Recommendations: 70');
  console.log('   - User type distribution');
  console.log('   - Room type distribution');
  console.log('   - Seasonal patterns');
  console.log('   - Device breakdown');
  console.log('   - Time of day data\n');
}

generateData().catch(console.error);
