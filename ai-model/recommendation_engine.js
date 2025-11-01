const fs = require('fs');
const path = require('path');
const MLR = require('ml-regression-multivariate-linear');

class RecommendationEngine {
  constructor() {
    this.models = null;
    this.metadata = null;
    this.isLoaded = false;
  }

  async loadModel() {
    try {
      console.log('🤖 Loading AI recommendation model...');
      
      const modelPath = path.resolve('./ai-model/models');
      const modelsPath = path.join(modelPath, 'models.json');
      const metadataPath = path.join(modelPath, 'metadata.json');
      
      // Load models
      const modelData = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
      this.models = {
        compatibilityModel: MLR.load(modelData.compatibilityModel),
        bookingModel: MLR.load(modelData.bookingModel),
        ratingModel: MLR.load(modelData.ratingModel)
      };
      
      // Load metadata
      this.metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      this.isLoaded = true;
      console.log('✅ AI model loaded successfully!');
      
    } catch (error) {
      console.error('❌ Failed to load AI model:', error.message);
      console.log('💡 Make sure to train the model first by running: npm run train');
      this.isLoaded = false;
    }
  }

  oneHotEncode(value, encoder, size) {
    const encoded = new Array(size).fill(0);
    if (encoder[value] !== undefined) {
      encoded[encoder[value]] = 1;
    }
    return encoded;
  }

  prepareUserFeatures(userProfile) {
    if (!this.isLoaded) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    const encoders = this.metadata.encoders;
    
    // Get unique values count for each encoder
    const encoderSizes = {
      userProfile: Object.keys(encoders.userProfile).length,
      roomType: Object.keys(encoders.roomType).length,
      season: Object.keys(encoders.season).length,
      dayType: Object.keys(encoders.dayType).length
    };

    const features = [];

    // For each room type, create a feature vector
    Object.keys(encoders.roomType).forEach(roomType => {
      const feature = [
        // One-hot encoded categorical features
        ...this.oneHotEncode(userProfile.userType || 'solo_traveler', encoders.userProfile, encoderSizes.userProfile),
        ...this.oneHotEncode(roomType, encoders.roomType, encoderSizes.roomType),
        ...this.oneHotEncode(userProfile.season || 'summer', encoders.season, encoderSizes.season),
        ...this.oneHotEncode(userProfile.dayType || 'weekday', encoders.dayType, encoderSizes.dayType),
        
        // Numerical features (normalized)
        (userProfile.bookingAdvance || 7) / 90,  // Normalize to 0-1
        (userProfile.stayDuration || 2) / 7,     // Normalize to 0-1
        (userProfile.groupSize || 2) / 8,        // Normalize to 0-1
        (userProfile.viewTime || 120) / 300      // Normalize to 0-1
      ];

      features.push({
        roomType,
        features: feature
      });
    });

    return features;
  }

  async getRecommendations(userProfile, availableRooms = []) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    if (!this.isLoaded) {
      // Fallback to simple rule-based recommendations
      return this.getFallbackRecommendations(userProfile, availableRooms);
    }

