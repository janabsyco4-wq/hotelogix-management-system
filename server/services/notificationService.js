const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Notification Service
 * Handles creation and management of admin notifications
 */

const NotificationService = {
  /**
   * Create a new notification
   */
  async create({ type, title, message, relatedId, relatedType, priority = 'normal' }) {
    try {
      const notification = await prisma.notification.create({
        data: {
          type,
          title,
          message,
          relatedId,
          relatedType,
          priority,
          isRead: false
        }
      });
      
      console.log(`📢 Notification created: ${title}`);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Create notification for new booking
   */
  async notifyNewBooking(booking, user, room) {
    return this.create({
      type: 'booking',
      title: '🛏️ New Room Booking',
      message: `${user.name} booked ${room.title} for PKR ${booking.totalPrice.toLocaleString()}`,
      relatedId: booking.id,
      relatedType: 'booking',
      priority: 'high'
    });
  },

  /**
   * Create notification for cancellation request
   */
  async notifyCancellation(booking, user, room, reason) {
    return this.create({
      type: 'cancellation',
      title: '❌ Cancellation Request - Refund Pending',
      message: `${user.name} cancelled booking #${booking.id} (${room.title}) - PKR ${booking.totalPrice.toLocaleString()}. Reason: ${reason}`,
      relatedId: booking.id,
      relatedType: 'booking',
      priority: 'urgent'
    });
  },

  /**
   * Create notification for new user registration
   */
  async notifyNewUser(user) {
    return this.create({
      type: 'user',
      title: '👤 New User Registered',
      message: `${user.name} (${user.email}) joined the platform`,
      relatedId: user.id,
      relatedType: 'user',
      priority: 'normal'
    });
  },

  /**
   * Create notification for payment received
   */
  async notifyPayment(booking, user, amount) {
    return this.create({
      type: 'payment',
      title: '💳 Payment Received',
      message: `Payment of PKR ${amount.toLocaleString()} received from ${user.name} for booking #${booking.id}`,
      relatedId: booking.id,
      relatedType: 'booking',
      priority: 'normal'
    });
  },

  /**
   * Create notification for refund processed
   */
  async notifyRefund(booking, amount) {
    return this.create({
      type: 'refund',
      title: '💸 Refund Processed',
      message: `Refund of PKR ${amount.toLocaleString()} processed for booking #${booking.id}`,
      relatedId: booking.id,
      relatedType: 'booking',
      priority: 'high'
    });
  },

  /**
   * Create notification for new review
   */
  async notifyNewReview(review, user, room) {
    return this.create({
      type: 'review',
      title: '⭐ New Review',
      message: `${user.name} left a ${review.rating}-star review for ${room.title}`,
      relatedId: review.id,
      relatedType: 'review',
      priority: 'low'
    });
  },

  /**
   * Get all notifications (with pagination)
   */
  async getAll({ skip = 0, take = 50, unreadOnly = false }) {
    const where = unreadOnly ? { isRead: false } : {};
    
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { isRead: false } })
    ]);

    return {
      notifications,
      total,
      unreadCount,
      hasMore: skip + take < total
    };
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id) {
    return prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
  },

  /**
   * Delete notification
   */
  async delete(id) {
    return prisma.notification.delete({
      where: { id: parseInt(id) }
    });
  },

  /**
   * Get unread count
   */
  async getUnreadCount() {
    return prisma.notification.count({
      where: { isRead: false }
    });
  }
};

module.exports = NotificationService;
