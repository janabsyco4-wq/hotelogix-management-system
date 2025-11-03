import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/StripePayment';
import Loading from '../components/Loading';
import './BookRoom.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SOjybFsAUb4gKn6SYm9xmCiVHgXyvhnIz5VrMEK02X772dYOQoh3UHIlNXtf9vT5UBzS19GfW9qXr9VZtY01Y4h006hoQfgFc');

const BookRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }
    fetchRoom();
  }, [id, user, navigate]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * room.pricePerNight;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (calculateNights() <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = (booking) => {
    toast.success('Payment successful! Booking confirmed.');
    navigate('/my-bookings');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return <Loading message="Loading room details..." />;
  }

  if (!room) {
    return null;
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="book-room-page">
      <div className="container">
        <div className="booking-header">
          <h1>Complete Your Booking</h1>
          <button onClick={() => navigate(`/rooms/${id}`)} className="btn-back">
            ← Back to Room Details
          </button>
        </div>

        <div className="booking-grid">
          <div className="booking-form-section">
            <div className="form-card">
              {!showPayment ? (
                <>
                  <h2>Booking Details</h2>
                  
                  <form onSubmit={handleBooking}>
                    <div className="form-group">
                      <label className="form-label">Check-in Date</label>
                      <input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Check-out Date</label>
                      <input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                        className="form-input"
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Number of Guests</label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                        className="form-input"
                        required
                      >
                        {[...Array(room.capacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-large"
                      disabled={booking || !room.isAvailable}
                    >
                      Proceed to Payment
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2>Payment</h2>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      amount={total}
                      bookingType="room"
                      bookingData={{
                        roomId: room.id,
                        checkIn: bookingData.checkIn,
                        checkOut: bookingData.checkOut,
                        guests: bookingData.guests
                      }}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </Elements>
                </>
              )}
            </div>
          </div>

          <div className="booking-summary-section">
            <div className="summary-card">
              <h2>Booking Summary</h2>
              
              <div className="room-summary">
                <img src={room.images[0]} alt={room.title} className="room-thumbnail" />
                <div className="room-summary-info">
                  <h3>{room.title}</h3>
                  <p>{room.type}</p>
                  <p className="room-location">📍 {room.location}</p>
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Check-in:</span>
                  <span>{bookingData.checkIn || 'Not selected'}</span>
                </div>
                <div className="summary-row">
                  <span>Check-out:</span>
                  <span>{bookingData.checkOut || 'Not selected'}</span>
                </div>
                <div className="summary-row">
                  <span>Guests:</span>
                  <span>{bookingData.guests}</span>
                </div>
                <div className="summary-row">
                  <span>Nights:</span>
                  <span>{nights}</span>
                </div>
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>₨{room.pricePerNight.toLocaleString('en-PK')} × {nights} nights</span>
                  <span>₨{(nights * room.pricePerNight).toLocaleString('en-PK')}</span>
                </div>
                <div className="price-row">
                  <span>Service fee</span>
                  <span>₨0</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₨{total.toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