    try {
      // Prepare features for all room types
      const roomFeatures = this.prepareUserFeatures(userProfile);
      
      // Create feature matrix
      const featureMatrix = roomFeatures.map(rf => rf.features);
      
      // Get predictions from each model
      const compatibilityPreds = this.models.compatibilityModel.predict(featureMatrix);
      const bookingPreds = this.models.bookingModel.predict(featureMatrix);
      const ratingPreds = this.models.ratingModel.predict(featureMatrix);
      
      // Process predictions
      const recommendations = [];
      for (let i = 0; i < roomFeatures.length; i++) {
        const compatibilityScore = Math.max(0, Math.min(1, compatibilityPreds[i][0]));
        const bookingProbability = Math.max(0, Math.min(1, bookingPreds[i][0]));
        const predictedRating = Math.max(1, Math.min(5, ratingPreds[i][0] * 5));
        
        recommendations.push({
          roomType: roomFeatures[i].roomType,
          compatibilityScore,
          bookingProbability,
          predictedRating,
          confidence: this.calculateConfidence([compatibilityScore, bookingProbability, predictedRating / 5])
        });
      }

      // Sort by compatibility score
      recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      // Filter and enhance with room data if available
      if (availableRooms.length > 0) {
        return this.enhanceWithRoomData(recommendations, availableRooms);
      }

      return recommendations.slice(0, 5); // Top 5 recommendations

    } catch (error) {
      console.error('❌ Prediction error:', error);
      return this.getFallbackRecommendations(userProfile, availableRooms);
    }
  }

  calculateConfidence(predictions) {
    // Calculate confidence based on prediction consistency
    const variance = predictions.reduce((sum, pred) => {
      const mean = predictions.reduce((a, b) => a + b) / predictions.length;
      return sum + Math.pow(pred - mean, 2);
    }, 0) / predictions.length;
    
    return Math.max(0, 1 - variance); // Higher confidence for lower variance
  }

  enhanceWithRoomData(recommendations, availableRooms) {
    const enhanced = [];
    
    recommendations.forEach(rec => {
      const matchingRooms = availableRooms.filter(room => room.type === rec.roomType);
      
      matchingRooms.forEach(room => {
        enhanced.push({
          ...rec,
          roomId: room.id,
          roomNumber: room.roomNumber,
          title: room.title,
          description: room.description,
          pricePerNight: room.pricePerNight,
          images: room.images,
          amenities: room.amenities,
          capacity: room.capacity,
          size: room.size,
          bedType: room.bedType,
          hotel: room.hotel,
          recommendationReason: this.generateRecommendationReason(rec, room)
        });
      });
    });

    return enhanced.slice(0, 8); // Top 8 room recommendations
  }

  generateRecommendationReason(recommendation, room) {
    const reasons = [];
    
    if (recommendation.compatibilityScore > 0.8) {
      reasons.push("Perfect match for your preferences");
    } else if (recommendation.compatibilityScore > 0.6) {
      reasons.push("Great fit based on your profile");
    }
    
    if (recommendation.bookingProbability > 0.7) {
      reasons.push("High booking likelihood");
    }
    
    if (recommendation.predictedRating > 4.0) {
      reasons.push("Predicted high satisfaction");
    }
    
    if (room.pricePerNight < 150) {
      reasons.push("Great value for money");
    }
    
    if (room.capacity >= 4) {
      reasons.push("Spacious for groups");
    }

    return reasons.length > 0 ? reasons.join(" • ") : "Recommended for you";
  }

  getFallbackRecommendations(userProfile, availableRooms) {
    console.log('🔄 Using fallback rule-based recommendations');
    
    // Simple rule-based recommendations
    const rules = {
      business_traveler: ['Business Room', 'Standard Room', 'Junior Suite'],
      family_vacation: ['Family Suite', 'Deluxe Room', 'Junior Suite'],
      couple_romantic: ['Executive Suite', 'Presidential Suite', 'Deluxe Room'],
      solo_traveler: ['Standard Room', 'Business Room', 'Deluxe Room'],
      group_friends: ['Family Suite', 'Executive Suite', 'Deluxe Room'],
      luxury_seeker: ['Presidential Suite', 'Executive Suite', 'Junior Suite'],
      budget_conscious: ['Standard Room', 'Business Room', 'Deluxe Room']
    };

    const userType = userProfile.userType || 'solo_traveler';
    const preferredTypes = rules[userType] || rules.solo_traveler;
    
    if (availableRooms.length > 0) {
      return availableRooms
        .filter(room => preferredTypes.includes(room.type))
        .sort((a, b) => {
          const aIndex = preferredTypes.indexOf(a.type);
          const bIndex = preferredTypes.indexOf(b.type);
          return aIndex - bIndex;
        })
        .slice(0, 5)
        .map(room => ({
          roomId: room.id,
          roomType: room.type,
          compatibilityScore: 0.7,
          bookingProbability: 0.6,
          predictedRating: 4.0,
          confidence: 0.5,
          recommendationReason: "Recommended based on your profile",
          ...room
        }));
    }

    return preferredTypes.map((type, index) => ({
      roomType: type,
      compatibilityScore: 0.8 - (index * 0.1),
      bookingProbability: 0.7 - (index * 0.1),
      predictedRating: 4.5 - (index * 0.2),
      confidence: 0.6,
      recommendationReason: "Recommended based on your profile"
    }));
  }

  async getPersonalizedPricing(userProfile, roomId, basePrice) {
    if (!this.isLoaded) {
      return {
        originalPrice: basePrice,
        recommendedPrice: basePrice,
        discount: 0,
        reason: "Standard pricing"
      };
    }

    // Simple dynamic pricing based on user profile and predictions
    const recommendations = await this.getRecommendations(userProfile);
    const roomRec = recommendations.find(r => r.roomId === roomId);
    
    if (!roomRec) {
      return {
        originalPrice: basePrice,
        recommendedPrice: basePrice,
        discount: 0,
        reason: "Standard pricing"
      };
    }

    let discount = 0;
    let reason = "Standard pricing";

    // Apply discounts based on compatibility and booking probability
    if (roomRec.compatibilityScore > 0.8 && roomRec.bookingProbability < 0.5) {
      discount = 0.15; // 15% discount for high compatibility but low booking probability
      reason = "Special offer for you";
    } else if (roomRec.bookingProbability > 0.8) {
      discount = -0.05; // 5% premium for high demand
      reason = "High demand pricing";
    } else if (roomRec.compatibilityScore < 0.4) {
      discount = 0.10; // 10% discount for low compatibility
      reason = "Promotional pricing";
    }

    const recommendedPrice = basePrice * (1 - discount);

    return {
      originalPrice: basePrice,
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      discount: Math.round(discount * 100),
      reason
    };
  }
}

module.exports = RecommendationEngine;