import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section">
              <h3 className="footer-title">Hotelogix</h3>
              <p className="footer-description">
                Your premier destination for luxury accommodations and exceptional hospitality. 
                Experience comfort, elegance, and world-class service at our properties across Okara, Lahore, Sheikhupura, and Multan.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
                <li><Link to="/smart-finder">AI Room Finder</Link></li>
                <li><Link to="/dining">Dining</Link></li>
                <li><Link to="/deals">Deals</Link></li>
                <li><Link to="/packages">Packages</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><Link to="/my-bookings">My Bookings</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Okara, Lahore, Sheikhupura & Multan, Punjab</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <a href="tel:+923104594964">+92 310 4594964</a>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:shehroozking3@gmail.com">shehroozking3@gmail.com</a>
                </li>
                <li>
                  <i className="fab fa-whatsapp"></i>
                  <a href="https://wa.me/923104594964" target="_blank" rel="noopener noreferrer">
                    WhatsApp: +92 310 4594964
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © {currentYear} Hotelogix. All rights reserved. | Developed by <strong>Shehrooz Hafeez</strong>
              </p>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy</Link>
                <span className="separator">•</span>
                <Link to="/terms">Terms</Link>
                <span className="separator">•</span>
                <Link to="/sitemap">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
