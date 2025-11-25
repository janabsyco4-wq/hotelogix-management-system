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

// Get all rooms (public)
router.get('/', async (req, res) => {
  try {
    const { featured, available, type, minPrice, maxPrice } = req.query;
    
    const where = {};
    
    if (featured === 'true') where.featured = true;
    if (available === 'true') where.isAvailable = true;
    if (type) where.type = type;
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerNight.lte = parseFloat(maxPrice);
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { pricePerNight: 'asc' }
      ]
    });

    // Parse JSON fields for SQLite
    const roomsWithParsedData = rooms.map(room => ({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    }));

    res.json(roomsWithParsedData);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get featured rooms (public)
router.get('/featured', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { 
        featured: true,
        isAvailable: true
      },
      include: {
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { pricePerNight: 'asc' },
      take: 10
    });

    const roomsWithParsedData = rooms.map(room => ({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    }));

    res.json(roomsWithParsedData);
  } catch (error) {
    console.error('Error fetching featured rooms:', error);
    res.status(500).json({ error: 'Failed to fetch featured rooms' });
  }
});

// Get room by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: {
          where: {
            status: 'confirmed',
            checkOut: { gte: new Date() }
          },
          select: {
            checkIn: true,
            checkOut: true
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Parse JSON fields
    const roomWithParsedData = {
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    };

    res.json(roomWithParsedData);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Check room availability (public)
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'Check-in and check-out dates required' });
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: parseInt(id),
        status: 'confirmed',
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
    });

    const isAvailable = conflictingBookings.length === 0;
    
    res.json({ 
      available: isAvailable,
      conflictingBookings: conflictingBookings.length 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Create new room (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      roomNumber, type, title, description, location, capacity, 
      pricePerNight, images, amenities, size, bedType, featured 
    } = req.body;

    const room = await prisma.room.create({
      data: {
        roomNumber,
        type,
        title,
        description,
        location,
        capacity: parseInt(capacity),
        pricePerNight: parseFloat(pricePerNight),
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
        size,
        bedType,
        featured: featured || false
      }
    });

    res.status(201).json({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Convert arrays to JSON strings
    if (updateData.images) updateData.images = JSON.stringify(updateData.images);
    if (updateData.amenities) updateData.amenities = JSON.stringify(updateData.amenities);
    
    // Convert numeric fields
    if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);
    if (updateData.pricePerNight) updateData.pricePerNight = parseFloat(updateData.pricePerNight);

    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete room (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room has active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        roomId: parseInt(id),
        status: 'confirmed',
        checkOut: { gte: new Date() }
      }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete room with active bookings' 
      });
    }

    await prisma.room.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Toggle room availability (admin only)
router.patch('/:id/availability', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: { isAvailable }
    });

    res.json({
      ...room,
      images: JSON.parse(room.images || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    });
  } catch (error) {
    console.error('Error updating room availability:', error);
    res.status(500).json({ error: 'Failed to update room availability' });
  }
});

module.exports = router;