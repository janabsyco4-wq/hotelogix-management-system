const fs = require('fs');
const path = require('path');

// Generate realistic analytics data
function generateRealisticData() {
  const now = new Date();
  const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  // Simulate 500 user sessions over the past week
  const totalSessions = 500;
  const clicks = Math.floor(totalSessions * 0.35); // 35% click-through rate
  const bookings = Math.floor(clicks * 0.15); // 15% conversion rate
  const bounces = Math.floor(totalSessions * 0.25); // 25% bounce rate

  // Generate session times (in seconds)
  const sessionTimes = [];
  for (let i = 0; i < totalSessions; i++) {
    // Average session: 3-8 minutes
    const sessionTime = Math.floor(Math.random() * 300) + 180;
    sessionTimes.push(sessionTime);
  }

  // Generate booking revenues (Pakistan - PKR)
  const bookingRevenues = [];
  const roomPrices = {
    'Budget Room': [2000, 5000],
    'Economy Room': [5000, 10000],
    'Standard Room': [10000, 15000],
    'Deluxe Room': [15000, 25000],
    'Business Room': [20000, 30000],
    'Junior Suite': [25000, 35000],
    'Executive Suite': [35000, 50000],
    'Family Suite': [30000, 45000],
    'Presidential Suite': [50000, 100000],
    'Royal Suite': [100000, 150000]
  };

  const roomTypes = Object.keys(roomPrices);
  const roomBookings = {};
  
  for (let i = 0; i < bookings; i++) {
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const [min, max] = roomPrices[roomType];
    const nights = Math.floor(Math.random() * 5) + 1; // 1-5 nights
    const revenue = (Math.floor(Math.random() * (max - min)) + min) * nights;
    bookingRevenues.push(revenue);
    
    roomBookings[roomType] = (roomBookings[roomType] || 0) + 1;
  }

  const totalRevenue = bookingRevenues.reduce((sum, rev) => sum + rev, 0);
  const aiDrivenRevenue = Math.floor(totalRevenue * 0.68); // 68% AI-driven

  // Device breakdown
  const deviceBreakdown = {
    desktop: Math.floor(totalSessions * 0.45),
    mobile: Math.floor(totalSessions * 0.40),
    tablet: Math.floor(totalSessions * 0.15)
  };

  // Time of day distribution
  const timeOfDay = {};
  for (let i = 0; i < totalSessions; i++) {
    const hour = Math.floor(Math.random() * 24);
    timeOfDay[hour] = (timeOfDay[hour] || 0) + 1;
  }

  // User type distribution
  const userTypes = ['family_vacation', 'business_traveler', 'couple_romantic', 'solo_traveler', 'luxury_seeker'];
  const userTypeCounts = {};
  userTypes.forEach(type => {
    userTypeCounts[type] = Math.floor(Math.random() * 100) + 50;
  });

  // Season distribution
  const seasonCounts = {
    spring: Math.floor(totalSessions * 0.25),
    summer: Math.floor(totalSessions * 0.30),
    fall: Math.floor(totalSessions * 0.25),
    winter: Math.floor(totalSessions * 0.20)
  };

  // Room type prediction counts
  const roomTypeCounts = {};
  roomTypes.forEach(type => {
    roomTypeCounts[type] = Math.floor(Math.random() * 150) + 100;
  });

  // Generate compatibility and booking likelihood scores
  const avgCompatibility = [];
  const avgBookingLikelihood = [];
  for (let i = 0; i < 200; i++) {
    avgCompatibility.push(Math.random() * 100);
    avgBookingLikelihood.push(Math.random() * 60 + 20);
  }

  const statsData = {
    total_predictions: totalSessions,
    room_type_counts: roomTypeCounts,
    user_type_counts: userTypeCounts,
    season_counts: seasonCounts,
    day_type_counts: {
      weekday: Math.floor(totalSessions * 0.7),
      weekend: Math.floor(totalSessions * 0.3)
    },
    avg_compatibility: avgCompatibility,
    avg_booking_likelihood: avgBookingLikelihood,
    start_time: startTime.toISOString(),
    clicks: clicks,
    views: totalSessions,
    bookings: bookings,
    device_breakdown: deviceBreakdown,
    time_of_day: timeOfDay,
    session_times: sessionTimes,
    bounce_count: bounces,
    total_sessions: totalSessions,
    total_revenue: totalRevenue,
    ai_driven_revenue: aiDrivenRevenue,
    booking_revenues: bookingRevenues,
    room_bookings: roomBookings
  };

  return statsData;
}

// Write to file
const statsData = generateRealisticData();
const filePath = path.join(__dirname, 'ai-model', 'stats_data.json');

fs.writeFileSync(filePath, JSON.stringify(statsData, null, 2));

console.log('✅ Realistic analytics data generated!');
console.log('\n📊 Summary:');
console.log(`   Total Sessions: ${statsData.total_sessions}`);
console.log(`   Clicks: ${statsData.clicks} (${((statsData.clicks / statsData.total_sessions) * 100).toFixed(1)}% CTR)`);
console.log(`   Bookings: ${statsData.bookings} (${((statsData.bookings / statsData.clicks) * 100).toFixed(1)}% conversion)`);
console.log(`   Total Revenue: $${statsData.total_revenue.toLocaleString()}`);
console.log(`   AI-Driven Revenue: $${statsData.ai_driven_revenue.toLocaleString()}`);
console.log(`   Avg Session Time: ${Math.floor(statsData.session_times.reduce((a, b) => a + b, 0) / statsData.session_times.length / 60)}m ${Math.floor(statsData.session_times.reduce((a, b) => a + b, 0) / statsData.session_times.length % 60)}s`);
console.log(`   Bounce Rate: ${((statsData.bounce_count / statsData.total_sessions) * 100).toFixed(1)}%`);
console.log('\n🔄 Restart the AI Model API to see the changes!');
