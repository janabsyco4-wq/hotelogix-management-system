const fs = require('fs');
const csv = require('csv-writer');
const moment = require('moment');

// Generate synthetic dataset for room recommendations
class DatasetGenerator {
  constructor() {
    this.roomTypes = [
      'Standard Room', 'Deluxe Room', 'Executive Suite', 'Junior Suite',
      'Family Suite', 'Presidential Suite', 'Business Room'
    ];
    
    this.userProfiles = [
      'business_traveler', 'family_vacation', 'couple_romantic',
      'solo_traveler', 'group_friends', 'luxury_seeker', 'budget_conscious'
    ];
    
    this.seasons = ['spring', 'summer', 'fall', 'winter'];
    this.dayTypes = ['weekday', 'weekend'];
    this.bookingAdvance = [1, 3, 7, 14, 30, 60, 90]; // days in advance
    
    this.roomFeatures = {
      'Standard Room': { luxury: 0.3, space: 0.4, business: 0.5, family: 0.3, price: 0.8 },
      'Deluxe Room': { luxury: 0.6, space: 0.6, business: 0.6, family: 0.7, price: 0.6 },
      'Executive Suite': { luxury: 0.8, space: 0.8, business: 0.9, family: 0.6, price: 0.3 },
      'Junior Suite': { luxury: 0.7, space: 0.7, business: 0.7, family: 0.5, price: 0.5 },
      'Family Suite': { luxury: 0.5, space: 0.9, business: 0.4, family: 1.0, price: 0.4 },
      'Presidential Suite': { luxury: 1.0, space: 1.0, business: 0.8, family: 0.8, price: 0.1 },
      'Business Room': { luxury: 0.4, space: 0.5, business: 1.0, family: 0.2, price: 0.7 }
    };
    
    this.userPreferences = {
      'business_traveler': { luxury: 0.6, space: 0.4, business: 1.0, family: 0.1, price: 0.7 },
      'family_vacation': { luxury: 0.4, space: 0.9, business: 0.2, family: 1.0, price: 0.6 },
      'couple_romantic': { luxury: 0.9, space: 0.6, business: 0.3, family: 0.2, price: 0.4 },
      'solo_traveler': { luxury: 0.5, space: 0.3, business: 0.6, family: 0.1, price: 0.8 },
      'group_friends': { luxury: 0.6, space: 0.8, business: 0.4, family: 0.7, price: 0.5 },
      'luxury_seeker': { luxury: 1.0, space: 0.8, business: 0.5, family: 0.4, price: 0.2 },
      'budget_conscious': { luxury: 0.2, space: 0.4, business: 0.5, family: 0.6, price: 1.0 }
    };
  }

  generateUserInteraction() {
    const userId = Math.floor(Math.random() * 1000) + 1;
    const userProfile = this.userProfiles[Math.floor(Math.random() * this.userProfiles.length)];
    const roomType = this.roomTypes[Math.floor(Math.random() * this.roomTypes.length)];
    const season = this.seasons[Math.floor(Math.random() * this.seasons.length)];
    const dayType = this.dayTypes[Math.floor(Math.random() * this.dayTypes.length)];
    const bookingAdvance = this.bookingAdvance[Math.floor(Math.random() * this.bookingAdvance.length)];
    const stayDuration = Math.floor(Math.random() * 7) + 1; // 1-7 nights
    const groupSize = Math.floor(Math.random() * 8) + 1; // 1-8 people
    
    // Calculate compatibility score
    const userPref = this.userPreferences[userProfile];
    const roomFeature = this.roomFeatures[roomType];
    
    let compatibilityScore = 0;
    Object.keys(userPref).forEach(key => {
      compatibilityScore += userPref[key] * roomFeature[key];
    });
    compatibilityScore = compatibilityScore / Object.keys(userPref).length;
    
    // Add some randomness and seasonal/timing factors
    let finalScore = compatibilityScore;
    
    // Seasonal adjustments
    if (season === 'summer' && roomType.includes('Suite')) finalScore += 0.1;
    if (season === 'winter' && roomType === 'Standard Room') finalScore += 0.05;
    
    // Booking advance adjustments
    if (bookingAdvance >= 30 && roomType.includes('Presidential')) finalScore += 0.1;
    if (bookingAdvance <= 3 && roomType === 'Standard Room') finalScore += 0.1;
    
    // Weekend adjustments
    if (dayType === 'weekend' && userProfile === 'couple_romantic') finalScore += 0.1;
    if (dayType === 'weekday' && userProfile === 'business_traveler') finalScore += 0.1;
    
    // Group size adjustments
    if (groupSize >= 4 && roomType.includes('Suite')) finalScore += 0.1;
    if (groupSize === 1 && roomType === 'Standard Room') finalScore += 0.05;
    
    // Add noise
    finalScore += (Math.random() - 0.5) * 0.2;
    finalScore = Math.max(0, Math.min(1, finalScore));
    
    // Convert to rating (1-5 stars) and booking probability
    const rating = Math.round(finalScore * 4) + 1; // 1-5 stars
    const bookingProbability = finalScore;
    const wasBooked = Math.random() < bookingProbability ? 1 : 0;
    const viewTime = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
    
    return {
      userId,
      userProfile,
      roomType,
      season,
      dayType,
      bookingAdvance,
      stayDuration,
      groupSize,
      rating,
      wasBooked,
      viewTime,
      compatibilityScore: parseFloat(finalScore.toFixed(3))
    };
  }

