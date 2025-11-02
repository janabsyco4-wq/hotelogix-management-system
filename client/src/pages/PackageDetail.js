import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    guests: 2
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [id]);

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

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info('Please login to book this package');
      navigate('/login');
      return;
    }

    if (!bookingData.startDate) {
      toast.error('Please select a start date');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(`/api/packages/${pkg.id}/book`, {
        startDate: bookingData.startDate,
        guests: bookingData.guests
      });

      toast.success('Package booked successfully!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to book package');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading package details..." />;
  }

  if (!pkg) {
    return null;
  }

  return (
    <div className="package-detail-page">
      <div className="package-hero">
        <img src={pkg.images[0]} alt={pkg.name} />
        <div className="hero-overlay">
          <div className="container">
            <button onClick={() => navigate('/packages')} className="back-btn">
              ← Back to Packages
            </button>
            <div className="duration-badge-large">{pkg.duration}</div>
            <h1>{pkg.name}</h1>
            <div className="package-meta">
              <span className="location">📍 {pkg.location}</span>
              <span className="price">${pkg.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="package-content">
        <div className="container">
          <div className="content-grid">
            <div className="main-content">
              <section className="section">
                <h2>About This Package</h2>
                <p className="description">{pkg.description}</p>
              </section>

              <section className="section">
                <h2>What's Included</h2>
                <div className="includes-list">
                  {pkg.includes.map((item, index) => (
                    <div key={index} className="include-item">
                      <span className="check-icon">✓</span>
                      <span className="include-text">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {pkg.images.length > 1 && (
                <section className="section">
                  <h2>Gallery</h2>
                  <div className="image-gallery">
                    {pkg.images.slice(1).map((image, index) => (
                      <div key={index} className="gallery-image">
                        <img src={image} alt={`${pkg.name} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="sidebar">
              <div className="booking-card">
                <h3>Book This Package</h3>
                <div className="package-price">
                  <span className="price-label">Total Price</span>
                  <span className="price-amount">${pkg.price.toFixed(2)}</span>
                  <span className="price-note">per package</span>
                </div>

                {!showBookingForm ? (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="btn btn-primary btn-large"
                  >
                    Book Now
                  </button>
                ) : (
                  <form onSubmit={handleBooking} className="booking-form">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Number of Guests</label>
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
                      <div className="summary-row">
                        <span>Package Price</span>
                        <span>${pkg.price.toFixed(2)}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span>${pkg.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                )}

                {!user && (
                  <p className="login-note">
                    Please <a href="/login">login</a> to book this package
                  </p>
                )}
              </div>

              <div className="info-card">
                <h4>Package Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{pkg.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{pkg.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Includes</span>
                  <span className="detail-value">{pkg.includes.length} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
