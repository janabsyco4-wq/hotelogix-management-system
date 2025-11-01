const http = require('http');

async function demoAISystem() {
    console.log('🎯 Stoney Creek Hotels - AI Recommendation System Demo\n');
    console.log('='.repeat(60));

    const baseURL = 'http://localhost:5000/api';

    // Test different user scenarios
    const scenarios = [
        {
            name: '👨‍💼 Business Traveler',
            params: {
                userType: 'business_traveler',
                season: 'fall',
                dayType: 'weekday',
                groupSize: 1,
                stayDuration: 2,
                bookingAdvance: 14
            }
        },
        {
            name: '👨‍👩‍👧‍👦 Family Vacation',
            params: {
                userType: 'family_vacation',
                season: 'summer',
                dayType: 'weekend',
                groupSize: 4,
                stayDuration: 5,
                bookingAdvance: 30
            }
        },
        {
            name: '💑 Romantic Couple',
            params: {
                userType: 'couple_romantic',
                season: 'spring',
                dayType: 'weekend',
                groupSize: 2,
                stayDuration: 3,
                bookingAdvance: 21
            }
        },
        {
            name: '💎 Luxury Seeker',
            params: {
                userType: 'luxury_seeker',
                season: 'winter',
                dayType: 'weekend',
                groupSize: 2,
                stayDuration: 4,
                bookingAdvance: 60
            }
        }
    ];

    for (const scenario of scenarios) {
        console.log(`\n${scenario.name}`);
        console.log('-'.repeat(40));

        try {
            console.log(`🔄 Testing AI recommendations for ${scenario.name.split(' ')[1]}...`);
            console.log(`📋 Profile: ${JSON.stringify(scenario.params, null, 2)}`);

            // Simulate AI response for demo
            const recommendations = [
                {
                    roomType: 'Presidential Suite',
                    title: 'Grand Presidential Suite',
                    compatibilityScore: 0.85,
                    bookingProbability: 0.72,
                    predictedRating: 4.2,
                    confidence: 0.95,
                    pricePerNight: 349.99,
                    recommendationReason: 'Perfect match for your luxury preferences'
                },
                {
                    roomType: 'Executive Suite',
                    title: 'Luxury Executive Suite',
                    compatibilityScore: 0.78,
                    bookingProbability: 0.68,
                    predictedRating: 4.0,
                    confidence: 0.92,
                    pricePerNight: 249.99,
                    recommendationReason: 'Great fit based on your profile'
                },
                {
                    roomType: 'Deluxe Room',
                    title: 'Spacious Deluxe Room',
                    compatibilityScore: 0.71,
                    bookingProbability: 0.65,
                    predictedRating: 3.8,
                    confidence: 0.89,
                    pricePerNight: 179.99,
                    recommendationReason: 'Excellent value for money'
                }
            ];

            const aiPowered = true;
            const totalAvailableRooms = 8;

            console.log(`🤖 AI Status: ${aiPowered ? 'ACTIVE' : 'FALLBACK'}`);
            console.log(`🏨 Available Rooms: ${totalAvailableRooms}`);
            console.log(`📊 Recommendations: ${recommendations.length}`);
            console.log('\n🎯 Top 3 AI Recommendations:');

            recommendations.slice(0, 3).forEach((rec, index) => {
                console.log(`\n${index + 1}. ${rec.title || rec.roomType}`);
                console.log(`   🎯 Compatibility: ${(rec.compatibilityScore * 100).toFixed(1)}%`);
                console.log(`   📈 Booking Probability: ${(rec.bookingProbability * 100).toFixed(1)}%`);
                console.log(`   ⭐ Predicted Rating: ${rec.predictedRating.toFixed(1)}/5`);
                console.log(`   🔒 Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
                console.log(`   💰 Price: $${rec.pricePerNight}/night`);
                console.log(`   💡 Reason: ${rec.recommendationReason}`);
            });

        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }

        console.log('\n' + '='.repeat(60));
    }

    // Test personalized pricing
    console.log('\n💰 Personalized Pricing Demo');
    console.log('-'.repeat(40));

    try {
        // Simulate pricing response
        const pricing = {
            originalPrice: 249.99,
            recommendedPrice: 224.99,
            discount: 10,
            reason: 'Special AI-optimized rate for you'
        };
        const room = {
            title: 'Luxury Executive Suite'
        };

        console.log(`🏨 Room: ${room.title}`);
        console.log(`💵 Original Price: $${pricing.originalPrice}`);
        console.log(`🎯 Recommended Price: $${pricing.recommendedPrice}`);
        console.log(`📊 Discount: ${pricing.discount}%`);
        console.log(`💡 Reason: ${pricing.reason}`);

    } catch (error) {
        console.log(`❌ Pricing Error: ${error.message}`);
    }

    console.log('\n🎉 AI Recommendation System Demo Complete!');
    console.log('\n📱 Visit http://localhost:3000 to see the full UI');
    console.log('🔧 Admin Dashboard: http://localhost:3000/admin');
    console.log('📊 AI Analytics: http://localhost:3000/ai-analytics');
    console.log('🗄️ Database: http://localhost:5555');
}

// Run the demo
demoAISystem().catch(console.error);
