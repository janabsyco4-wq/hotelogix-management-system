import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>About Hotelogix</h1>
          <p>Your Premier Destination for Luxury & Comfort</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="container">
          {/* Our Story */}
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Welcome to Hotelogix, where luxury meets innovation. Founded with a vision to revolutionize 
              the hospitality industry, we combine traditional warmth with cutting-edge technology to deliver 
              an unparalleled guest experience.
            </p>
            <p>
              Located in the heart of Kansas City and Independence, Missouri, our properties offer the perfect 
              blend of comfort, elegance, and modern amenities. Whether you're traveling for business or leisure, 
              we're committed to making your stay memorable.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="mission-vision">
            <div className="mv-grid">
              <div className="mv-card">
                <div className="mv-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To provide exceptional hospitality experiences through innovative technology, 
                  personalized service, and unwavering commitment to guest satisfaction.
                </p>
              </div>
              <div className="mv-card">
                <div className="mv-icon">🌟</div>
                <h3>Our Vision</h3>
                <p>
                  To be the leading hotel management system that sets new standards in hospitality, 
                  combining AI-powered recommendations with human touch.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="about-section">
            <h2>Why Choose Hotelogix?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <h4>AI-Powered Recommendations</h4>
                <p>Our smart room finder uses machine learning to match you with the perfect accommodation.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏨</div>
                <h4>Premium Accommodations</h4>
                <p>Luxurious rooms and suites designed for comfort and elegance.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🍽️</div>
                <h4>World-Class Dining</h4>
                <p>Experience culinary excellence at our award-winning restaurants.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💎</div>
                <h4>Exclusive Deals</h4>
                <p>Special offers and packages tailored to enhance your stay.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <h4>24/7 Service</h4>
                <p>Round-the-clock support to ensure your comfort and satisfaction.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h4>Secure Booking</h4>
                <p>Safe and encrypted payment processing for peace of mind.</p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="about-section values-section">
            <h2>Our Core Values</h2>
            <div className="values-list">
              <div className="value-item">
                <span className="value-number">01</span>
                <div className="value-content">
                  <h4>Excellence</h4>
                  <p>We strive for excellence in every aspect of our service.</p>
                </div>
              </div>
              <div className="value-item">
                <span className="value-number">02</span>
                <div className="value-content">
                  <h4>Innovation</h4>
                  <p>Embracing technology to enhance the guest experience.</p>
                </div>
              </div>
              <div className="value-item">
                <span className="value-number">03</span>
                <div className="value-content">
                  <h4>Integrity</h4>
                  <p>Building trust through transparency and honesty.</p>
                </div>
              </div>
              <div className="value-item">
                <span className="value-number">04</span>
                <div className="value-content">
                  <h4>Hospitality</h4>
                  <p>Treating every guest like family with warmth and care.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="about-section team-section">
            <h2>Meet Our Founder</h2>
            <div className="team-card">
              <div className="team-info">
                <h3>Shehrooz Hafeez</h3>
                <p className="team-role">Founder & CEO</p>
                <p className="team-bio">
                  With a passion for hospitality and technology, Shehrooz founded Hotelogix to create 
                  a seamless blend of luxury accommodation and innovative guest services. His vision 
                  has transformed the way guests experience hotel stays.
                </p>
                <div className="team-contact">
                  <a href="mailto:shehroozking3@gmail.com" className="contact-link">
                    <i className="fas fa-envelope"></i> shehroozking3@gmail.com
                  </a>
                  <a href="tel:+923104594964" className="contact-link">
                    <i className="fas fa-phone"></i> +92 310 4594964
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="about-cta">
            <h2>Ready to Experience Hotelogix?</h2>
            <p>Book your stay today and discover the perfect blend of luxury and innovation.</p>
            <div className="cta-buttons">
              <a href="/rooms" className="btn btn-primary">Browse Rooms</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
