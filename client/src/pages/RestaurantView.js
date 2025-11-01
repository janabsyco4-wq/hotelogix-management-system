import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import './RestaurantDetail.css';

const RestaurantView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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
                <button
                  onClick={() => navigate(`/restaurants/${restaurant.id}/reserve`)}
                  className="btn btn-primary btn-large"
                >
                  Reserve a Table
                </button>
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

export default RestaurantView;
