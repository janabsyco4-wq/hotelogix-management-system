import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/StripePayment';
import Loading from '../components/Loading';
import './BookPackage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SOjybFsAUb4gKn6SYm9xmCiVHgXyvhnIz5VrMEK02X772dYOQoh3UHIlNXtf9vT5UBzS19GfW9qXr9VZtY01Y4h006hoQfgFc');

const BookPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    guests: 2
  });

  useEffect(() => {
    if (!user) {
      toast.info('Please login to book this package');
      navigate('/login');
      return;
    }
    fetchPackage();
  }, [id, user, navigate]);

  const fetchPackage = async () => {
    try {
      const response = await axios.get(`/api/packages/${id}`);
      setPkg(response.data);
    } catch (error) {
      console.error('Error fetching package:', error);
      toast.error('Package not found');
      navigate('/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.startDate) {
      toast.error('Please select a start date');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = (booking) => {
    toast.success('Payment successful! Package booked.');
    navigate('/my-bookings');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return <Loading message="Loading package details..." />;
  }

  if (!pkg) {
    return null;
  }

  return (
    <div className="book-package-page">
      <div className="booking-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <button onClick={() => navigate(`/packages/${id}`)} className="back-btn">
            ← Back to Package
          </button>
          <h1>Book Package</h1>
          <p>{pkg.name}</p>
        </div>
      </div>

      <div className="booking-content">
        <div className="container">
          <div className="booking-grid">
            <div className="package-summary">
              <img src={pkg.images[0]} alt={pkg.name} />
              <div className="summary-info">
                <h2>{pkg.name}</h2>
                <p className="duration">{pkg.duration}</p>
                <p className="location">📍 {pkg.location}</p>
                <div className="includes-preview">
                  <h4>Includes:</h4>
                  <ul>
                    {pkg.includes.slice(0, 4).map((item, idx) => (
                      <li key={idx}>✓ {item}</li>
                    ))}
                    {pkg.includes.length > 4 && (
                      <li>+ {pkg.includes.length - 4} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="booking-form-card">
              {!showPayment ? (
                <>
                  <h3>Booking Details</h3>
                  <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <small>Your package experience begins on this date</small>
                </div>

                <div className="form-group">
                  <label>Number of Guests *</label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="summary-row">
                    <span>Package</span>
                    <span>{pkg.name}</span>
                  </div>
                  <div className="summary-row">
                    <span>Duration</span>
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="summary-row">
                    <span>Start Date</span>
                    <span>{bookingData.startDate || 'Not selected'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Guests</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Price</span>
                    <span>${pkg.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/packages/${id}`)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
                </>
              ) : (
                <>
                  <h3>Payment</h3>
                  <Elements stripe={stripePromise}>
                    <StripePayment
                      amount={pkg.price}
                      bookingType="package"
                      bookingData={{
                        packageId: pkg.id,
                        startDate: bookingData.startDate,
                        guests: bookingData.guests
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

export default BookPackage;
