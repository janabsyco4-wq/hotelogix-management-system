import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ rooms: '500+', guests: '5,000+', rating: '4.9' });
  const { register } = useAuth();
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

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'phone':
        if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
          error = 'Phone number is invalid';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate on change
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    if (result.success) {
      toast.success('Registration successful!');
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
      
      {/* Right Side - Register Form */}
      <div className="auth-form-side">
        <div className="form-container">
          <h2 className="form-title">Create Account</h2>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                  required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder="+92 300 1234567"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••••••••••"
                  required
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••••••••••"
                  required
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-login-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;