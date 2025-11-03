import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Bookings.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback data for demo
      setBookings([
        {
          id: 1,
          checkIn: '2024-12-15',
          checkOut: '2024-12-18',
          totalPrice: 389.97,
          status: 'confirmed',
          createdAt: '2024-11-01T10:00:00Z',
          nights: 3,
          room: {
            title: 'Executive Suite',
            type: 'Executive Suite',
            location: 'Lahore, Punjab',
            capacity: 2,
            images: ['https://via.placeholder.com/400x250/3b82f6/FFFFFF?text=Executive+Suite']
          }
        },
        {
          id: 2,
          checkIn: '2024-11-20',
          checkOut: '2024-11-22',
          totalPrice: 259.98,
          status: 'completed',
          createdAt: '2024-10-15T14:30:00Z',
          nights: 2,
          room: {
            title: 'Deluxe Room',
            type: 'Deluxe Room',
            location: 'Multan, Punjab',
            capacity: 2,
            images: ['https://via.placeholder.com/400x250/2563eb/FFFFFF?text=Deluxe+Room']
          }
        },
        {
          id: 3,
          checkIn: '2024-10-10',
          checkOut: '2024-10-12',
          totalPrice: 199.98,
          status: 'cancelled',
          createdAt: '2024-09-25T09:15:00Z',
          nights: 2,
          room: {
            title: 'Standard Room',
            type: 'Standard Room',
            location: 'Okara, Punjab',
            capacity: 2,
            images: ['https://via.placeholder.com/400x250/1e40af/FFFFFF?text=Standard+Room']
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.patch(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const downloadReceipt = (booking) => {
    toast.info('Receipt download feature coming soon!');
  };

  const contactSupport = () => {
    toast.info('Support contact feature coming soon!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'cancelled': return '✕';
      case 'completed': return '✓';
      default: return '•';
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const isUpcoming = (checkIn) => {
    return new Date(checkIn) > new Date();
  };

  const isPast = (checkOut) => {
    return new Date(checkOut) < new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming(booking.checkIn) && booking.status === 'confirmed';
    if (filter === 'past') return isPast(booking.checkOut) && booking.status !== 'cancelled';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const bookingStats = {
    total: bookings.length,
    upcoming: bookings.filter(b => isUpcoming(b.checkIn) && b.status === 'confirmed').length,
    past: bookings.filter(b => isPast(b.checkOut) && b.status !== 'cancelled').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return <Loading message="Loading your bookings..." />;
  }

  return (
    <div className="bookings-page">
      <div className="bookings-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="page-title">My Bookings</h1>
              <p className="page-subtitle">Manage and track your hotel reservations</p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{bookingStats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{bookingStats.upcoming}</span>
                <span className="stat-label">Upcoming</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{bookingStats.past}</span>
                <span className="stat-label">Past</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bookings-content">
        <div className="container">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">🏨</div>
              <h3>No bookings found</h3>
              <p>You haven't made any bookings yet. Start exploring our rooms!</p>
              <a href="/rooms" className="btn btn-primary">BROWSE ROOMS</a>
            </div>
          ) : (
            <>
              <div className="bookings-filters">
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Bookings ({bookingStats.total})
                </button>
                <button
                  className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming ({bookingStats.upcoming})
                </button>
                <button
                  className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                  onClick={() => setFilter('past')}
                >
                  Past ({bookingStats.past})
                </button>
                <button
                  className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled ({bookingStats.cancelled})
                </button>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="no-results">
                  <p>No bookings found for this filter.</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className={`booking-card ${booking.status}`}>
                      <div className="booking-image">
                        <img src={booking.room.images?.[0] || 'https://via.placeholder.com/400x250'} alt={booking.room.type} />
                        <div className="booking-id">Booking #{booking.id}</div>
                      </div>

                      <div className="booking-content">
                        <div className="booking-header">
                          <div className="booking-info">
                            <h3 className="hotel-name">{booking.room.title}</h3>
                            <p className="hotel-location">📍 {booking.room.location}</p>
                            <p className="room-type">🛏️ {booking.room.type}</p>
                          </div>
                          <div className="booking-status">
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(booking.status) }}
                            >
                              <span className="status-icon">{getStatusIcon(booking.status)}</span>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="booking-timeline">
                          <div className="timeline-item">
                            <div className="timeline-icon">📅</div>
                            <div className="timeline-content">
                              <span className="timeline-label">Check-in</span>
                              <span className="timeline-value">{formatDate(booking.checkIn)}</span>
                            </div>
                          </div>
                          <div className="timeline-arrow">→</div>
                          <div className="timeline-item">
                            <div className="timeline-icon">🌙</div>
                            <div className="timeline-content">
                              <span className="timeline-label">Duration</span>
                              <span className="timeline-value">{booking.nights || calculateNights(booking.checkIn, booking.checkOut)} nights</span>
                            </div>
                          </div>
                          <div className="timeline-arrow">→</div>
                          <div className="timeline-item">
                            <div className="timeline-icon">📅</div>
                            <div className="timeline-content">
                              <span className="timeline-label">Check-out</span>
                              <span className="timeline-value">{formatDate(booking.checkOut)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="booking-footer">
                          <div className="booking-price">
                            <span className="price-label">Total Amount</span>
                            <span className="price-value">₨{booking.totalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                          </div>
                          <div className="booking-actions">
                            <button 
                              onClick={() => viewDetails(booking)}
                              className="btn btn-secondary btn-small"
                            >
                              View Details
                            </button>
                            {booking.status === 'confirmed' && isUpcoming(booking.checkIn) && (
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="btn btn-danger btn-small"
                              >
                                Cancel
                              </button>
                            )}
                            {booking.status === 'completed' && (
                              <button className="btn btn-primary btn-small">Book Again</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-header">
              <h2>Booking Details</h2>
              <span className="modal-booking-id">Booking #{selectedBooking.id}</span>
            </div>

            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedBooking.room.images?.[0] || 'https://via.placeholder.com/400x250'} alt={selectedBooking.room.type} />
                <div 
                  className="modal-status-badge"
                  style={{ backgroundColor: getStatusColor(selectedBooking.status) }}
                >
                  {getStatusIcon(selectedBooking.status)} {selectedBooking.status.toUpperCase()}
                </div>
              </div>

              <div className="modal-section">
                <h3>🏨 Room Information</h3>
                <div className="modal-info-grid">
                  <div className="info-item">
                    <span className="info-label">Room Title</span>
                    <span className="info-value">{selectedBooking.room.title}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{selectedBooking.room.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Room Type</span>
                    <span className="info-value">{selectedBooking.room.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Capacity</span>
                    <span className="info-value">Up to {selectedBooking.room.capacity} guests</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>📅 Stay Details</h3>
                <div className="modal-timeline">
                  <div className="modal-timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-info">
                      <span className="timeline-title">Check-in</span>
                      <span className="timeline-date">{formatDate(selectedBooking.checkIn)}</span>
                      <span className="timeline-time">After 3:00 PM</span>
                    </div>
                  </div>
                  <div className="modal-timeline-line"></div>
                  <div className="modal-timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-info">
                      <span className="timeline-title">Duration</span>
                      <span className="timeline-date">{selectedBooking.nights || calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights</span>
                    </div>
                  </div>
                  <div className="modal-timeline-line"></div>
                  <div className="modal-timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-info">
                      <span className="timeline-title">Check-out</span>
                      <span className="timeline-date">{formatDate(selectedBooking.checkOut)}</span>
                      <span className="timeline-time">Before 11:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>💰 Payment Summary</h3>
                <div className="payment-breakdown">
                  <div className="payment-row">
                    <span>Room Rate ({selectedBooking.nights || calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights)</span>
                    <span>₨{(selectedBooking.totalPrice * 0.85).toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                  </div>
                  <div className="payment-row">
                    <span>Taxes & Fees</span>
                    <span>₨{(selectedBooking.totalPrice * 0.15).toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                  </div>
                  <div className="payment-row total">
                    <span>Total Amount</span>
                    <span>₨{selectedBooking.totalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>ℹ️ Additional Information</h3>
                <div className="modal-info-grid">
                  <div className="info-item">
                    <span className="info-label">Booking Date</span>
                    <span className="info-value">{formatDate(selectedBooking.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Confirmation Number</span>
                    <span className="info-value">SC-{selectedBooking.id}-2024</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Guest Name</span>
                    <span className="info-value">{user?.name || 'Guest'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email || 'guest@example.com'}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.status === 'confirmed' && (
                <div className="modal-section important-info">
                  <h3>⚠️ Important Information</h3>
                  <ul>
                    <li>Please bring a valid ID and credit card at check-in</li>
                    <li>Early check-in subject to availability</li>
                    <li>Late check-out may incur additional charges</li>
                    <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => downloadReceipt(selectedBooking)}
                className="btn btn-secondary"
              >
                📄 Download Receipt
              </button>
              <button 
                onClick={contactSupport}
                className="btn btn-secondary"
              >
                💬 Contact Support
              </button>
              {selectedBooking.status === 'confirmed' && isUpcoming(selectedBooking.checkIn) && (
                <button 
                  onClick={() => cancelBooking(selectedBooking.id)}
                  className="btn btn-danger"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
