const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const { status = 'approved', sortBy = 'newest', rating } = req.query;

    let where = {
      status: status
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    let orderBy = {};
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest':
        orderBy = { rating: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            title: true,
            roomNumber: true
          }
        }
      }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get all reviews for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status = 'approved', sortBy = 'newest', rating } = req.query;

    let where = {
      roomId: parseInt(roomId),
      status: status
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    let orderBy = {};
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'highest':
        orderBy = { rating: 'desc' };
        break;
      case 'lowest':
        orderBy = { rating: 'asc' };
        break;
      case 'helpful':
        orderBy = { helpful: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { rating, title, comment, roomId, bookingId } = req.body;
    const userId = req.user.userId;

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Not your booking' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Can only review confirmed bookings' });
    }

    if (new Date() < new Date(booking.checkOut)) {
      return res.status(400).json({ error: 'Can only review after checkout' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted for this booking' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        title,
        comment,
        userId,
        roomId: parseInt(roomId),
        bookingId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Mark review as helpful/not helpful
router.post('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // true or false

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        [helpful ? 'helpful' : 'notHelpful']: {
          increment: 1
        }
      }
    });

    res.json(review);
  } catch (error) {
    console.error('Error updating helpful count:', error);
    res.status(500).json({ error: 'Failed to update helpful count' });
  }
});

// Admin: Get all pending reviews
router.get('/admin/pending', authenticateToken, isAdmin, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            title: true,
            roomNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
});

// Admin: Approve/reject review
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Recalculate room average rating
    if (status === 'approved' || status === 'rejected') {
      await updateRoomRating(review.roomId);
    }

    res.json(review);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// Admin: Get review statistics
router.get('/admin/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [pending, approved, rejected, totalReviews] = await Promise.all([
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.review.count({ where: { status: 'approved' } }),
      prisma.review.count({ where: { status: 'rejected' } }),
      prisma.review.count()
    ]);

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { status: 'approved' },
      _count: true
    });

    // Get rooms with low ratings
    const lowRatedRooms = await prisma.room.findMany({
      where: {
        averageRating: { lt: 3.0, gt: 0 }
      },
      select: {
        id: true,
        title: true,
        roomNumber: true,
        averageRating: true,
        reviewCount: true
      }
    });

    res.json({
      pending,
      approved,
      rejected,
      total: totalReviews,
      ratingDistribution,
      lowRatedRooms
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

// Helper function to update room rating
async function updateRoomRating(roomId) {
  const reviews = await prisma.review.findMany({
    where: {
      roomId,
      status: 'approved'
    },
    select: {
      rating: true
    }
  });

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  await prisma.room.update({
    where: { id: roomId },
    data: {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount
    }
  });
}

module.exports = router;
