import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Notifications.css';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin');
            return;
        }
        fetchNotifications();
    }, [user, navigate]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications?take=100');
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            await axios.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);

        if (notification.type === 'cancellation') {
            navigate(`/admin/refund/${notification.relatedId}`);
        } else if (notification.type === 'booking') {
            navigate('/admin');
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            booking: '🛏️',
            cancellation: '❌',
            payment: '💳',
            refund: '💸',
            user: '👤',
            review: '⭐'
        };
        return icons[type] || '📢';
    };

    const getPriorityClass = (priority) => {
        return `priority-${priority}`;
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return <Loading message="Loading notifications..." />;
    }

    return (
        <div className="notifications-page">
            <div className="notifications-hero">
                <div className="container">
                    <button onClick={() => navigate('/admin')} className="back-btn">
                        ← Back to Dashboard
                    </button>
                    <h1>🔔 Notifications</h1>
                    <p>Manage all your admin notifications</p>
                </div>
            </div>

            <div className="notifications-content">
                <div className="container">
                    <div className="notifications-header">
                        <div className="notifications-stats">
                            <div className="stat-item">
                                <span className="stat-number">{notifications.length}</span>
                                <span className="stat-label">Total</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{unreadCount}</span>
                                <span className="stat-label">Unread</span>
                            </div>
                        </div>

                        <div className="notifications-actions">
                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                                    onClick={() => setFilter('unread')}
                                >
                                    Unread
                                </button>
                                <button
                                    className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                                    onClick={() => setFilter('read')}
                                >
                                    Read
                                </button>
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="btn btn-primary">
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="notifications-list">
                        {filteredNotifications.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-inbox"></i>
                                <h3>No notifications</h3>
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${!notification.isRead ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div
                                        className="notification-content"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{getTimeAgo(notification.createdAt)}</div>
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.isRead && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                className="action-btn"
                                                title="Mark as read"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                            className="action-btn delete"
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    {!notification.isRead && <div className="unread-indicator"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
