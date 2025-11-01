import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import './ProcessRefund.css';

const ProcessRefund = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [booking, setBooking] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/admin');
      return;
    }

    // Get booking data from location state or fetch it
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setRefundAmount(location.state.booking.amount || location.state.booking.totalPrice || '');
      setLoading(false);
    } else {
      fetchBooking();
    }
  }, [id, user, navigate, location.state]);

  const fetchBooking = async () => {
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      };

      // Try to fetch from different endpoints based on booking type
      let bookingData = null;
      
      try {
        const res = await axios.get(`/api/admin/bookings`, config);
        bookingData = res.data.find(b => b.id === parseInt(id));
      } catch (err) {}

      if (!bookingData) {
        toast.error('Booking not found');
        navigate('/admin');
        return;
      }

      setBooking(bookingData);
      setRefundAmount(bookingData.totalPrice || '');
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    if (!booking) return;

    setRefunding(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      };

      const isRoom = booking.roomId !== undefined;
      const isDining = booking.restaurantId !== undefined;
      const isDeal = booking.dealId !== undefined;
      const isPackage = booking.packageId !== undefined;

      let bookingType = 'room';
      if (isDining) bookingType = 'dining';
      else if (isDeal) bookingType = 'deal';
      else if (isPackage) bookingType = 'package';

      await axios.post('/api/payment/refund', {
        paymentIntentId: booking.paymentIntentId,
        bookingType,
        bookingId: booking.id,
        amount: parseFloat(refundAmount),
        reason: refundReason
      }, config);

      toast.success('Refund processed successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Refund error:', error);
      toast.error(error.response?.data?.error || 'Failed to process refund');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="process-refund-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const getBookingType = () => {
    if (booking.roomId) return '🛏️ Room Booking';
    if (booking.restaurantId) return '🍽️ Dining Reservation';
    if (booking.dealId) return '🎁 Deal Redemption';
    if (booking.packageId) return '📦 Package Booking';
    return 'Booking';
  };

  const getDescription = () => {
    if (booking.room) return booking.room.title;
    if (booking.restaurant) return booking.restaurant.name;
    if (booking.deal) return booking.deal.title;
    if (booking.package) return booking.package.name;
    return 'N/A';
  };

  return (
    <div className="process-refund-page">
      <div className="refund-hero">
        <div className="container">
          <button onClick={() => navigate('/admin')} className="back-btn">
            ← Back to Admin Dashboard
          </button>
          <h1>💸 Process Refund</h1>
          <p>Review and process refund for booking #{booking.id}</p>
        </div>
      </div>

      <div className="refund-content">
        <div className="container">
          <div className="refund-grid">
            {/* Booking Details */}
            <div className="booking-details-card">
              <h2>Booking Details</h2>
              
              <div className="detail-row">
                <span className="label">Booking Type:</span>
                <span className="value">{getBookingType()}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Booking ID:</span>
                <span className="value">#{booking.id}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Customer:</span>
                <span className="value">{booking.user?.email || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{getDescription()}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Payment ID:</span>
                <span className="value payment-id">{booking.paymentIntentId}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Original Amount:</span>
                <span className="value amount">${(booking.amount || booking.totalPrice || 0).toFixed(2)}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`badge ${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Refund Form */}
            <div className="refund-form-card">
              <h2>Refund Information</h2>
              
              <form onSubmit={handleRefundSubmit}>
                <div className="form-group">
                  <label>Refund Amount *</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    max={booking.amount || booking.totalPrice || 0}
                    className="form-input"
                    required
                  />
                  <small>Maximum: ${(booking.amount || booking.totalPrice || 0).toFixed(2)}</small>
                </div>

                <div className="form-group">
                  <label>Refund Reason *</label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="requested_by_customer">Requested by customer</option>
                    <option value="duplicate">Duplicate charge</option>
                    <option value="fraudulent">Fraudulent transaction</option>
                  </select>
                </div>

                <div className="refund-warning">
                  <p>⚠️ <strong>Warning:</strong> This action cannot be undone. The refund will be processed immediately through Stripe.</p>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="btn btn-secondary"
                    disabled={refunding}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={refunding}
                  >
                    {refunding ? 'Processing Refund...' : 'Process Refund'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessRefund;
