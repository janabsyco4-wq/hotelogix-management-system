import React from 'react';
import { Link } from 'react-router-dom';
import './Sitemap.css';

const Sitemap = () => {
  const sitemapSections = [
    {
      title: 'Main Pages',
      links: [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
        { path: '/faq', label: 'FAQ' }
      ]
    },
    {
      title: 'Booking',
      links: [
        { path: '/rooms', label: 'Rooms' },
        { path: '/smart-finder', label: 'AI Room Finder' },
        { path: '/dining', label: 'Dining' },
        { path: '/deals', label: 'Deals' },
        { path: '/packages', label: 'Packages' }
      ]
    },
    {
      title: 'User Account',
      links: [
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
        { path: '/profile', label: 'My Profile' },
        { path: '/my-bookings', label: 'My Bookings' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { path: '/privacy', label: 'Privacy Policy' },
        { path: '/terms', label: 'Terms & Conditions' }
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <div className="sitemap-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>Sitemap</h1>
          <p>Navigate through all pages of Hotelogix</p>
        </div>
      </div>

      <div className="sitemap-content">
        <div className="container">
          <div className="sitemap-grid">
            {sitemapSections.map((section, index) => (
              <div key={index} className="sitemap-section">
                <h2>{section.title}</h2>
                <ul>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
