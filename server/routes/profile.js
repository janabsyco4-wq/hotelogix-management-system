const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// GET /api/profile - Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        profileImage: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            diningReservations: true,
            dealRedemptions: true,
            packageBookings: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total spent
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.userId,
        status: { in: ['confirmed', 'refunded'] }
      },
      select: { totalPrice: true, status: true }
    });

    const packageBookings = await prisma.packageBooking.findMany({
      where: {
        userId: req.user.userId,
        status: { in: ['confirmed', 'refunded'] }
      },
      select: { totalPrice: true, status: true }
    });

    const totalSpent = [
      ...bookings.filter(b => b.status === 'confirmed'),
      ...packageBookings.filter(b => b.status === 'confirmed')
    ].reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      ...user,
      stats: {
        totalBookings: user._count.bookings,
        totalDiningReservations: user._count.diningReservations,
        totalDealRedemptions: user._count.dealRedemptions,
        totalPackageBookings: user._count.packageBookings,
        totalSpent: totalSpent
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, city, country, profileImage } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: name.trim(),
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || null,
        profileImage: profileImage || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        profileImage: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /api/profile/password - Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
