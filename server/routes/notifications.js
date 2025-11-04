const express = require('express');
const router = express.Router();
const NotificationService = require('../services/notificationService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * Get all notifications
 * GET /api/notifications
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { skip = 0, take = 50, unreadOnly = false } = req.query;
    
    const result = await NotificationService.getAll({
      skip: parseInt(skip),
      take: parseInt(take),
      unreadOnly: unreadOnly === 'true'
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
router.get('/unread-count', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const count = await NotificationService.getUnreadCount();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
router.patch('/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.markAsRead(id);
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
router.patch('/read-all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await NotificationService.markAllAsRead();
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationService.delete(id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;
