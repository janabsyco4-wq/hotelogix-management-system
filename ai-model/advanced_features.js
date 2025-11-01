const fs = require('fs');
const path = require('path');
const csv = require('csv-writer');

class AdvancedAIFeatures {
  constructor() {
    this.userFeedback = [];
    this.abTestGroups = ['control', 'ai_enhanced', 'price_optimized'];
    this.realTimeData = {
      clickThroughRates: {},
      conversionRates: {},
      userSatisfaction: {},
      seasonalTrends: {}
    };
  }

  // Real-time learning from user interactions
  async recordUserFeedback(userId, roomId, interactionType, feedback) {
    const feedbackEntry = {
      userId,
      roomId,
      interactionType,
      feedback,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId()
    };

    this.userFeedback.push(feedbackEntry);

    // Save to file for persistence
    await this.saveFeedbackToFile(feedbackEntry);

    // Update real-time metrics
    this.updateRealTimeMetrics(feedbackEntry);

    return feedbackEntry;
  }

  // A/B Testing framework
  assignUserToTestGroup(userId) {
    // Use user ID to consistently assign to same group
    const hash = this.simpleHash(userId.toString());
    const groupIndex = hash % this.abTestGroups.length;
    return this.abTestGroups[groupIndex];
  }

  // Get personalized recommendations based on A/B test group
  async getTestGroupRecommendations(userProfile, testGroup) {
    switch (testGroup) {
      case 'control':
        return this.getControlRecommendations(userProfile);
      case 'ai_enhanced':
        return this.getAIEnhancedRecommendations(userProfile);
      case 'price_optimized':
        return this.getPriceOptimizedRecommendations(userProfile);
      default:
        return this.getControlRecommendations(userProfile);
    }
  }

  // Control group - basic recommendations
  getControlRecommendations(userProfile) {
    const basicRules = {
      business_traveler: [
        { roomType: 'Business Room', score: 0.8 },
        { roomType: 'Standard Room', score: 0.7 },
        { roomType: 'Junior Suite', score: 0.6 }
      ],
      family_vacation: [
        { roomType: 'Family Suite', score: 0.9 },
        { roomType: 'Deluxe Room', score: 0.8 },
        { roomType: 'Junior Suite', score: 0.7 }
      ],
      luxury_seeker: [
        { roomType: 'Presidential Suite', score: 0.95 },
        { roomType: 'Executive Suite', score: 0.9 },
        { roomType: 'Junior Suite', score: 0.8 }
      ]
    };

    const userType = userProfile.userType || 'solo_traveler';
    return basicRules[userType] || basicRules.business_traveler;
  }

  // AI Enhanced group - ML-powered recommendations
  async getAIEnhancedRecommendations(userProfile) {
    // This would integrate with the main recommendation engine
    // For now, simulate enhanced AI recommendations
    const baseRecommendations = this.getControlRecommendations(userProfile);
    
    return baseRecommendations.map(rec => ({
      ...rec,
      score: Math.min(1.0, rec.score * 1.15), // 15% boost
      aiEnhanced: true,
      confidence: 0.92,
      personalizedReason: this.generatePersonalizedReason(userProfile, rec.roomType)
    }));
  }

  // Price Optimized group - focus on value
  getPriceOptimizedRecommendations(userProfile) {
    const priceOptimizedRules = {
      business_traveler: [
        { roomType: 'Business Room', score: 0.85, priceOptimized: true },
        { roomType: 'Standard Room', score: 0.9, priceOptimized: true },
        { roomType: 'Deluxe Room', score: 0.75, priceOptimized: true }
      ],
      family_vacation: [
        { roomType: 'Deluxe Room', score: 0.9, priceOptimized: true },
        { roomType: 'Family Suite', score: 0.85, priceOptimized: true },
        { roomType: 'Standard Room', score: 0.8, priceOptimized: true }
      ],
      luxury_seeker: [
        { roomType: 'Executive Suite', score: 0.9, priceOptimized: true },
        { roomType: 'Junior Suite', score: 0.85, priceOptimized: true },
        { roomType: 'Presidential Suite', score: 0.8, priceOptimized: true }
      ]
    };

    const userType = userProfile.userType || 'solo_traveler';
    return priceOptimizedRules[userType] || priceOptimizedRules.business_traveler;
  }

  // Dynamic pricing based on real-time data
  calculateDynamicPrice(basePrice, roomType, userProfile, testGroup) {
    let adjustedPrice = basePrice;
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().getDay();

    // Time-based adjustments
    if (currentHour >= 18 && currentHour <= 22) {
      adjustedPrice *= 1.05; // 5% premium for evening bookings
    }

    // Weekend premium
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      adjustedPrice *= 1.1; // 10% weekend premium
    }

    // Test group adjustments
    if (testGroup === 'price_optimized') {
      adjustedPrice *= 0.95; // 5% discount for price-optimized group
    } else if (testGroup === 'ai_enhanced') {
      // Dynamic pricing based on predicted booking probability
      const bookingProbability = this.predictBookingProbability(userProfile, roomType);
      if (bookingProbability < 0.3) {
        adjustedPrice *= 0.9; // 10% discount for low probability
      } else if (bookingProbability > 0.8) {
        adjustedPrice *= 1.05; // 5% premium for high probability
      }
    }