  async generateDataset(numSamples = 50000) {
    console.log(`🤖 Generating ${numSamples} synthetic user interactions...`);
    
    const csvWriter = csv.createObjectCsvWriter({
      path: './ai-model/dataset/user_interactions.csv',
      header: [
        { id: 'userId', title: 'user_id' },
        { id: 'userProfile', title: 'user_profile' },
        { id: 'roomType', title: 'room_type' },
        { id: 'season', title: 'season' },
        { id: 'dayType', title: 'day_type' },
        { id: 'bookingAdvance', title: 'booking_advance_days' },
        { id: 'stayDuration', title: 'stay_duration_nights' },
        { id: 'groupSize', title: 'group_size' },
        { id: 'rating', title: 'user_rating' },
        { id: 'wasBooked', title: 'was_booked' },
        { id: 'viewTime', title: 'view_time_seconds' },
        { id: 'compatibilityScore', title: 'compatibility_score' }
      ]
    });

    const data = [];
    for (let i = 0; i < numSamples; i++) {
      data.push(this.generateUserInteraction());
      if ((i + 1) % 5000 === 0) {
        console.log(`   Generated ${i + 1}/${numSamples} samples...`);
      }
    }

    // Create dataset directory if it doesn't exist
    if (!fs.existsSync('./ai-model/dataset')) {
      fs.mkdirSync('./ai-model/dataset', { recursive: true });
    }

    await csvWriter.writeRecords(data);
    
    // Generate summary statistics
    const summary = this.generateSummary(data);
    fs.writeFileSync('./ai-model/dataset/dataset_summary.json', JSON.stringify(summary, null, 2));
    
    console.log('✅ Dataset generated successfully!');
    console.log(`📊 Created ${numSamples} samples in ./ai-model/dataset/user_interactions.csv`);
    console.log('📈 Dataset summary saved to ./ai-model/dataset/dataset_summary.json');
    console.log('\n📋 Summary Statistics:');
    console.log(`   Total Samples: ${summary.totalSamples}`);
    console.log(`   Average Rating: ${summary.averageRating}`);
    console.log(`   Booking Rate: ${summary.bookingRate}`);
    console.log(`   Average View Time: ${summary.averageViewTime}`);
    
    return data;
  }

  generateSummary(data) {
    const summary = {
      totalSamples: data.length,
      userProfiles: {},
      roomTypes: {},
      averageRating: 0,
      bookingRate: 0,
      averageViewTime: 0,
      seasonalDistribution: {},
      groupSizeDistribution: {}
    };

    data.forEach(sample => {
      // User profiles
      summary.userProfiles[sample.userProfile] = (summary.userProfiles[sample.userProfile] || 0) + 1;
      
      // Room types
      summary.roomTypes[sample.roomType] = (summary.roomTypes[sample.roomType] || 0) + 1;
      
      // Seasonal distribution
      summary.seasonalDistribution[sample.season] = (summary.seasonalDistribution[sample.season] || 0) + 1;
      
      // Group size distribution
      summary.groupSizeDistribution[sample.groupSize] = (summary.groupSizeDistribution[sample.groupSize] || 0) + 1;
      
      // Averages
      summary.averageRating += sample.rating;
      summary.bookingRate += sample.wasBooked;
      summary.averageViewTime += sample.viewTime;
    });

    summary.averageRating = (summary.averageRating / data.length).toFixed(2);
    summary.bookingRate = ((summary.bookingRate / data.length) * 100).toFixed(2) + '%';
    summary.averageViewTime = (summary.averageViewTime / data.length).toFixed(1) + ' seconds';

    return summary;
  }
}

// Generate the dataset
const generator = new DatasetGenerator();
generator.generateDataset(50000).catch(console.error);