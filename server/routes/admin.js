const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
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

// Middleware to verify admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalRooms,
      availableRooms,
      totalBookings,
      activeBookings,
      totalUsers,
      totalRevenue,
      recentBookings
    ] = await Promise.all([
      prisma.room.count(),
      prisma.room.count({ where: { isAvailable: true } }),
      prisma.booking.count(),
      prisma.booking.count({ 
        where: { 
          status: 'confirmed',
          checkOut: { gte: new Date() }
        }
      }),
      prisma.user.count({ where: { role: 'user' } }),
      prisma.booking.aggregate({
        where: { status: 'confirmed' },
        _sum: { totalPrice: true }
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          room: { select: { roomNumber: true, type: true, location: true } }
        }
      })
    ]);

    res.json({
      statistics: {
        totalRooms,
        availableRooms,
        occupiedRooms: totalRooms - availableRooms,
        totalBookings,
        activeBookings,
        totalUsers,
        totalRevenue: totalRevenue._sum.totalPrice || 0
      },
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all bookings with filters
router.get('/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, dateFrom, dateTo, roomId } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (roomId) where.roomId = parseInt(roomId);
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        room: { 
          select: { 
            roomNumber: true, 
            type: true, 
            title: true,
            location: true,
            images: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse room images
    const bookingsWithParsedData = bookings.map(booking => ({
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]')
      }
    }));

    res.json(bookingsWithParsedData);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        room: { select: { roomNumber: true, type: true, location: true } }
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            reservations: true,
            redemptions: true,
            packageBookings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total bookings for each user
    const usersWithTotalBookings = users.map(user => ({
      ...user,
      totalBookings: (user._count?.bookings || 0) + 
                     (user._count?.reservations || 0) + 
                     (user._count?.redemptions || 0) + 
                     (user._count?.packageBookings || 0)
    }));

    res.json(usersWithTotalBookings);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get all dining reservations
router.get('/reservations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reservations = await prisma.diningReservation.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        restaurant: { select: { name: true, location: true, cuisine: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Get all deal redemptions
router.get('/redemptions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const redemptions = await prisma.dealRedemption.findMany({
      include: {
        user: { select: { name: true, email: true } },
        deal: { select: { title: true, type: true, dealPrice: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(redemptions);
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});

// Get all package bookings
router.get('/package-bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const packageBookings = await prisma.packageBooking.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        package: { select: { name: true, location: true, duration: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(packageBookings);
  } catch (error) {
    console.error('Error fetching package bookings:', error);
    res.status(500).json({ error: 'Failed to fetch package bookings' });
  }
});

// Revenue analytics
router.get('/analytics/revenue', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bookings = await prisma.booking.findMany({
      where: {
        status: 'confirmed',
        createdAt: { gte: startDate }
      },
      select: {
        totalPrice: true,
        createdAt: true,
        room: {
          select: { type: true }
        }
      }
    });

    // Group by date
    const dailyRevenue = {};
    const roomTypeRevenue = {};

    bookings.forEach(booking => {
      const date = booking.createdAt.toISOString().split('T')[0];
      const roomType = booking.room.type;

      dailyRevenue[date] = (dailyRevenue[date] || 0) + booking.totalPrice;
      roomTypeRevenue[roomType] = (roomTypeRevenue[roomType] || 0) + booking.totalPrice;
    });

    res.json({
      dailyRevenue,
      roomTypeRevenue,
      totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
      totalBookings: bookings.length
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

module.exports = router;