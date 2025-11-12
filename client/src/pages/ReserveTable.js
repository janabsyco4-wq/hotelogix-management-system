import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/StripePayment';
import Loading from '../components/Loading';
import './ReserveTable.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SOjybFsAUb4gKn6SYm9xmCiVHgXyvhnIz5VrMEK02X772dYOQoh3UHIlNXtf9vT5UBzS19GfW9qXr9VZtY01Y4h006hoQfgFc');

const ReserveTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '19:00',
    guests: 2,
    specialRequests: ''
  });

  // Deposit amount per guest
  const DEPOSIT_PER_GUEST = 25;

  useEffect(() => {
    if (!user) {
      toast.info('Please login to make a reservation');
      navigate('/login');
      return;
    }
    fetchRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Restaurant not found');
      navigate('/dining');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return reservationData.guests * DEPOSIT_PER_GUEST;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reservationData.date || !reservationData.time) {
      toast.error('Please select date and time');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = (reservation) => {
    toast.success('Payment successful! Reservation confirmed.');
    navigate('/my-bookings');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return <Loading message="Loading restaurant details..." />;
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="reserve-table-page">
      <div className="reservation-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <button onClick={() => navigate(`/restaurants/${id}`)} className="back-btn">
            ← Back to Restaurant
          </button>
          <h1>Reserve a Table</h1>
          <p>at {restaurant.name}</p>
        </div>
      </div>

      <div className="reservation-content">
        <div className="container">
          <div className="reservation-grid">
            <div className="restaurant-summary">
              <img src={restaurant.images[0]} alt={restaurant.name} />
              <div className="summary-info">
                <h2>{restaurant.name}</h2>
                <p className="cuisine">{restaurant.cuisine}</p>
                <p className="location">📍 {restaurant.location}</p>
                <p className="rating">⭐ {restaurant.rating} • {restaurant.priceRange}</p>
              </div>
            </div>

            <div className="reservation-form-card">
              {!showPayment ? (
                <>
                  <h3>Reservation Details</h3>
                  <form onSubmit={handleSubmit} className="reservation-form">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={reservationData.date}
                    onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <select
                    value={reservationData.time}
                    onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                    required
                  >
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Guests *</label>
                  <select
                    value={reservationData.guests}
                    onChange={(e) => setReservationData({ ...reservationData, guests: parseInt(e.target.value) })}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    value={reservationData.specialRequests}
                    onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
                    placeholder="Allergies, dietary restrictions, special occasions..."
                    rows="4"
                  />
                </div>

                <div className="reservation-summary">
                  <h4>Reservation Summary</h4>
                  <div className="summary-row">
                    <span>Restaurant</span>
                    <span>{restaurant.name}</span>
                  </div>
                  <div className="summary-row">
                    <span>Date</span>
                    <span>{reservationData.date || 'Not selected'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Time</span>
                    <span>{reservationData.time}</span>
                  </div>
                  <div className="summary-row">
                    <span>Guests</span>
                    <span>{reservationData.guests}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Deposit (₨{DEPOSIT_PER_GUEST}/guest)</span>
                    <span>₨{calculateTotal()}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/restaurants/${id}`)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
                </>
              ) : (
                <>
                  <h3>Payment</h3>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      amount={calculateTotal()}
                      bookingType="dining"
                      bookingData={{
                        restaurantId: restaurant.id,
                        date: reservationData.date,
                        time: reservationData.time,
                        guests: reservationData.guests,
                        specialRequests: reservationData.specialRequests
                      }}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </Elements>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveTable;
