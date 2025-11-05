import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    featured: false,
    available: true,
    type: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    amenities: []
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const [allRooms, setAllRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/rooms');
      setAllRooms(response.data);
      applyFiltersAndSort(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (roomsList = allRooms) => {
    let filteredRooms = [...roomsList];

    // Apply filters
    if (filters.featured) {
      filteredRooms = filteredRooms.filter(room => room.featured);
    }
    if (filters.available) {
      filteredRooms = filteredRooms.filter(room => room.isAvailable);
    }
    if (filters.type) {
      filteredRooms = filteredRooms.filter(room => room.type === filters.type);
    }
    if (filters.minPrice) {
      filteredRooms = filteredRooms.filter(room => room.pricePerNight >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filteredRooms = filteredRooms.filter(room => room.pricePerNight <= parseFloat(filters.maxPrice));
    }
    if (filters.capacity) {
      filteredRooms = filteredRooms.filter(room => room.capacity >= parseInt(filters.capacity));
    }
    if (filters.amenities.length > 0) {
      filteredRooms = filteredRooms.filter(room => {
        const roomAmenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities;
        return filters.amenities.every(amenity => roomAmenities.includes(amenity));
      });
    }

    // Apply sorting
    filteredRooms = sortRooms(filteredRooms, sortBy);

    setRooms(filteredRooms);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const sortRooms = (roomsList, criteria) => {
    const sorted = [...roomsList];
    switch (criteria) {
      case 'price-low':
        return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-high':
        return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating':
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'capacity':
        return sorted.sort((a, b) => b.capacity - a.capacity);
      case 'featured':
      default:
        // Featured rooms first (true comes before false)
        return sorted.sort((a, b) => {
          if (a.featured === b.featured) return 0;
          return a.featured ? -1 : 1;
        });
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
      maxPrice: '',
      capacity: '',
      amenities: []
    });
    setSortBy('featured');
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const availableAmenities = ['WiFi', 'Pool', 'Gym', 'Parking', 'Room Service', 'Air Conditioning', 'Mini Bar', 'Balcony'];

  const roomTypes = [...new Set(rooms.map(room => room.type))];

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loading message="Loading rooms..." />;
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
                      placeholder="Min PKR"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="form-input"
                      placeholder="Max PKR"
                    />
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Guest Capacity</h4>
                  <select
                    value={filters.capacity}
                    onChange={(e) => handleFilterChange('capacity', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Any Capacity</option>
                    <option value="1">1+ Guests</option>
                    <option value="2">2+ Guests</option>
                    <option value="3">3+ Guests</option>
                    <option value="4">4+ Guests</option>
                    <option value="5">5+ Guests</option>
                    <option value="6">6+ Guests</option>
                  </select>
                </div>

                <div className="filter-section">
                  <h4>Amenities</h4>
                  <div className="amenities-checkboxes">
                    {availableAmenities.map(amenity => (
                      <label key={amenity} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => applyFiltersAndSort()} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }}>
                  🔍 Search
                </button>
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
                  <div className="sort-controls">
                    <label>Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setTimeout(() => applyFiltersAndSort(), 100);
                      }}
                      className="sort-select"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: High to Low</option>
                      <option value="price-high">Price: Low to High</option>
                      <option value="rating">Rating: High to Low</option>
                      <option value="capacity">Capacity: High to Low</option>
                    </select>
                  </div>
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
                <>
                  <div className="rooms-grid">
                    {currentRooms.map((room) => (
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
                          ₨{room.pricePerNight.toLocaleString('en-PK')}/night
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
                        
                        {room.reviewCount > 0 && (
                          <div className="room-rating">
                            <span className="rating-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={`star ${star <= Math.round(room.averageRating) ? 'filled' : ''}`}>
                                  ★
                                </span>
                              ))}
                            </span>
                            <span className="rating-text">
                              {room.averageRating.toFixed(1)} ({room.reviewCount} reviews)
                            </span>
                          </div>
                        )}

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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>

                    <div className="pagination-numbers">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>
                )}

                <div className="pagination-info">
                  Showing {indexOfFirstRoom + 1}-{Math.min(indexOfLastRoom, rooms.length)} of {rooms.length} rooms
                </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
