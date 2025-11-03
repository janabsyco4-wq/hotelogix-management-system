import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/StripePayment';
import Loading from '../components/Loading';
import './RedeemDeal.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SOjybFsAUb4gKn6SYm9xmCiVHgXyvhnIz5VrMEK02X772dYOQoh3UHIlNXtf9vT5UBzS19GfW9qXr9VZtY01Y4h006hoQfgFc');

const RedeemDeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.info('Please login to redeem this deal');
      navigate('/login');
      return;
    }
    fetchDeal();
  }, [id, user, navigate]);

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

  const handleRedeem = async () => {
    if (deal.available === 0) {
      toast.error('This deal is sold out');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = (redemption) => {
    setRedemptionCode(redemption.redemptionCode);
    toast.success('Payment successful! Deal redeemed.');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading message="Loading deal details..." />;
  }

  if (!deal) {
    return null;
  }

  if (redemptionCode) {
    return (
      <div className="redeem-deal-page">
        <div className="success-hero">
          <div className="hero-decoration">
            <div className="float-element float-1"></div>
            <div className="float-element float-2"></div>
            <div className="float-element float-3"></div>
          </div>
          <div className="container">
            <div className="success-icon">✓</div>
            <h1>Deal Redeemed Successfully!</h1>
            <p>Your redemption code is ready</p>
          </div>
        </div>

        <div className="success-content">
          <div className="container">
            <div className="code-card">
              <h2>Your Redemption Code</h2>
              <div className="code-display">
                <span className="code">{redemptionCode}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(redemptionCode);
                    toast.success('Code copied to clipboard!');
                  }}
                  className="btn btn-secondary"
                >
                  📋 Copy Code
                </button>
              </div>
              <p className="code-note">
                Present this code when booking or checking in to receive your discount
              </p>
            </div>

            <div className="deal-summary-card">
              <h3>Deal Summary</h3>
              <div className="summary-row">
                <span>Deal</span>
                <span>{deal.title}</span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span>{deal.discount}% OFF</span>
              </div>
              <div className="summary-row">
                <span>Original Price</span>
                <span>₨{deal.originalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
              </div>
              <div className="summary-row highlight">
                <span>Deal Price</span>
                <span>₨{deal.dealPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
              </div>
              <div className="summary-row savings">
                <span>You Save</span>
                <span>₨{(deal.originalPrice - deal.dealPrice).toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => navigate('/my-bookings')}
                className="btn btn-primary"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/deals')}
                className="btn btn-secondary"
              >
                Browse More Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="redeem-deal-page">
      <div className="redeem-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <button onClick={() => navigate(`/deals/${id}`)} className="back-btn">
            ← Back to Deal
          </button>
          <h1>Redeem Deal</h1>
          <p>Confirm your redemption</p>
        </div>
      </div>

      <div className="redeem-content">
        <div className="container">
          <div className="redeem-grid">
            <div className="deal-summary">
              <img src={deal.images[0]} alt={deal.title} />
              <div className="discount-badge">{deal.discount}% OFF</div>
              <div className="summary-info">
                <h2>{deal.title}</h2>
                <p className="deal-type">{deal.type}</p>
                <p className="location">📍 {deal.location}</p>
              </div>
            </div>

            <div className="redeem-form-card">
              {!showPayment ? (
                <>
                  <h3>Confirm Redemption</h3>
                  
                  <div className="pricing-display">
                <div className="price-row">
                  <span className="label">Original Price</span>
                  <span className="original">₨{deal.originalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                </div>
                <div className="price-row">
                  <span className="label">Deal Price</span>
                  <span className="deal">₨{deal.dealPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                </div>
                <div className="price-row savings">
                  <span className="label">You Save</span>
                  <span className="amount">₨{(deal.originalPrice - deal.dealPrice).toLocaleString('en-PK', {minimumFractionDigits: 0})}</span>
                </div>
              </div>

              <div className="validity-display">
                <h4>Validity Period</h4>
                <p>Valid from {formatDate(deal.validFrom)} to {formatDate(deal.validUntil)}</p>
              </div>

              <div className="terms-display">
                <h4>Terms & Conditions</h4>
                <p>{deal.terms}</p>
              </div>

              {deal.maxRedemptions && (
                <div className="availability-display">
                  <p className="availability-text">
                    {deal.available} of {deal.maxRedemptions} deals remaining
                  </p>
                </div>
              )}

              <div className="form-actions">
                <button
                  onClick={() => navigate(`/deals/${id}`)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming || deal.available === 0}
                  className="btn btn-primary"
                >
                  {deal.available === 0 ? 'Sold Out' : 'Proceed to Payment'}
                </button>
              </div>
                </>
              ) : (
                <>
                  <h3>Payment</h3>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      amount={deal.dealPrice}
                      bookingType="deal"
                      bookingData={{
                        dealId: deal.id
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

export default RedeemDeal;
