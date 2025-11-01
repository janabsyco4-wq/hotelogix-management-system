import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import './Dining.css';

const Dining = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: '',
    location: '',
    priceRange: '',
    featured: false
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.location) params.append('location', filters.location);
      if (filters.priceRange) params.append('priceRange', filters.priceRange);
      if (filters.featured) params.append('featured', 'true');

      const response = await axios.get(`/api/restaurants?${params}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/reserve`);
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      location: '',
      priceRange: '',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="dining-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dining-page">
      <div className="dining-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>🍽️ Dining at Hotelogix</h1>
          <p>Experience culinary excellence at our world-class restaurants</p>
        </div>
      </div>

      <div className="dining-content">
        <div className="container">
          <div className="filters-section">
            <div className="filter-group">
              <label>Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
              >
                <option value="">All Cuisines</option>
                <option value="American">American</option>
                <option value="Japanese">Japanese</option>
                <option value="Italian">Italian</option>
                <option value="Café">Café & Breakfast</option>
                <option value="Steakhouse">Steakhouse</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                <option value="Kansas City, MO">Kansas City</option>
                <option value="Independence, MO">Independence</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="">All Prices</option>
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Upscale</option>
                <option value="$$$$">$$$$ - Fine Dining</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                />
                Featured Only
              </label>
            </div>

            <button onClick={clearFilters} className="btn-clear">
              Clear Filters
            </button>
          </div>

          <div className="restaurants-grid">
            {restaurants.length === 0 ? (
              <div className="no-results">
                <p>No restaurants found matching your criteria</p>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div key={restaurant.id} className="restaurant-card">
                  {restaurant.featured && <span className="featured-badge">⭐ Featured</span>}
                  <div className="restaurant-image">
                    <img src={restaurant.images[0]} alt={restaurant.name} />
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="cuisine">{restaurant.cuisine}</p>
                    <p className="description">{restaurant.description}</p>
                    
                    <div className="restaurant-meta">
                      <span className="location">📍 {restaurant.location}</span>
                      <span className="price-range">{restaurant.priceRange}</span>
                      <span className="rating">⭐ {restaurant.rating}</span>
                    </div>

                    <div className="amenities">
                      {restaurant.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>

                    <div className="restaurant-actions">
                      <button
                        onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                        className="btn btn-secondary btn-full"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/restaurants/${restaurant.id}/reserve`)}
                        className="btn btn-primary btn-full"
                      >
                        Reserve Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dining;
