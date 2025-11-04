import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';

import './Bookings.css';

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('rooms');
    const [roomBookings, setRoomBookings] = useState([]);
    const [diningReservations, setDiningReservations] = useState([]);
    const [dealRedemptions, setDealRedemptions] = useState([]);
    const [packageBookings, setPackageBookings] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAllBookings();
    }, [user, navigate]);

    const fetchAllBookings = async () => {
        try {
            setLoading(true);

            // Add auth token to requests
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            const [rooms, dining, deals, packages] = await Promise.all([
                axios.get('/api/bookings/my-bookings', config).catch((err) => {
                    console.log('Room bookings error:', err.response?.data || err.message);
                    return { data: [] };
                }),
                axios.get('/api/restaurants/reservations/my-reservations', config).catch((err) => {
                    console.log('Dining reservations error:', err.response?.data || err.message);
                    return { data: [] };
                }),
                axios.get('/api/deals/redemptions/my-deals', config).catch((err) => {
                    console.log('Deal redemptions error:', err.response?.data || err.message);
                    return { data: [] };
                }),
                axios.get('/api/packages/bookings/my-packages', config).catch((err) => {
                    console.log('Package bookings error:', err.response?.data || err.message);
                    return { data: [] };
                })
            ]);

            console.log('Fetched data:', { rooms: rooms.data, dining: dining.data, deals: deals.data, packages: packages.data });

            setRoomBookings(rooms.data || []);
            setDiningReservations(dining.data || []);
            setDealRedemptions(deals.data || []);
            setPackageBookings(packages.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (bookingId) => {
        navigate(`/cancel-booking/${bookingId}`);
    };



    const cancelDiningReservation = async (id) => {
        if (!window.confirm('Cancel this reservation?')) return;
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            await axios.patch(`/api/restaurants/reservations/${id}/cancel`, {}, config);
            toast.success('Reservation cancelled');
            fetchAllBookings();
        } catch (error) {
            console.error('Cancel reservation error:', error);
            toast.error(error.response?.data?.error || 'Failed to cancel reservation');
        }
    };

    const cancelPackageBooking = async (id) => {
        if (!window.confirm('Cancel this package?')) return;
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            await axios.patch(`/api/packages/bookings/${id}/cancel`, {}, config);
            toast.success('Package cancelled');
            fetchAllBookings();
        } catch (error) {
            console.error('Cancel package error:', error);
            toast.error(error.response?.data?.error || 'Failed to cancel package');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {
        return time;
    };

    if (loading) {
        return <Loading message="Loading your bookings..." />;
    }

    const totalBookings = roomBookings.length + diningReservations.length + dealRedemptions.length + packageBookings.length;

    return (
        <div className="bookings-page">
            <div className="bookings-hero">
                <div className="hero-decoration">
                    <div className="float-element float-1"></div>
                    <div className="float-element float-2"></div>
                    <div className="float-element float-3"></div>
                </div>
                <div className="container">
                    <h1>📋 My Bookings & Reservations</h1>
                    <p>Manage all your bookings, reservations, deals, and packages</p>
                    <div className="booking-stats">
                        <div className="stat-box">
                            <span className="stat-number">{totalBookings}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">{roomBookings.length}</span>
                            <span className="stat-label">Rooms</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">{diningReservations.length}</span>
                            <span className="stat-label">Dining</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">{dealRedemptions.length}</span>
                            <span className="stat-label">Deals</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">{packageBookings.length}</span>
                            <span className="stat-label">Packages</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bookings-content">
                <div className="container">
                    <div className="booking-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rooms')}
                        >
                            🛏️ Room Bookings ({roomBookings.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'dining' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dining')}
                        >
                            🍽️ Dining Reservations ({diningReservations.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
                            onClick={() => setActiveTab('deals')}
                        >
                            🎁 My Deals ({dealRedemptions.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('packages')}
                        >
                            📦 Packages ({packageBookings.length})
                        </button>
                    </div>

                    {/* Room Bookings Tab */}
                    {activeTab === 'rooms' && (
                        <div className="tab-content">
                            {roomBookings.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🛏️</div>
                                    <h3>No room bookings yet</h3>
                                    <p>Start exploring our rooms and make your first booking!</p>
                                    <button onClick={() => navigate('/rooms')} className="btn btn-primary">
                                        Browse Rooms
                                    </button>
                                </div>
                            ) : (
                                <div className="bookings-grid">
                                    {roomBookings.map((booking) => (
                                        <div key={booking.id} className="booking-card">
                                            <div className="booking-image">
                                                <img src={booking.room.images?.[0] || ''} alt={booking.room.title} />
                                                <span className={`status-badge ${booking.status}`}>
                                                    {booking.status === 'pending_cancellation' ? 'Cancellation in Progress' : booking.status}
                                                </span>
                                            </div>
                                            <div className="booking-details">
                                                <h3>{booking.room.title}</h3>
                                                <p className="location">📍 {booking.room.location}</p>
                                                <div className="booking-dates">
                                                    <div className="date-item">
                                                        <span className="label">Check-in</span>
                                                        <span className="value">{formatDate(booking.checkIn)}</span>
                                                    </div>
                                                    <div className="date-item">
                                                        <span className="label">Check-out</span>
                                                        <span className="value">{formatDate(booking.checkOut)}</span>
                                                    </div>
                                                </div>
                                                <div className="booking-price">
                                                    <span className="label">Total</span>
                                                    <span className="amount">₨{booking.totalPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
                                                </div>
                                                <div className="booking-actions">
                                                    <button onClick={() => navigate(`/rooms/${booking.room.id}`)} className="btn btn-secondary">
                                                        View Room
                                                    </button>
                                                    {booking.status === 'pending_cancellation' && (
                                                        <div className="cancellation-notice">
                                                            ⏳ Waiting for admin approval
                                                        </div>
                                                    )}
                                                    {(booking.status === 'confirmed' || booking.status === 'pending') && booking.status !== 'cancelled' && booking.status !== 'pending_cancellation' && (
                                                        <button
                                                            onClick={() => handleCancelClick(booking.id)}
                                                            className="btn btn-danger"
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dining Reservations Tab */}
                    {activeTab === 'dining' && (
                        <div className="tab-content">
                            {diningReservations.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🍽️</div>
                                    <h3>No dining reservations yet</h3>
                                    <p>Explore our restaurants and make a reservation!</p>
                                    <button onClick={() => navigate('/dining')} className="btn btn-primary">
                                        Browse Restaurants
                                    </button>
                                </div>
                            ) : (
                                <div className="bookings-grid">
                                    {diningReservations.map((reservation) => (
                                        <div key={reservation.id} className="booking-card">
                                            <div className="booking-image">
                                                <img src={reservation.restaurant.images?.[0] || ''} alt={reservation.restaurant.name} />
                                                <span className={`status-badge ${reservation.status}`}>{reservation.status}</span>
                                            </div>
                                            <div className="booking-details">
                                                <h3>{reservation.restaurant.name}</h3>
                                                <p className="location">📍 {reservation.restaurant.location}</p>
                                                <p className="cuisine">{reservation.restaurant.cuisine}</p>
                                                <div className="booking-dates">
                                                    <div className="date-item">
                                                        <span className="label">Date</span>
                                                        <span className="value">{formatDate(reservation.date)}</span>
                                                    </div>
                                                    <div className="date-item">
                                                        <span className="label">Time</span>
                                                        <span className="value">{formatTime(reservation.time)}</span>
                                                    </div>
                                                    <div className="date-item">
                                                        <span className="label">Guests</span>
                                                        <span className="value">{reservation.guests} people</span>
                                                    </div>
                                                </div>
                                                {reservation.specialRequests && (
                                                    <p className="special-requests">Note: {reservation.specialRequests}</p>
                                                )}
                                                <div className="booking-actions">
                                                    <button onClick={() => navigate(`/restaurants/${reservation.restaurant.id}`)} className="btn btn-secondary">
                                                        View Restaurant
                                                    </button>
                                                    {reservation.status === 'pending' && (
                                                        <button onClick={() => cancelDiningReservation(reservation.id)} className="btn btn-danger">
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Deals Tab */}
                    {activeTab === 'deals' && (
                        <div className="tab-content">
                            {dealRedemptions.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🎁</div>
                                    <h3>No deals redeemed yet</h3>
                                    <p>Check out our special offers and save big!</p>
                                    <button onClick={() => navigate('/deals')} className="btn btn-primary">
                                        Browse Deals
                                    </button>
                                </div>
                            ) : (
                                <div className="bookings-grid">
                                    {dealRedemptions.map((redemption) => (
                                        <div key={redemption.id} className="booking-card deal-card">
                                            <div className="booking-image">
                                                <img src={redemption.deal.images?.[0] || ''} alt={redemption.deal.title} />
                                                <span className={`status-badge ${redemption.status}`}>{redemption.status}</span>
                                                <div className="discount-badge">{redemption.deal.discount}% OFF</div>
                                            </div>
                                            <div className="booking-details">
                                                <h3>{redemption.deal.title}</h3>
                                                <p className="deal-type">{redemption.deal.type}</p>
                                                <div className="redemption-code">
                                                    <span className="label">Redemption Code</span>
                                                    <span className="code">{redemption.redemptionCode}</span>
                                                </div>
                                                <div className="deal-pricing">
                                                    <div className="price-row">
                                                        <span className="original">₨{redemption.deal.originalPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
                                                        <span className="deal-price">₨{redemption.deal.dealPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
                                                    </div>
                                                    <span className="savings">You saved ₨{(redemption.deal.originalPrice - redemption.deal.dealPrice).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
                                                </div>
                                                <p className="redeemed-date">Redeemed: {formatDate(redemption.createdAt)}</p>
                                                {redemption.redeemedAt && (
                                                    <p className="used-date">Used: {formatDate(redemption.redeemedAt)}</p>
                                                )}
                                                <div className="booking-actions">
                                                    <button onClick={() => navigate(`/deals/${redemption.deal.id}`)} className="btn btn-secondary">
                                                        View Deal
                                                    </button>
                                                    {redemption.status === 'active' && (
                                                        <button className="btn btn-primary" onClick={() => {
                                                            navigator.clipboard.writeText(redemption.redemptionCode);
                                                            toast.success('Code copied to clipboard!');
                                                        }}>
                                                            Copy Code
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Packages Tab */}
                    {activeTab === 'packages' && (
                        <div className="tab-content">
                            {packageBookings.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📦</div>
                                    <h3>No packages booked yet</h3>
                                    <p>Explore our all-inclusive vacation packages!</p>
                                    <button onClick={() => navigate('/packages')} className="btn btn-primary">
                                        Browse Packages
                                    </button>
                                </div>
                            ) : (
                                <div className="bookings-grid">
                                    {packageBookings.map((booking) => (
                                        <div key={booking.id} className="booking-card">
                                            <div className="booking-image">
                                                <img src={booking.package.images?.[0] || ''} alt={booking.package.name} />
                                                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                            </div>
                                            <div className="booking-details">
                                                <h3>{booking.package.name}</h3>
                                                <p className="duration">{booking.package.duration}</p>
                                                <div className="booking-dates">
                                                    <div className="date-item">
                                                        <span className="label">Start Date</span>
                                                        <span className="value">{formatDate(booking.startDate)}</span>
                                                    </div>
                                                    <div className="date-item">
                                                        <span className="label">Guests</span>
                                                        <span className="value">{booking.guests} people</span>
                                                    </div>
                                                </div>
                                                <div className="includes-preview">
                                                    <h4>Includes:</h4>
                                                    <ul>
                                                        {(booking.package.includes || []).slice(0, 3).map((item, idx) => (
                                                            <li key={idx}>✓ {item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="booking-price">
                                                    <span className="label">Total</span>
                                                    <span className="amount">₨{booking.totalPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
                                                </div>
                                                <div className="booking-actions">
                                                    <button onClick={() => navigate(`/packages/${booking.package.id}`)} className="btn btn-secondary">
                                                        View Package
                                                    </button>
                                                    {booking.status === 'pending' && (
                                                        <button onClick={() => cancelPackageBooking(booking.id)} className="btn btn-danger">
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default MyBookings;
