const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token (optional)
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

// Middleware to verify JWT token (required)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get active deals only
router.get('/active', optionalAuth, async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() }
      },
      orderBy: [
        { featured: 'desc' },
        { discount: 'desc' }
      ]
    });

    const dealsWithParsedData = deals.map(deal => ({
      ...deal,
      images: JSON.parse(deal.images || '[]'),
      available: deal.maxRedemptions ? (deal.maxRedemptions - deal.currentRedemptions) : null,
      percentageLeft: deal.maxRedemptions ? 
        Math.round(((deal.maxRedemptions - deal.currentRedemptions) / deal.maxRedemptions) * 100) : 100
    }));

    res.json(dealsWithParsedData);
  } catch (error) {
    console.error('Error fetching active deals:', error);
    res.status(500).json({ error: 'Failed to fetch active deals' });
  }
});

// Get all deals
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, location, featured } = req.query;

    const whereClause = {
      isActive: true,
      validFrom: { lte: new Date() },
      validUntil: { gte: new Date() }
    };

    if (type) whereClause.type = type;
    if (location && location !== 'Both') whereClause.location = { in: [location, 'Both'] };
    if (featured === 'true') whereClause.featured = true;

    const deals = await prisma.deal.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { discount: 'desc' }
      ]
    });

    // Parse JSON fields and calculate availability
    const dealsWithParsedData = deals.map(deal => ({
      ...deal,
      images: JSON.parse(deal.images || '[]'),
      available: deal.maxRedemptions ? (deal.maxRedemptions - deal.currentRedemptions) : null,
      percentageLeft: deal.maxRedemptions ? 
        Math.round(((deal.maxRedemptions - deal.currentRedemptions) / deal.maxRedemptions) * 100) : 100
    }));

    res.json(dealsWithParsedData);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get single deal
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await prisma.deal.findUnique({
      where: { id: parseInt(id) }
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Parse JSON fields
    const dealWithParsedData = {
      ...deal,
      images: JSON.parse(deal.images || '[]'),
      available: deal.maxRedemptions ? (deal.maxRedemptions - deal.currentRedemptions) : null,
      percentageLeft: deal.maxRedemptions ? 
        Math.round(((deal.maxRedemptions - deal.currentRedemptions) / deal.maxRedemptions) * 100) : 100
    };

    res.json(dealWithParsedData);
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Redeem a deal
router.post('/:id/redeem', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deal = await prisma.deal.findUnique({
      where: { id: parseInt(id) }
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    if (!deal.isActive) {
      return res.status(400).json({ error: 'Deal is no longer active' });
    }

    if (new Date() < deal.validFrom || new Date() > deal.validUntil) {
      return res.status(400).json({ error: 'Deal is not valid at this time' });
    }

    if (deal.maxRedemptions && deal.currentRedemptions >= deal.maxRedemptions) {
      return res.status(400).json({ error: 'Deal has reached maximum redemptions' });
    }

    // Generate unique redemption code
    const redemptionCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    // Create redemption and update deal counter in a transaction
    const [redemption, updatedDeal] = await prisma.$transaction([
      prisma.dealRedemption.create({
        data: {
          userId,
          dealId: parseInt(id),
          redemptionCode,
          status: 'active'
        },
        include: {
          deal: true
        }
      }),
      prisma.deal.update({
        where: { id: parseInt(id) },
        data: {
          currentRedemptions: { increment: 1 }
        }
      })
    ]);

    // Parse JSON fields
    const redemptionWithParsedData = {
      ...redemption,
      deal: {
        ...redemption.deal,
        images: JSON.parse(redemption.deal.images || '[]')
      }
    };

    res.status(201).json(redemptionWithParsedData);
  } catch (error) {
    console.error('Error redeeming deal:', error);
    res.status(500).json({ error: 'Failed to redeem deal' });
  }
});

// Get user's redeemed deals
router.get('/redemptions/my-deals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const redemptions = await prisma.dealRedemption.findMany({
      where: { userId },
      include: {
        deal: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields
    const redemptionsWithParsedData = redemptions.map(redemption => ({
      ...redemption,
      deal: {
        ...redemption.deal,
        images: JSON.parse(redemption.deal.images || '[]')
      }
    }));

    res.json(redemptionsWithParsedData);
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});

// Mark deal as used
router.patch('/redemptions/:code/use', authenticateToken, async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.userId;

    const redemption = await prisma.dealRedemption.findUnique({
      where: { redemptionCode: code }
    });

    if (!redemption) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    if (redemption.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (redemption.status === 'used') {
      return res.status(400).json({ error: 'Deal already used' });
    }

    const updatedRedemption = await prisma.dealRedemption.update({
      where: { redemptionCode: code },
      data: {
        status: 'used',
        redeemedAt: new Date()
      },
      include: {
        deal: true
      }
    });

    res.json(updatedRedemption);
  } catch (error) {
    console.error('Error using redemption:', error);
    res.status(500).json({ error: 'Failed to use redemption' });
  }
});

module.exports = router;
