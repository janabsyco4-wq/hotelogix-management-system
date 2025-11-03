const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { sendBookingConfirmation } = require('../services/emailService');

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

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const userId = req.user.userId;
    
    console.log('📝 Booking Request:', { userId, roomId, checkIn, checkOut });
    console.log('👤 User from token:', req.user);

    // Get room details for pricing
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userExists) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found. Please login again.' });
    }
    
    console.log('✅ User verified:', userExists.email);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: parseInt(roomId),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: 'confirmed'
      },
      include: {
        room: true,
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
    
    console.log('✅ Booking created:', booking.id);

    // Track booking in AI Model for analytics
    try {
      const axios = require('axios');
      const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:5002';
      
      await axios.post(`${AI_MODEL_URL}/track`, {
        type: 'booking',
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
        revenue: totalPrice,
        room_type: room.type
      });
      
      console.log('📊 Booking tracked in AI Analytics');
    } catch (trackError) {
      console.warn('⚠️ Failed to track booking in AI:', trackError.message);
      // Don't fail the booking if tracking fails
    }

    // Send booking confirmation email
    try {
      await sendBookingConfirmation(booking, booking.user, booking.room);
      console.log('📧 Booking confirmation email sent to:', booking.user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send booking email:', emailError.message);
      // Don't fail the booking if email fails
    }

    // Parse JSON fields in room data
    const bookingWithParsedData = {
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]'),
        amenities: JSON.parse(booking.room.amenities || '[]')
      }
    };

    res.status(201).json(bookingWithParsedData);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields in room data
    const bookingsWithParsedData = bookings.map(booking => ({
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]'),
        amenities: JSON.parse(booking.room.amenities || '[]')
      }
    }));

    res.json(bookingsWithParsedData);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        userId
      },
      include: {
        room: true,
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Parse JSON fields in room data
    const bookingWithParsedData = {
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]'),
        amenities: JSON.parse(booking.room.amenities || '[]')
      }
    };

    res.json(bookingWithParsedData);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.booking.updateMany({
      where: {
        id: parseInt(id),
        userId,
        status: { not: 'cancelled' }
      },
      data: {
        status: 'cancelled'
      }
    });

    if (booking.count === 0) {
      return res.status(404).json({ error: 'Booking not found or already cancelled' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;