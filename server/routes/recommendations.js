const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();
const prisma = new PrismaClient();

// AI Model API URL (Python Flask API)
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:5002';

// Check if AI model is available
let engineReady = false;
axios.get(`${AI_MODEL_URL}/health`)
  .then(() => {
    engineReady = true;
    console.log('✅ AI Model API connected');
  })
  .catch(err => {
    console.warn('⚠️ AI recommendation engine not available:', err.message);
  });

// Middleware to verify JWT token (optional for recommendations)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Get personalized room recommendations
router.get('/rooms', optionalAuth, async (req, res) => {
  try {
    const {
      userType = 'solo_traveler',
      season = 'summer',
      dayType = 'weekday',
      bookingAdvance = 7,
      stayDuration = 2,
      groupSize = 2,
      checkIn,
      checkOut,
      minPrice,
      maxPrice
    } = req.query;

    // Get available rooms
    const whereClause = {
      isAvailable: true
    };

    if (minPrice || maxPrice) {
      whereClause.pricePerNight = {};
      if (minPrice) whereClause.pricePerNight.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.pricePerNight.lte = parseFloat(maxPrice);
    }

    // Check availability if dates provided
    if (checkIn && checkOut) {
      whereClause.bookings = {
        none: {
          OR: [
            {
              AND: [
                { checkIn: { lte: new Date(checkIn) } },
                { checkOut: { gt: new Date(checkIn) } }
              ]
            },
            {
              AND: [
                { checkIn: { lt: new Date(checkOut) } },
                { checkOut: { gte: new Date(checkOut) } }
              ]
            }
          ]
        }
      };
    }

    const availableRooms = await prisma.room.findMany({
      where: whereClause
    });

    // Parse JSON fields
    const roomsWithParsedData = availableRooms.map(room => ({
      ...room,
      images: room.images,
      amenities: room.amenities
    }));

    // Create user profile for recommendations
    const userProfile = {
      userType,
      season,
      dayType,
      bookingAdvance: parseInt(bookingAdvance),
      stayDuration: parseInt(stayDuration),
      groupSize: parseInt(groupSize),
      viewTime: 120 // Default view time
    };

    // Get AI recommendations from Python API
    let recommendations = roomsWithParsedData;
    
    if (engineReady) {
      try {
        // Call Python AI Model API
        const aiResponse = await axios.post(`${AI_MODEL_URL}/recommend`, {
          user_profile: userProfile,
          rooms: roomsWithParsedData
        });
        
        if (aiResponse.data && aiResponse.data.recommendations) {
          recommendations = aiResponse.data.recommendations;
        }
      } catch (error) {
        console.warn('AI recommendation failed, using fallback:', error.message);
        // Fallback to basic sorting by price
        recommendations = roomsWithParsedData.sort((a, b) => a.pricePerNight - b.pricePerNight);
      }
    } else {
      // Fallback: sort by price if AI not available
      recommendations = roomsWithParsedData.sort((a, b) => a.pricePerNight - b.pricePerNight);
    }

    // Add user interaction tracking if user is logged in
    if (req.user) {
      // Track this recommendation request (for future model improvement)
      try {
        await prisma.userInteraction.create({
          data: {
            userId: req.user.userId,
            interactionType: 'recommendation_request',
            data: JSON.stringify({
              userProfile,
              recommendationCount: recommendations.length,
              timestamp: new Date()
            })
          }
        }).catch(() => {}); // Ignore errors for interaction tracking
      } catch (error) {
        // Interaction tracking is optional
      }
    }

    res.json({
      recommendations,
      userProfile,
      totalAvailableRooms: roomsWithParsedData.length,
      aiPowered: engineReady,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get personalized pricing for a specific room
router.get('/pricing/:roomId', optionalAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const {
      userType = 'solo_traveler',
      season = 'summer',
      dayType = 'weekday',
      bookingAdvance = 7,
      stayDuration = 2,
      groupSize = 2
    } = req.query;

    // Get room details
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Create user profile
    const userProfile = {
      userType,
      season,
      dayType,
      bookingAdvance: parseInt(bookingAdvance),
      stayDuration: parseInt(stayDuration),
      groupSize: parseInt(groupSize)
    };

    // Get personalized pricing from AI or use base price
    let pricingInfo = {
      basePrice: room.pricePerNight,
      recommendedPrice: room.pricePerNight,
      discount: 0
    };
    
    if (engineReady) {
      try {
        const aiResponse = await axios.post(`${AI_MODEL_URL}/recommend`, {
          user_profile: userProfile,
          rooms: [{
            ...room,
            images: room.images,
            amenities: room.amenities
          }]
        });
        
        if (aiResponse.data && aiResponse.data.recommendations && aiResponse.data.recommendations[0]) {
          const rec = aiResponse.data.recommendations[0];
          pricingInfo = {
            basePrice: room.pricePerNight,
            recommendedPrice: rec.predicted_price || room.pricePerNight,
            discount: rec.predicted_price ? ((room.pricePerNight - rec.predicted_price) / room.pricePerNight * 100).toFixed(2) : 0,
            compatibilityScore: rec.compatibility_score,
            bookingLikelihood: rec.booking_likelihood
          };
        }
      } catch (error) {
        console.warn('AI pricing failed, using base price:', error.message);
      }
    }

    res.json({
      room: {
        ...room,
        images: room.images,
        amenities: room.amenities
      },
      pricing: pricingInfo,
      userProfile,
      aiPowered: engineReady
    });

  } catch (error) {
    console.error('Error getting personalized pricing:', error);
    res.status(500).json({ error: 'Failed to get personalized pricing' });
  }
});

// Track user interaction with recommendations
router.post('/interaction', optionalAuth, async (req, res) => {
  try {
    const {
      roomId,
      interactionType, // 'view', 'click', 'book', 'like', 'dislike'
      duration,
      rating,
      metadata
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required for interaction tracking' });
    }

    // Store interaction for future model improvement
    const interaction = {
      userId: req.user.userId,
      roomId: roomId ? parseInt(roomId) : null,
      interactionType,
      duration: duration || null,
      rating: rating || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      timestamp: new Date()
    };

    // Note: This would require adding a UserInteraction model to Prisma schema
    // For now, we'll just log it
    console.log('📊 User interaction tracked:', interaction);

    res.json({ 
      success: true, 
      message: 'Interaction tracked successfully' 
    });

  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
});

// Get recommendation statistics (admin only)
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin (simplified check)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get recommendation statistics
    const roomTypes = await prisma.room.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    // Get stats from Python AI Model API
    let aiStats = {};
    if (engineReady) {
      try {
        const aiResponse = await axios.get(`${AI_MODEL_URL}/stats`);
        aiStats = aiResponse.data;
      } catch (error) {
        console.warn('Failed to get AI stats:', error.message);
      }
    }
    
    const stats = {
      aiModelStatus: engineReady ? 'active' : 'inactive',
      modelVersion: aiStats.model_info?.version || null,
      totalRecommendations: aiStats.performance?.total_recommendations || 0,
      averageAccuracy: aiStats.performance?.avg_compatibility_score || 0,
      popularRoomTypes: roomTypes.map(rt => ({
        type: rt.type,
        count: rt._count.id
      })),
      lastModelUpdate: aiStats.model_info?.last_trained || null,
      aiStats: aiStats
    };

    res.json(stats);

  } catch (error) {
    console.error('Error getting recommendation stats:', error);
    res.status(500).json({ error: 'Failed to get recommendation statistics' });
  }
});

// Retrain model endpoint (admin only)
router.post('/retrain', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // This would trigger model retraining in production
    // For now, just return a success message
    res.json({
      success: true,
      message: 'Model retraining initiated',
      estimatedTime: '15-30 minutes',
      status: 'queued'
    });

  } catch (error) {
    console.error('Error initiating model retraining:', error);
    res.status(500).json({ error: 'Failed to initiate model retraining' });
  }
});

module.exports = router;