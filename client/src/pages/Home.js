import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import './Home.css';
import './HomeAdditions.css';

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      const response = await axios.get('/api/attractions');
      setAttractions(response.data);
    } catch (error) {
      console.error('Error fetching attractions:', error);
      // Fallback data if API fails
      setAttractions([
        {
          id: 1,
          title: "Badshahi Mosque",
          subtitle: "Historic Mughal Architecture",
          description: "One of the largest mosques in the world, built in 1671 by Mughal Emperor Aurangzeb...",
          image: "https://via.placeholder.com/300x200/4A90E6/FFFFFF?text=Badshahi+Mosque"
        },
        {
          id: 2,
          title: "Lahore Fort (Shahi Qila)",
          subtitle: "UNESCO World Heritage Site",
          description: "A magnificent fort complex with stunning palaces, gardens, and museums...",
          image: "https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=Lahore+Fort"
        },
        {
          id: 3,
          title: "Shalimar Gardens",
          subtitle: "Mughal Gardens",
          description: "Beautiful Mughal gardens built in 1641, featuring terraced levels and fountains...",
          image: "https://via.placeholder.com/300x200/008000/FFFFFF?text=Shalimar+Gardens"
        },
        {
          id: 4,
          title: "Tomb of Shah Rukn-e-Alam",
          subtitle: "Sufi Shrine in Multan",
          description: "A magnificent mausoleum and one of the most impressive Sufi shrines in Pakistan...",
          image: "https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Shah+Rukn+Alam"
        },
        {
          id: 5,
          title: "Hiran Minar",
          subtitle: "Mughal Monument in Sheikhupura",
          description: "A unique Mughal-era monument built by Emperor Jahangir with beautiful architecture...",
          image: "https://via.placeholder.com/300x200/4B0082/FFFFFF?text=Hiran+Minar"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, attractions.length - 2));
  };

  // eslint-disable-next-line no-unused-vars
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, attractions.length - 2)) % Math.max(1, attractions.length - 2));
  };

  if (loading) {
    return <Loading message="Loading home page..." />;
  }

  return (
    <div className="home">
      {/* Hero Section - Ultra-Minimalist Luxury Split Layout */}
      <section className="hero">
        <div className="hero-content">
          {/* Left Side - Content */}
          <div className="hero-left">
            <h1 className="hero-title">
              Effortless Hotel Management.
            </h1>
            
            <p className="hero-subtitle">
              A clean, modern system built for premium hospitality.
            </p>
            
            <div className="hero-buttons">
              <Link to="/rooms" className="btn btn-primary">Get Started</Link>
              <Link to="/smart-finder" className="btn btn-secondary">Find Room with AI</Link>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80" 
                alt="Luxury Hotel Interior" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section - Our Presence */}
      <section className="locations-section">
        <div className="container">
          <h2 className="section-title">Our Presence</h2>
          <p className="section-subtitle">
            Four distinguished properties across Pakistan's cultural heartland
          </p>
          
          <div className="locations-grid">
            <div className="location-item">
              <div className="location-count">45</div>
              <div className="location-name">Lahore</div>
              <div className="location-label">Rooms Available</div>
            </div>
            
            <div className="location-item">
              <div className="location-count">32</div>
              <div className="location-name">Okara</div>
              <div className="location-label">Rooms Available</div>
            </div>
            
            <div className="location-item">
              <div className="location-count">24</div>
              <div className="location-name">Multan</div>
              <div className="location-label">Rooms Available</div>
            </div>
            
            <div className="location-item">
              <div className="location-count">15</div>
              <div className="location-name">Sheikhupura</div>
              <div className="location-label">Rooms Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Hotelogix</h2>
          <p className="section-subtitle">Experience the perfect blend of hospitality and cutting-edge technology</p>
          
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Premium Accommodations</h3>
              <p>116 meticulously designed rooms across four major cities. From elegant standards to royal suites, each space embodies refined comfort.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3>Intelligent Booking</h3>
              <p>AI-powered room finder that understands your preferences. Seamless reservations with instant confirmation and real-time availability.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Concierge Service</h3>
              <p>24/7 intelligent assistance at your fingertips. Bilingual support ensuring every query is answered with precision and care.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <h3>Culinary Excellence</h3>
              <p>Four distinguished restaurants serving authentic regional cuisine. Traditional flavors reimagined with contemporary finesse.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Curated Experiences</h3>
              <p>Exclusive packages and bespoke itineraries. Heritage tours, cultural journeys, and spiritual experiences crafted for discerning travelers.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Cultural Gateway</h3>
              <p>Access to UNESCO heritage sites and architectural marvels. Immerse yourself in centuries of history and timeless beauty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Guest Experiences</h2>
          <p className="section-subtitle">What our guests say about their stay</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card card">
              <p className="testimonial-text">
                The attention to detail and level of service exceeded all expectations. 
                From the moment we arrived, every aspect of our stay was meticulously curated. 
                A truly luxurious experience.
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AK</div>
                <div className="author-info">
                  <div className="author-name">Ahmed Khan</div>
                  <div className="author-title">Business Executive</div>
                </div>
                <div className="testimonial-rating">★★★★★</div>
              </div>
            </div>
            
            <div className="testimonial-card card">
              <p className="testimonial-text">
                Exceptional hospitality combined with modern amenities. 
                The AI room finder made booking effortless, and the staff's warmth 
                made us feel at home. Highly recommended for discerning travelers.
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SF</div>
                <div className="author-info">
                  <div className="author-name">Sarah Fatima</div>
                  <div className="author-title">Travel Blogger</div>
                </div>
                <div className="testimonial-rating">★★★★★</div>
              </div>
            </div>
            
            <div className="testimonial-card card">
              <p className="testimonial-text">
                A perfect blend of traditional Pakistani hospitality and contemporary luxury. 
                The rooms are immaculate, the cuisine authentic, and the service impeccable. 
                Will definitely return.
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div className="author-info">
                  <div className="author-name">Muhammad Raza</div>
                  <div className="author-title">Entrepreneur</div>
                </div>
                <div className="testimonial-rating">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Visual Journey</h2>
          <p className="section-subtitle">
            A glimpse into our world of refined elegance
          </p>
          
          <div className="gallery-grid">
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" 
                alt="Luxury Suite"
              />
              <div className="gallery-overlay">
                <h4>Presidential Suite</h4>
                <p>Lahore Property</p>
              </div>
            </div>
            
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80" 
                alt="Fine Dining"
              />
              <div className="gallery-overlay">
                <h4>Fine Dining</h4>
                <p>Culinary Excellence</p>
              </div>
            </div>
            
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80" 
                alt="Spa & Wellness"
              />
              <div className="gallery-overlay">
                <h4>Wellness Center</h4>
                <p>Spa & Relaxation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Stay Informed</h2>
          <p className="newsletter-subtitle">
            Subscribe to receive exclusive offers, updates, and insights into our world of luxury hospitality.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Enter your email address"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Begin Your Journey</h2>
          <p className="cta-subtitle">
            Discover our collection of premium accommodations and curated experiences. 
            Reserve your stay and immerse yourself in unparalleled hospitality.
          </p>
          <div className="cta-buttons">
            <Link to="/rooms" className="btn btn-gold">Browse Rooms</Link>
            <Link to="/packages" className="btn btn-secondary">View Packages</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
