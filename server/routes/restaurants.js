const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

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

// Get all restaurants
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { cuisine, location, priceRange, featured } = req.query;

    const whereClause = {
      isActive: true
    };

    if (cuisine) whereClause.cuisine = { contains: cuisine };
    if (location) whereClause.location = location;
    if (priceRange) whereClause.priceRange = priceRange;
    if (featured === 'true') whereClause.featured = true;

    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' }
      ]
    });

    // Parse JSON fields
    const restaurantsWithParsedData = restaurants.map(restaurant => ({
      ...restaurant,
      images: JSON.parse(restaurant.images || '[]'),
      openingHours: restaurant.openingHours, // Keep as string
      menu: JSON.parse(restaurant.menu || '[]'),
      amenities: JSON.parse(restaurant.amenities || '[]')
    }));

    res.json(restaurantsWithParsedData);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get single restaurant
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(id) }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Parse JSON fields
    let openingHours;
    try {
      openingHours = JSON.parse(restaurant.openingHours || '{}');
    } catch (e) {
      // If openingHours is a plain string, keep it as is
      openingHours = restaurant.openingHours || 'Contact for hours';
    }

    const restaurantWithParsedData = {
      ...restaurant,
      images: JSON.parse(restaurant.images || '[]'),
      openingHours: openingHours,
      menu: JSON.parse(restaurant.menu || '[]'),
      amenities: JSON.parse(restaurant.amenities || '[]')
    };

    res.json(restaurantWithParsedData);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// Create dining reservation
router.post('/reservations', authenticateToken, async (req, res) => {
  try {
    const { restaurantId, date, time, guests, specialRequests } = req.body;
    const userId = req.user.userId;

    const reservation = await prisma.diningReservation.create({
      data: {
        userId,
        restaurantId: parseInt(restaurantId),
        date: new Date(date),
        time,
        guests: parseInt(guests),
        specialRequests: specialRequests || null,
        status: 'pending'
      },
      include: {
        restaurant: true,
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    // Parse restaurant JSON fields
    const reservationWithParsedData = {
      ...reservation,
      restaurant: {
        ...reservation.restaurant,
        images: JSON.parse(reservation.restaurant.images || '[]'),
        openingHours: JSON.parse(reservation.restaurant.openingHours || '{}'),
        menu: JSON.parse(reservation.restaurant.menu || '[]'),
        amenities: JSON.parse(reservation.restaurant.amenities || '[]')
      }
    };

    res.status(201).json(reservationWithParsedData);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Get user's reservations
router.get('/reservations/my-reservations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const reservations = await prisma.diningReservation.findMany({
      where: { userId },
      include: {
        restaurant: true
      },
      orderBy: { date: 'desc' }
    });

    // Parse JSON fields
    const reservationsWithParsedData = reservations.map(reservation => {
      let openingHours;
      try {
        openingHours = JSON.parse(reservation.restaurant.openingHours || '{}');
      } catch (e) {
        // If openingHours is a plain string, keep it as is
        openingHours = reservation.restaurant.openingHours || 'Contact for hours';
      }

      return {
        ...reservation,
        restaurant: {
          ...reservation.restaurant,
          images: JSON.parse(reservation.restaurant.images || '[]'),
          openingHours: openingHours,
          menu: JSON.parse(reservation.restaurant.menu || '[]'),
          amenities: JSON.parse(reservation.restaurant.amenities || '[]')
        }
      };
    });

    res.json(reservationsWithParsedData);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Cancel reservation
router.patch('/reservations/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const reservation = await prisma.diningReservation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedReservation = await prisma.diningReservation.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: {
        restaurant: true
      }
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

module.exports = router;