    // Demand-based adjustments
    const demandMultiplier = this.calculateDemandMultiplier(roomType);
    adjustedPrice *= demandMultiplier;

    return {
      originalPrice: basePrice,
      adjustedPrice: Math.round(adjustedPrice * 100) / 100,
      adjustments: {
        timeOfDay: currentHour >= 18 && currentHour <= 22 ? 5 : 0,
        weekend: (dayOfWeek === 5 || dayOfWeek === 6) ? 10 : 0,
        testGroup: testGroup === 'price_optimized' ? -5 : (testGroup === 'ai_enhanced' ? 'dynamic' : 0),
        demand: Math.round((demandMultiplier - 1) * 100)
      }
    };
  }

  // Predict booking probability (simplified)
  predictBookingProbability(userProfile, roomType) {
    const baseRates = {
      'Standard Room': 0.4,
      'Deluxe Room': 0.5,
      'Business Room': 0.45,
      'Junior Suite': 0.6,
      'Executive Suite': 0.7,
      'Family Suite': 0.65,
      'Presidential Suite': 0.8
    };

    let probability = baseRates[roomType] || 0.5;

    // Adjust based on user profile
    if (userProfile.userType === 'luxury_seeker' && roomType.includes('Suite')) {
      probability += 0.2;
    }
    if (userProfile.userType === 'budget_conscious' && roomType === 'Standard Room') {
      probability += 0.15;
    }
    if (userProfile.groupSize > 4 && roomType === 'Family Suite') {
      probability += 0.25;
    }

    return Math.min(1.0, Math.max(0.1, probability));
  }

  // Calculate demand multiplier based on historical data
  calculateDemandMultiplier(roomType) {
    const currentMonth = new Date().getMonth();
    const demandPatterns = {
      'Presidential Suite': [1.2, 1.1, 1.0, 1.1, 1.3, 1.4, 1.5, 1.4, 1.2, 1.1, 1.0, 1.3],
      'Executive Suite': [1.1, 1.0, 0.9, 1.0, 1.2, 1.3, 1.4, 1.3, 1.1, 1.0, 0.9, 1.2],
      'Family Suite': [0.9, 0.8, 1.0, 1.1, 1.2, 1.5, 1.6, 1.5, 1.2, 1.0, 0.9, 1.1],
      'Standard Room': [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.1, 1.0, 1.0, 1.0, 1.0]
    };

    return demandPatterns[roomType]?.[currentMonth] || 1.0;
  }

  // Generate personalized recommendation reasons
  generatePersonalizedReason(userProfile, roomType) {
    const reasons = {
      business_traveler: {
        'Business Room': 'Perfect for your business needs with dedicated workspace',
        'Standard Room': 'Great value with essential business amenities',
        'Executive Suite': 'Premium business experience with executive lounge access'
      },
      family_vacation: {
        'Family Suite': 'Spacious accommodation perfect for your family',
        'Deluxe Room': 'Comfortable family-friendly room with extra space',
        'Presidential Suite': 'Ultimate family luxury experience'
      },
      luxury_seeker: {
        'Presidential Suite': 'The pinnacle of luxury and exclusivity',
        'Executive Suite': 'Premium luxury with exceptional amenities',
        'Junior Suite': 'Elegant luxury experience at great value'
      }
    };

    const userType = userProfile.userType || 'solo_traveler';
    return reasons[userType]?.[roomType] || 'Recommended based on your preferences';
  }

  // Real-time analytics and insights
  generateRealTimeInsights() {
    const insights = {
      timestamp: new Date().toISOString(),
      totalInteractions: this.userFeedback.length,
      averageSatisfaction: this.calculateAverageSatisfaction(),
      topPerformingRooms: this.getTopPerformingRooms(),
      conversionRateByGroup: this.getConversionRateByGroup(),
      seasonalTrends: this.getSeasonalTrends(),
      recommendations: this.generateBusinessRecommendations()
    };

    return insights;
  }

  // Calculate average user satisfaction
  calculateAverageSatisfaction() {
    if (this.userFeedback.length === 0) return 0;

    const satisfactionScores = this.userFeedback
      .filter(f => f.feedback && f.feedback.rating)
      .map(f => f.feedback.rating);

    if (satisfactionScores.length === 0) return 0;

    return satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length;
  }

  // Get top performing rooms
  getTopPerformingRooms() {
    const roomPerformance = {};
    
    this.userFeedback.forEach(feedback => {
      if (!roomPerformance[feedback.roomId]) {
        roomPerformance[feedback.roomId] = {
          interactions: 0,
          bookings: 0,
          totalRating: 0,
          ratingCount: 0
        };
      }

      roomPerformance[feedback.roomId].interactions++;
      
      if (feedback.interactionType === 'booking') {
        roomPerformance[feedback.roomId].bookings++;
      }
      
      if (feedback.feedback && feedback.feedback.rating) {
        roomPerformance[feedback.roomId].totalRating += feedback.feedback.rating;
        roomPerformance[feedback.roomId].ratingCount++;
      }
    });

    return Object.entries(roomPerformance)
      .map(([roomId, data]) => ({
        roomId: parseInt(roomId),
        conversionRate: data.interactions > 0 ? data.bookings / data.interactions : 0,
        averageRating: data.ratingCount > 0 ? data.totalRating / data.ratingCount : 0,
        totalInteractions: data.interactions
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);
  }

  // Get conversion rates by A/B test group
  getConversionRateByGroup() {
    const groupStats = {};
    
    this.abTestGroups.forEach(group => {
      groupStats[group] = {
        interactions: 0,
        bookings: 0,
        conversionRate: 0
      };
    });

    // This would be populated with real data
    // For demo, return sample data
    return {
      control: { interactions: 1000, bookings: 120, conversionRate: 0.12 },
      ai_enhanced: { interactions: 1000, bookings: 156, conversionRate: 0.156 },
      price_optimized: { interactions: 1000, bookings: 134, conversionRate: 0.134 }
    };
  }

  // Get seasonal trends
  getSeasonalTrends() {
    const currentMonth = new Date().getMonth();
    const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
    const seasonIndex = Math.floor(currentMonth / 3);
    
    return {
      currentSeason: seasons[seasonIndex],
      trends: {
        bookingVolume: this.getSeasonalBookingVolume(seasonIndex),
        averageStayDuration: this.getSeasonalStayDuration(seasonIndex),
        popularRoomTypes: this.getSeasonalPopularRooms(seasonIndex)
      }
    };
  }

  // Generate business recommendations based on insights
  generateBusinessRecommendations() {
    const recommendations = [];
    
    // Sample business recommendations
    recommendations.push({
      type: 'pricing',
      priority: 'high',
      message: 'Consider increasing Presidential Suite prices by 8% during peak season',
      impact: 'Potential 12% revenue increase'
    });
    
    recommendations.push({
      type: 'inventory',
      priority: 'medium',
      message: 'Family Suites show high demand - consider adding more family-oriented amenities',
      impact: 'Improved customer satisfaction'
    });
    
    recommendations.push({
      type: 'marketing',
      priority: 'medium',
      message: 'Business travelers respond well to AI-enhanced recommendations',
      impact: '15% higher conversion rate'
    });

    return recommendations;
  }

  // Helper methods
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async saveFeedbackToFile(feedbackEntry) {
    const feedbackDir = './ai-model/feedback';
    if (!fs.existsSync(feedbackDir)) {
      fs.mkdirSync(feedbackDir, { recursive: true });
    }

    const csvWriter = csv.createObjectCsvWriter({
      path: path.join(feedbackDir, 'user_feedback.csv'),
      header: [
        { id: 'userId', title: 'user_id' },
        { id: 'roomId', title: 'room_id' },
        { id: 'interactionType', title: 'interaction_type' },
        { id: 'feedback', title: 'feedback' },
        { id: 'timestamp', title: 'timestamp' },
        { id: 'sessionId', title: 'session_id' }
      ],
      append: true
    });

    await csvWriter.writeRecords([{
      ...feedbackEntry,
      feedback: JSON.stringify(feedbackEntry.feedback)
    }]);
  }

  updateRealTimeMetrics(feedbackEntry) {
    // Update click-through rates
    if (feedbackEntry.interactionType === 'click') {
      const roomId = feedbackEntry.roomId;
      if (!this.realTimeData.clickThroughRates[roomId]) {
        this.realTimeData.clickThroughRates[roomId] = { clicks: 0, views: 0 };
      }
      this.realTimeData.clickThroughRates[roomId].clicks++;
    }

    // Update conversion rates
    if (feedbackEntry.interactionType === 'booking') {
      const roomId = feedbackEntry.roomId;
      if (!this.realTimeData.conversionRates[roomId]) {
        this.realTimeData.conversionRates[roomId] = { bookings: 0, clicks: 0 };
      }
      this.realTimeData.conversionRates[roomId].bookings++;
    }
  }

  // Placeholder methods for seasonal data
  getSeasonalBookingVolume(seasonIndex) {
    const volumes = [0.8, 1.1, 1.4, 1.0]; // Winter, Spring, Summer, Fall
    return volumes[seasonIndex];
  }

  getSeasonalStayDuration(seasonIndex) {
    const durations = [2.5, 3.2, 4.1, 2.8]; // Average nights
    return durations[seasonIndex];
  }

  getSeasonalPopularRooms(seasonIndex) {
    const popularRooms = [
      ['Standard Room', 'Business Room'], // Winter
      ['Deluxe Room', 'Junior Suite'],    // Spring
      ['Family Suite', 'Presidential Suite'], // Summer
      ['Executive Suite', 'Deluxe Room']  // Fall
    ];
    return popularRooms[seasonIndex];
  }
}

module.exports = AdvancedAIFeatures;