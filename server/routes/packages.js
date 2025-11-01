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

// Get all packages
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { location, featured } = req.query;

    const whereClause = {
      isActive: true
    };

    if (location && location !== 'Both') whereClause.location = { in: [location, 'Both'] };
    if (featured === 'true') whereClause.featured = true;

    const packages = await prisma.package.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { price: 'asc' }
      ]
    });

    // Parse JSON fields
    const packagesWithParsedData = packages.map(pkg => ({
      ...pkg,
      includes: JSON.parse(pkg.includes || '[]'),
      images: JSON.parse(pkg.images || '[]')
    }));

    res.json(packagesWithParsedData);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Get single package
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await prisma.package.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Parse JSON fields
    const packageWithParsedData = {
      ...pkg,
      includes: JSON.parse(pkg.includes || '[]'),
      images: JSON.parse(pkg.images || '[]')
    };

    res.json(packageWithParsedData);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// Book a package
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, guests } = req.body;
    const userId = req.user.userId;

    const pkg = await prisma.package.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    if (!pkg.isActive) {
      return res.status(400).json({ error: 'Package is not available' });
    }

    const booking = await prisma.packageBooking.create({
      data: {
        userId,
        packageId: parseInt(id),
        startDate: new Date(startDate),
        guests: parseInt(guests),
        totalPrice: pkg.price,
        status: 'confirmed'
      },
      include: {
        package: true,
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    // Parse package JSON fields
    const bookingWithParsedData = {
      ...booking,
      package: {
        ...booking.package,
        includes: JSON.parse(booking.package.includes || '[]'),
        images: JSON.parse(booking.package.images || '[]')
      }
    };

    res.status(201).json(bookingWithParsedData);
  } catch (error) {
    console.error('Error booking package:', error);
    res.status(500).json({ error: 'Failed to book package' });
  }
});

// Get user's package bookings
router.get('/bookings/my-packages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.packageBooking.findMany({
      where: { userId },
      include: {
        package: true
      },
      orderBy: { startDate: 'desc' }
    });

    // Parse JSON fields
    const bookingsWithParsedData = bookings.map(booking => ({
      ...booking,
      package: {
        ...booking.package,
        includes: JSON.parse(booking.package.includes || '[]'),
        images: JSON.parse(booking.package.images || '[]')
      }
    }));

    res.json(bookingsWithParsedData);
  } catch (error) {
    console.error('Error fetching package bookings:', error);
    res.status(500).json({ error: 'Failed to fetch package bookings' });
  }
});

// Cancel package booking
router.patch('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.packageBooking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedBooking = await prisma.packageBooking.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: {
        package: true
      }
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error cancelling package booking:', error);
    res.status(500).json({ error: 'Failed to cancel package booking' });
  }
});

module.exports = router;
