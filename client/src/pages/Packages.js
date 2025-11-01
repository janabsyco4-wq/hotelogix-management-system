import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Packages.css';

const Packages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    featured: false
  });

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.featured) params.append('featured', 'true');

      const response = await axios.get(`/api/packages?${params}`);
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (packageId) => {
    if (!user) {
      toast.info('Please login to book packages');
      navigate('/login');
      return;
    }
    navigate(`/packages/${packageId}/book`);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="packages-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <div className="packages-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>📦 Vacation Packages</h1>
          <p>All-inclusive packages for the perfect getaway</p>
        </div>
      </div>

      <div className="packages-content">
        <div className="container">
          <div className="filters-section">
            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                <option value="Kansas City, MO">Kansas City</option>
                <option value="Independence, MO">Independence</option>
                <option value="Both">Both Locations</option>
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

          <div className="packages-grid">
            {packages.length === 0 ? (
              <div className="no-results">
                <p>No packages found matching your criteria</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div key={pkg.id} className="package-card">
                  {pkg.featured && <span className="featured-badge">⭐ Featured</span>}
                  
                  <div className="package-image">
                    <img src={pkg.images[0]} alt={pkg.name} />
                    <div className="duration-badge">{pkg.duration}</div>
                  </div>

                  <div className="package-info">
                    <h3>{pkg.name}</h3>
                    <p className="description">{pkg.description}</p>

                    <div className="includes-section">
                      <h4>What's Included:</h4>
                      <ul className="includes-list">
                        {pkg.includes.slice(0, 4).map((item, index) => (
                          <li key={index}>✓ {item}</li>
                        ))}
                        {pkg.includes.length > 4 && (
                          <li className="more-items">+ {pkg.includes.length - 4} more items</li>
                        )}
                      </ul>
                    </div>

                    <div className="package-meta">
                      <span className="location">📍 {pkg.location}</span>
                      <span className="price">${pkg.price.toFixed(2)}</span>
                    </div>

                    <div className="package-actions">
                      <button
                        onClick={() => navigate(`/packages/${pkg.id}`)}
                        className="btn btn-secondary btn-full"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/packages/${pkg.id}/book`)}
                        className="btn btn-primary btn-full"
                      >
                        Book Now
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

export default Packages;
