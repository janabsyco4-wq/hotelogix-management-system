import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './DealDetail.css';

const DealView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    try {
      const response = await axios.get(`/api/deals/${id}`);
      setDeal(response.data);
    } catch (error) {
      console.error('Error fetching deal:', error);
      toast.error('Deal not found');
      navigate('/deals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="deal-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return null;
  }

  return (
    <div className="deal-detail-page">
      <div className="deal-hero">
        <img src={deal.images[0]} alt={deal.title} />
        <div className="hero-overlay">
          <div className="container">
            <button onClick={() => navigate('/deals')} className="back-btn">
              ← Back to Deals
            </button>
            <div className="discount-badge-large">{deal.discount}% OFF</div>
            <h1>{deal.title}</h1>
            <div className="deal-meta">
              <span className="deal-type">{deal.type}</span>
              <span className="location">📍 {deal.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="deal-content">
        <div className="container">
          <div className="content-grid">
            <div className="main-content">
              <section className="section">
                <h2>About This Deal</h2>
                <p className="description">{deal.description}</p>
              </section>

              <section className="section">
                <h2>Terms & Conditions</h2>
                <p className="terms">{deal.terms}</p>
              </section>

              <section className="section">
                <h2>Validity</h2>
                <div className="validity-info">
                  <div className="validity-item">
                    <span className="label">Valid From</span>
                    <span className="value">{formatDate(deal.validFrom)}</span>
                  </div>
                  <div className="validity-item">
                    <span className="label">Valid Until</span>
                    <span className="value">{formatDate(deal.validUntil)}</span>
                  </div>
                </div>
              </section>

              {deal.maxRedemptions && (
                <section className="section">
                  <h2>Availability</h2>
                  <div className="availability-section">
                    <div className="availability-bar">
                      <div 
                        className="availability-fill" 
                        style={{ width: `${deal.percentageLeft}%` }}
                      ></div>
                    </div>
                    <p className="availability-text">
                      {deal.available} of {deal.maxRedemptions} deals remaining ({deal.percentageLeft}%)
                    </p>
                  </div>
                </section>
              )}
            </div>

            <div className="sidebar">
              <div className="pricing-card">
                <h3>Deal Pricing</h3>
                <div className="price-comparison">
                  <div className="original-price">
                    <span className="label">Original Price</span>
                    <span className="amount">${deal.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="deal-price">
                    <span className="label">Deal Price</span>
                    <span className="amount">${deal.dealPrice.toFixed(2)}</span>
                  </div>
                  <div className="savings">
                    <span className="label">You Save</span>
                    <span className="amount">${(deal.originalPrice - deal.dealPrice).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/deals/${deal.id}/redeem`)}
                  disabled={deal.available === 0}
                  className="btn btn-primary btn-large"
                >
                  {deal.available === 0 ? 'Sold Out' : 'Redeem This Deal'}
                </button>
              </div>

              <div className="info-card">
                <h4>How It Works</h4>
                <ol>
                  <li>Click "Redeem This Deal"</li>
                  <li>Receive your unique redemption code</li>
                  <li>Present the code when booking or checking in</li>
                  <li>Enjoy your savings!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealView;
