import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import './Home.css';

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
      {/* Hero Section */}
      <section className="hero">
        {/* Floating decorative elements */}
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
          <div className="float-element float-4"></div>
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <svg width="120" height="120" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="url(#gradient)"/>
              <circle cx="32" cy="32" r="30" fill="url(#innerGradient)" opacity="0.3"/>
              <rect x="14" y="38" width="36" height="3" rx="1" fill="white"/>
              <rect x="16" y="28" width="32" height="10" rx="1.5" fill="white"/>
              <circle cx="22" cy="26" r="4" fill="white" opacity="0.9"/>
              <rect x="14" y="20" width="3" height="18" rx="1.5" fill="white"/>
              <circle cx="35" cy="26" r="3.5" fill="white" opacity="0.95"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#4A90E2', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#357ABD', stopOpacity:1}} />
                </linearGradient>
                <radialGradient id="innerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.2}} />
                  <stop offset="100%" style={{stopColor:'#000000', stopOpacity:0.1}} />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <h1 className="hero-title">Welcome to Hotelogix</h1>
          <p className="hero-subtitle">Premium hotel management and booking solutions</p>
          <div className="hero-buttons">
            <Link to="/smart-finder" className="btn btn-primary">🤖 AI ROOM FINDER</Link>
            <Link to="/rooms" className="btn btn-secondary">EXPLORE ROOMS</Link>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Hotelogix Pakistan?</h2>
          <p className="section-subtitle">Experience the perfect blend of Pakistani hospitality and cutting-edge technology</p>
          
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">🏨</div>
              <h3>116 Premium Rooms</h3>
              <p>Across 4 major cities - Okara, Lahore, Sheikhupura & Multan. From budget-friendly to royal suites (PKR 2,800 - 150,000).</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Smart Finder</h3>
              <p>Our intelligent system learns your preferences and suggests the perfect room based on your budget, location, and amenities needs.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Intelligent Chatbot</h3>
              <p>Get instant answers about rooms, rates, bookings, and amenities. Bilingual support in English and Urdu available anytime!</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🍽️</div>
              <h3>Authentic Pakistani Cuisine</h3>
              <p>4 premium restaurants serving traditional Lahori, Multani, and Punjabi delicacies with modern dining experiences.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🎁</div>
              <h3>Exclusive Deals & Packages</h3>
              <p>5 active deals and 4 curated tour packages including heritage tours, spiritual journeys, and cultural experiences.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">🗺️</div>
              <h3>Cultural Attractions</h3>
              <p>Explore 6 UNESCO sites and historical landmarks - Badshahi Mosque, Lahore Fort, Shalimar Gardens & more!</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment Options</h3>
              <p>Multiple payment methods: Credit/Debit cards, JazzCash, EasyPaisa, Bank Transfer, and Cash on Arrival.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">📱</div>
              <h3>Real-Time Booking System</h3>
              <p>Instant confirmation via email & SMS. Track your bookings, manage reservations, and request cancellations online.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">⭐</div>
              <h3>4.5+ Star Rating</h3>
              <p>Trusted by thousands of guests. Exceptional service, cleanliness, and authentic Pakistani hospitality guaranteed.</p>
            </div>
          </div>
          
          <div className="stats-banner">
            <div className="stat-item">
              <div className="stat-number">116</div>
              <div className="stat-label">Premium Rooms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Major Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Room Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
