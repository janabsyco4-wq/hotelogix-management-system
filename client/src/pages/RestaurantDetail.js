import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '19:00',
    guests: 2,
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

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

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (!reservationData.date || !reservationData.time) {
      toast.error('Please select date and time');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('/api/restaurants/reservations', {
        restaurantId: restaurant.id,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        specialRequests: reservationData.specialRequests
      });

      toast.success('Reservation confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to make reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="restaurant-detail-page">
      <div className="restaurant-hero">
        <img src={restaurant.images[0]} alt={restaurant.name} />
        <div className="hero-overlay">
          <div className="container">
            <button onClick={() => navigate('/dining')} className="back-btn">
              ← Back to Restaurants
            </button>
            <h1>{restaurant.name}</h1>
            <div className="restaurant-meta">
              <span className="cuisine">{restaurant.cuisine}</span>
              <span className="rating">⭐ {restaurant.rating}</span>
              <span className="price-range">{restaurant.priceRange}</span>
              <span className="location">📍 {restaurant.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="restaurant-content">
        <div className="container">
          <div className="content-grid">
            <div className="main-content">
              <section className="section">
                <h2>About</h2>
                <p>{restaurant.description}</p>
              </section>

              <section className="section">
                <h2>Opening Hours</h2>
                <div className="hours-grid">
                  {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                    <div key={day} className="hours-row">
                      <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                      <span className="hours">{hours}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2>Menu Highlights</h2>
                <div className="menu-grid">
                  {restaurant.menu.map((item, index) => (
                    <div key={index} className="menu-item">
                      <div className="menu-item-header">
                        <h4>{item.name}</h4>
                        <span className="price">${item.price.toFixed(2)}</span>
                      </div>
                      <span className="category">{item.category}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {restaurant.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-tag">
                      ✓ {amenity}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="sidebar">
              <div className="reservation-card">
                <h3>Make a Reservation</h3>
                {!showReservationForm ? (
                  <button
                    onClick={() => setShowReservationForm(true)}
                    className="btn btn-primary btn-large"
                  >
                    Reserve a Table
                  </button>
                ) : (
                  <form onSubmit={handleReservation} className="reservation-form">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={reservationData.date}
                        onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
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
                      <label>Number of Guests</label>
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
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setShowReservationForm(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? 'Confirming...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="info-card">
                <h4>Contact Information</h4>
                <p>📍 {restaurant.location}</p>
                <p>📞 Call for reservations</p>
                <p>✉️ Email for inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
