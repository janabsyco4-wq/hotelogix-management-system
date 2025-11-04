import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import CancellationPolicy from '../components/CancellationPolicy';
import './CancelBooking.css';

const CancelBooking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [reason, setReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const reasons = [
        'Change of plans',
        'Found better accommodation',
        'Travel dates changed',
        'Emergency situation',
        'Price too high',
        'Other'
    ];

    useEffect(() => {
        if (!user) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }
        fetchBooking();
    }, [id, user, navigate]);

    const fetchBooking = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            const response = await axios.get(`/api/bookings/${id}`, config);

            if (response.data.status === 'cancelled') {
                toast.error('This booking is already cancelled');
                navigate('/my-bookings');
                return;
            }

            if (response.data.status === 'pending_cancellation') {
                toast.info('Cancellation request already submitted. Waiting for admin approval.');
                navigate('/my-bookings');
                return;
            }

            setBooking(response.data);
        } catch (error) {
            console.error('Error fetching booking:', error);
            toast.error('Booking not found');
            navigate('/my-bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        const finalReason = reason === 'Other' ? otherReason : reason;

        if (!finalReason) {
            toast.error('Please select or enter a cancellation reason');
            return;
        }

        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        setCancelling(true);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            const response = await axios.patch(`/api/bookings/${id}/cancel`, { reason: finalReason }, config);
            toast.success('Cancellation request submitted! Please wait for admin approval for refund processing.');
            navigate('/my-bookings');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error(error.response?.data?.error || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return <Loading message="Loading booking details..." />;
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="cancel-booking-page">
            <div className="container">
                <div className="cancel-header">
                    <button onClick={() => navigate('/my-bookings')} className="back-btn">
                        ← Back to My Bookings
                    </button>
                    <h1>Cancel Booking</h1>
                    <p>Review your booking details and cancellation policy before proceeding</p>
                </div>

                <div className="cancel-content">
                    {/* Booking Details Card */}
                    <div className="booking-details-card">
                        <h2>📋 Booking Details</h2>

                        <div className="booking-info-grid">
                            <div className="info-item">
                                <span className="label">Booking ID</span>
                                <span className="value">#{booking.id}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Status</span>
                                <span className={`badge ${booking.status}`}>{booking.status}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Room</span>
                                <span className="value">{booking.room?.title || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Location</span>
                                <span className="value">{booking.room?.location || 'N/A'}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Check-in</span>
                                <span className="value">{new Date(booking.checkIn).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Check-out</span>
                                <span className="value">{new Date(booking.checkOut).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Total Amount</span>
                                <span className="value price">PKR {booking.totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="info-item">
                                <span className="label">Booked On</span>
                                <span className="value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {booking.room?.images && booking.room.images.length > 0 && (
                            <div className="room-preview">
                                <img src={booking.room.images[0]} alt={booking.room.title} />
                            </div>
                        )}
                    </div>

                    {/* Cancellation Policy with Calculator */}
                    <CancellationPolicy
                        showCalculator={true}
                        bookingAmount={booking.totalPrice}
                        checkInDate={booking.checkIn}
                    />

                    {/* Cancellation Reason */}
                    <div className="reason-card">
                        <h2>📝 Reason for Cancellation</h2>
                        <p className="reason-note">Help us improve by telling us why you're cancelling</p>

                        <div className="reason-options">
                            {reasons.map((r) => (
                                <label key={r} className={`reason-option ${reason === r ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r}
                                        checked={reason === r}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <span className="radio-custom"></span>
                                    <span className="reason-text">{r}</span>
                                </label>
                            ))}
                        </div>

                        {reason === 'Other' && (
                            <div className="other-reason">
                                <label>Please specify your reason:</label>
                                <textarea
                                    className="other-reason-input"
                                    placeholder="Tell us more about why you're cancelling..."
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Warning Box */}
                    <div className="warning-box">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-content">
                            <h3>Important Information</h3>
                            <ul>
                                <li>Once cancelled, this booking cannot be restored</li>
                                <li>Refund will be processed according to our cancellation policy</li>
                                <li>Refund will be credited to your original payment method</li>
                                <li>Processing time: 5-7 business days</li>
                                <li>You will receive a confirmation email once processed</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="btn btn-secondary"
                            disabled={cancelling}
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn btn-danger"
                            disabled={cancelling || !reason}
                        >
                            {cancelling ? 'Processing...' : 'Confirm Cancellation'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelBooking;
