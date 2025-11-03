import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, attractions.length - 2));
  };

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
          <h2 className="section-title">Why Choose Hotelogix?</h2>
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">🏨</div>
              <h3>Premium Accommodations</h3>
              <p>Luxurious rooms and suites with modern amenities and comfortable furnishings.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Recommendations</h3>
              <p>Machine learning algorithms suggest the perfect rooms based on your preferences.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">⭐</div>
              <h3>Exceptional Service</h3>
              <p>24/7 customer service and personalized attention to every guest.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
