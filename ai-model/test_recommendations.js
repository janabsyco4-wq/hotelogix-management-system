const RecommendationEngine = require('./recommendation_engine');

async function testRecommendations() {
  console.log('🧪 Testing AI Recommendation System\n');
  
  const engine = new RecommendationEngine();
  await engine.loadModel();
  
  if (!engine.isLoaded) {
    console.log('❌ Model not loaded. Please train the model first.');
    return;
  }
  
  // Test different user profiles
  const testProfiles = [
    {
      name: 'Business Traveler',
      profile: {
        userType: 'business_traveler',
        season: 'fall',
        dayType: 'weekday',
        bookingAdvance: 14,
        stayDuration: 2,
        groupSize: 1
      }
    },
    {
      name: 'Family Vacation',
      profile: {
        userType: 'family_vacation',
        season: 'summer',
        dayType: 'weekend',
        bookingAdvance: 30,
        stayDuration: 5,
        groupSize: 4
      }
    },
    {
      name: 'Romantic Couple',
      profile: {
        userType: 'couple_romantic',
        season: 'spring',
        dayType: 'weekend',
        bookingAdvance: 21,
        stayDuration: 3,
        groupSize: 2
      }
    },
    {
      name: 'Luxury Seeker',
      profile: {
        userType: 'luxury_seeker',
        season: 'winter',
        dayType: 'weekend',
        bookingAdvance: 60,
        stayDuration: 4,
        groupSize: 2
      }
    },
    {
      name: 'Budget Conscious',
      profile: {
        userType: 'budget_conscious',
        season: 'fall',
        dayType: 'weekday',
        bookingAdvance: 3,
        stayDuration: 1,
        groupSize: 1
      }
    }
  ];
  
  for (const test of testProfiles) {
    console.log(`\n🎯 Testing: ${test.name}`);
    console.log(`Profile: ${JSON.stringify(test.profile, null, 2)}`);
    
    try {
      const recommendations = await engine.getRecommendations(test.profile);
      
      console.log(`\n📊 Top 3 Recommendations:`);
      recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.roomType}`);
        console.log(`   🎯 Compatibility: ${(rec.compatibilityScore * 100).toFixed(1)}%`);
        console.log(`   📈 Booking Probability: ${(rec.bookingProbability * 100).toFixed(1)}%`);
        console.log(`   ⭐ Predicted Rating: ${rec.predictedRating.toFixed(1)}/5`);
        console.log(`   🔒 Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
      });
      
    } catch (error) {
      console.error(`❌ Error getting recommendations: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  // Test personalized pricing
  console.log('\n💰 Testing Personalized Pricing\n');
  
  const pricingTest = {
    userType: 'luxury_seeker',
    season: 'summer',
    dayType: 'weekend',
    bookingAdvance: 45,
    stayDuration: 3,
    groupSize: 2
  };
  
  try {
    const pricing = await engine.getPersonalizedPricing(pricingTest, 1, 249.99);
    console.log('Personalized Pricing Result:');
    console.log(`Original Price: $${pricing.originalPrice}`);
    console.log(`Recommended Price: $${pricing.recommendedPrice}`);
    console.log(`Discount: ${pricing.discount}%`);
    console.log(`Reason: ${pricing.reason}`);
  } catch (error) {
    console.error(`❌ Error getting personalized pricing: ${error.message}`);
  }
  
  console.log('\n🎉 AI Recommendation System Test Complete!');
}

// Run the test
testRecommendations().catch(console.error);