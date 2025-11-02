import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Toggle called, changing from', showBookDropdown, 'to', !showBookDropdown);
    setShowBookDropdown(prev => !prev);
  };

  const closeDropdown = () => {
    setShowBookDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log('Clicked outside, closing dropdown');
        setShowBookDropdown(false);
      }
    };

    if (showBookDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBookDropdown]);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="logo-text">
            <span className="logo-main">Hotelogix</span>
            <span className="logo-sub">Management</span>
          </div>
        </Link>
        
        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>HOME</Link></li>
            
            {/* Book Now Dropdown */}
            <li 
              className="nav-dropdown"
              ref={dropdownRef}
            >
              <button 
                type="button"
                className="nav-link dropdown-trigger"
                onClick={toggleDropdown}
              >
                📅 BOOK NOW {showBookDropdown ? '▲' : '▼'}
              </button>
              {showBookDropdown && (
                <>
                  <div className="dropdown-backdrop" onClick={closeDropdown}></div>
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {console.log('Dropdown menu rendering')}
                  <Link 
                    to="/rooms" 
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-icon">🛏️</span>
                    <div className="dropdown-content">
                      <span className="dropdown-title">Rooms</span>
                      <span className="dropdown-desc">Book your perfect room</span>
                    </div>
                  </Link>
                  <Link 
                    to="/dining" 
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-icon">🍽️</span>
                    <div className="dropdown-content">
                      <span className="dropdown-title">Dining</span>
                      <span className="dropdown-desc">Reserve a table</span>
                    </div>
                  </Link>
                  <Link 
                    to="/deals" 
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-icon">🎁</span>
                    <div className="dropdown-content">
                      <span className="dropdown-title">Deals</span>
                      <span className="dropdown-desc">Exclusive offers</span>
                    </div>
                  </Link>
                  <Link 
                    to="/packages" 
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-icon">📦</span>
                    <div className="dropdown-content">
                      <span className="dropdown-title">Packages</span>
                      <span className="dropdown-desc">All-inclusive packages</span>
                    </div>
                  </Link>
                </div>
                </>
              )}
            </li>
            
            <li><Link to="/smart-finder" className={`nav-link ${isActive('/smart-finder') ? 'active' : ''}`}>🤖 AI FINDER</Link></li>
            {user && (
              <>
                <li><Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}>MY BOOKINGS</Link></li>
                {!user.email.includes('admin') && (
                  <li><Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>👤 PROFILE</Link></li>
                )}
                {user.email.includes('admin') && (
                  <>
                    <li><Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>ADMIN</Link></li>
                    <li><Link to="/ai-analytics" className={`nav-link ${isActive('/ai-analytics') ? 'active' : ''}`}>🤖 AI ANALYTICS</Link></li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
        
        <div className="auth-section">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">LOGIN</Link>
              <Link to="/register" className="btn btn-primary">REGISTER</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;