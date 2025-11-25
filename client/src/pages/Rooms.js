import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    featured: false,
    available: true,
    type: '',
    minPrice: '',
    maxPrice: '',
    capacity: ''
  });

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      capacity: ''
    });
    setSortBy('featured');
  };

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
        <div className="hero-images-grid">
          {[0, 1, 2, 7, 4].map((roomIndex, index) => {
            const room = allRooms[roomIndex] || allRooms[index];
            // Use external image for 4th position
            const imageUrl = index === 3 
              ? 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
              : room?.images?.[0] || '/placeholder-room.jpg';
            return (
              <div key={index} className={`hero-image-item hero-image-${index + 1}`}>
                <img src={imageUrl} alt={room?.type || 'Luxury Room'} />
              </div>
            );
          })}
        </div>
        <div className="hero-overlay">
          <div className="container">
            <h1 className="page-title">Our Rooms</h1>
            <p className="page-subtitle">Discover comfort and luxury in every room</p>
          </div>
        </div>
      </div>

      <div className="rooms-content">
        <div className="container">
          {/* Top Filter Bar */}
          <div className="top-filter-bar">
            <button onClick={() => setFilterOpen(!filterOpen)} className="filter-toggle-btn">
              <i className="fas fa-filter"></i> Filters {filterOpen ? '▲' : '▼'}
            </button>
            
            {filterOpen && (
              <div className="filters-horizontal">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-input"
                >
                  <option value="">All Types</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                  placeholder="Min Price"
                />

                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                  placeholder="Max Price"
                />

                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  className="filter-input"
                >
                  <option value="">Any Capacity</option>
                  <option value="1">1+ Guests</option>
                  <option value="2">2+ Guests</option>
                  <option value="3">3+ Guests</option>
                  <option value="4">4+ Guests</option>
                  <option value="5">5+ Guests</option>
                  <option value="6">6+ Guests</option>
                </select>

                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  />
                  <span>Featured</span>
                </label>

                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => handleFilterChange('available', e.target.checked)}
                  />
                  <span>Available</span>
                </label>

                <button onClick={() => applyFiltersAndSort()} className="btn btn-gold btn-small">
                  Search
                </button>
                <button onClick={clearFilters} className="btn btn-outline btn-small">
                  Clear
                </button>
              </div>
            )}
          </div>

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
                          <h3>{room.type}</h3>
                          <p className="room-description">{room.description}</p>

                          <div className="room-features">
                            <span><i className="fas fa-users"></i> {room.capacity} Guests</span>
                            <span><i className="fas fa-bed"></i> {room.beds} Beds</span>
                            <span><i className="fas fa-star"></i> {room.averageRating || 4.5}/5</span>
                          </div>

                          <div className="room-footer">
                            <div className="room-number-display">
                              <span className="room-number-label">Room</span>
                              <span className="room-number-value">{room.roomNumber}</span>
                            </div>
                            <Link to={`/rooms/${room.id}`} className="btn btn-gold">
                              View Details <i className="fas fa-arrow-right"></i>
                            </Link>
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
  );
};

export default Rooms;
