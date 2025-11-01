import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import './PackageDetail.css';

const PackageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="package-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
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
              <div className="pricing-card">
                <h3>Package Pricing</h3>
                <div className="package-price">
                  <span className="price-label">Total Price</span>
                  <span className="price-amount">${pkg.price.toFixed(2)}</span>
                  <span className="price-note">per package</span>
                </div>

                <button
                  onClick={() => navigate(`/packages/${pkg.id}/book`)}
                  className="btn btn-primary btn-large"
                >
                  Book This Package
                </button>
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

export default PackageView;
