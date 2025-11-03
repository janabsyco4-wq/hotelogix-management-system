import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Deals.css';

const Deals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    featured: false
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.featured) params.append('featured', 'true');

      const response = await axios.get(`/api/deals?${params}`);
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (dealId) => {
    if (!user) {
      toast.info('Please login to redeem deals');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/deals/${dealId}/redeem`);
      toast.success(`Deal redeemed! Your code: ${response.data.redemptionCode}`);
      navigate('/my-deals');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to redeem deal');
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      featured: false
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading message="Loading deals..." />;
  }

  return (
    <div className="deals-page">
      <div className="deals-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>🎁 Special Deals & Offers</h1>
          <p>Save big with our exclusive deals and limited-time offers</p>
        </div>
      </div>

      <div className="deals-content">
        <div className="container">
          <div className="filters-section">
            <div className="filter-group">
              <label>Deal Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="room">Room Deals</option>
                <option value="dining">Dining Deals</option>
                <option value="package">Package Deals</option>
                <option value="spa">Spa Deals</option>
                <option value="activity">Activity Deals</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">All Locations</option>
                <option value="Okara, Punjab">Okara</option>
                <option value="Lahore, Punjab">Lahore</option>
                <option value="Sheikhupura, Punjab">Sheikhupura</option>
                <option value="Multan, Punjab">Multan</option>
                <option value="All">All Cities</option>
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

          <div className="deals-grid">
            {deals.length === 0 ? (
              <div className="no-results">
                <p>No deals found matching your criteria</p>
              </div>
            ) : (
              deals.map((deal) => (
                <div key={deal.id} className="deal-card">
                  {deal.featured && <span className="featured-badge">⭐ Featured</span>}
                  <div className="discount-badge">{deal.discount}% OFF</div>
                  
                  <div className="deal-image">
                    <img src={deal.images[0]} alt={deal.title} />
                  </div>

                  <div className="deal-info">
                    <span className="deal-type">{deal.type}</span>
                    <h3>{deal.title}</h3>
                    <p className="description">{deal.description}</p>

                    <div className="deal-pricing">
                      <div className="price-row">
                        <span className="original-price">₨{deal.originalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                        <span className="deal-price">₨{deal.dealPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                      </div>
                      <span className="savings">Save ₨{(deal.originalPrice - deal.dealPrice).toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                    </div>

                    <div className="deal-meta">
                      <span className="location">📍 {deal.location}</span>
                      <span className="validity">
                        Valid until {formatDate(deal.validUntil)}
                      </span>
                    </div>

                    {deal.maxRedemptions && (
                      <div className="availability">
                        <div className="availability-bar">
                          <div 
                            className="availability-fill" 
                            style={{ width: `${deal.percentageLeft}%` }}
                          ></div>
                        </div>
                        <span className="availability-text">
                          {deal.available} of {deal.maxRedemptions} remaining
                        </span>
                      </div>
                    )}

                    <div className="deal-actions">
                      <button
                        onClick={() => navigate(`/deals/${deal.id}`)}
                        className="btn btn-secondary btn-full"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/deals/${deal.id}/redeem`)}
                        className="btn btn-primary btn-full"
                        disabled={deal.available === 0}
                      >
                        {deal.available === 0 ? 'Sold Out' : 'Redeem Now'}
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

export default Deals;
