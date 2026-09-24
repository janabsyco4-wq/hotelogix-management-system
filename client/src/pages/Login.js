import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ rooms: '500+', guests: '5,000+', rating: '4.9' });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rooms`);
        const data = await response.json();
        console.log('Rooms data:', data);
        
        // Handle different response formats
        let roomCount = '500+';
        if (Array.isArray(data)) {
          roomCount = data.length + '+';
        } else if (data.rooms && Array.isArray(data.rooms)) {
          roomCount = data.rooms.length + '+';
        }
        
        setStats(prev => ({ ...prev, rooms: roomCount }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-split-page">
      {/* Left Side - Brand */}
      <div className="auth-brand-side">
        <div className="brand-content">
          <h1 className="brand-title">Hotelogix</h1>
          <p className="brand-subtitle">Premium Hotel Experience</p>
          
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">🏨</div>
              <div className="feature-text">
                <h3>Luxury Accommodations</h3>
                <p>Experience world-class comfort and service</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <div className="feature-text">
                <h3>Member Benefits</h3>
                <p>Get exclusive deals and early access</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h3>Smart Booking</h3>
                <p>AI-powered room recommendations</p>
              </div>
            </div>
          </div>
          
          <div className="brand-stats">
            <div className="stat">
              <div className="stat-number">{stats.guests}</div>
              <div className="stat-label">Happy Guests</div>
            </div>
            <div className="stat">
              <div className="stat-number">{stats.rooms}</div>
              <div className="stat-label">Rooms</div>
            </div>
            <div className="stat">
              <div className="stat-number">{stats.rating}</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="auth-form-side">
        <div className="form-container">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Login to access your account</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••••••••••"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-login-submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Login to Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Create Account</Link></p>
            <p className="auth-divider">or</p>
            <Link to="/" className="guest-link">Browse Rooms as Guest →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;