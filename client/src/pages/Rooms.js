import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    featured: false,
    available: true,
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.featured) params.append('featured', 'true');
      if (filters.available) params.append('available', 'true');
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/rooms?${params.toString()}`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      featured: false,
      available: true,
      type: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const roomTypes = [...new Set(rooms.map(room => room.type))];

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1 className="page-title">Our Rooms</h1>
          <p className="page-subtitle">Discover comfort and luxury in every room</p>
        </div>
      </div>

      <div className="rooms-content">
        <div className="container">
          <div className="rooms-layout">
            {/* Sidebar Filters */}
            <aside className={`filters-sidebar ${filterOpen ? 'open' : ''}`}>
              <div className="filters-header">
                <h3>🔍 Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="close-filters-btn">✕</button>
              </div>

              <div className="filters-body">
                <div className="filter-section">
                  <h4>Quick Filters</h4>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    />
                    <span>⭐ Featured Rooms</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.available}
                      onChange={(e) => handleFilterChange('available', e.target.checked)}
                    />
                    <span>✅ Available Only</span>
                  </label>
                </div>

                <div className="filter-section">
                  <h4>Room Type</h4>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="form-input"
                  >
                    <option value="">All Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="price-inputs">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="form-input"
                      placeholder="Min $"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="form-input"
                      placeholder="Max $"
                    />
                  </div>
                </div>

                <button onClick={clearFilters} className="clear-filters-btn">
                  🔄 Clear All Filters
                </button>
              </div>
            </aside>

            {/* Results */}
            <div className="rooms-results">
              <div className="results-header">
                <div className="results-info">
                  <h3>{rooms.length} Room{rooms.length !== 1 ? 's' : ''} Found</h3>
                  <p>Showing the best available rooms</p>
                </div>
                <button onClick={() => setFilterOpen(!filterOpen)} className="mobile-filter-btn">
                  🔍 Filters
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="no-rooms">
                  <h3>No rooms found</h3>
                  <p>Try adjusting your filters to see more options.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="rooms-grid">
                  {rooms.map((room) => (
                    <div key={room.id} className={`room-card card ${room.featured ? 'featured' : ''}`}>
                      {room.featured && (
                        <div className="featured-badge">Featured</div>
                      )}

                      <div className="card-image">
                        <img
                          src={room.images[0] || 'https://via.placeholder.com/400x250/8B4513/FFFFFF?text=Room'}
                          alt={room.title}
                        />
                        <div className="price-badge">
                          ${room.pricePerNight}/night
                        </div>
                        {!room.isAvailable && (
                          <div className="unavailable-overlay">
                            <span>Not Available</span>
                          </div>
                        )}
                      </div>

                      <div className="card-content">
                        <div className="room-header">
                          <h3 className="card-title">{room.title}</h3>
                          <span className="room-type">{room.type}</span>
                        </div>

                        <div className="room-details">
                          <div className="detail-item">
                            <span className="detail-label">📍</span>
                            <span>{room.location}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">👥</span>
                            <span>Up to {room.capacity} guests</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">📐</span>
                            <span>{room.size}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">🛏️</span>
                            <span>{room.bedType}</span>
                          </div>
                        </div>

                        <p className="card-description">{room.description}</p>

                        <div className="amenities-preview">
                          <h4>Amenities:</h4>
                          <div className="amenities-tags">
                            {room.amenities.slice(0, 3).map((amenity, index) => (
                              <span key={index} className="amenity-tag">{amenity}</span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="amenity-tag more">+{room.amenities.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        <div className="card-actions">
                          <Link
                            to={`/rooms/${room.id}`}
                            className="btn btn-secondary"
                          >
                            VIEW DETAILS
                          </Link>
                          {room.isAvailable && (
                            <Link
                              to={`/book/${room.id}`}
                              className="btn btn-primary"
                            >
                              BOOK NOW
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
