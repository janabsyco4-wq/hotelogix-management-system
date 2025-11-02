import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      category: 'Booking & Reservations',
      questions: [
        {
          question: 'How do I make a reservation?',
          answer: 'You can make a reservation through our website by browsing available rooms, selecting your dates, and completing the booking process. You can also use our AI Room Finder for personalized recommendations.'
        },
        {
          question: 'Can I modify or cancel my booking?',
          answer: 'Yes, you can modify or cancel your booking through the "My Bookings" section. Cancellation policies vary by room type and rate. Free cancellation is typically available up to 24 hours before check-in.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and secure online payment methods through Stripe.'
        },
        {
          question: 'Do I need to pay in advance?',
          answer: 'Payment is required at the time of booking to confirm your reservation. Some special rates may require full prepayment.'
        }
      ]
    },
    {
      category: 'Check-in & Check-out',
      questions: [
        {
          question: 'What are the check-in and check-out times?',
          answer: 'Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and additional charges.'
        },
        {
          question: 'What do I need to bring for check-in?',
          answer: 'Please bring a valid government-issued photo ID and the credit card used for booking. International guests should also bring their passport.'
        },
        {
          question: 'Is early check-in available?',
          answer: 'Early check-in is subject to availability. Please contact us in advance to request early check-in, and we\'ll do our best to accommodate you.'
        }
      ]
    },
    {
      category: 'Rooms & Amenities',
      questions: [
        {
          question: 'What amenities are included in the rooms?',
          answer: 'All rooms include free WiFi, air conditioning, flat-screen TV, mini bar, coffee maker, and premium toiletries. Specific amenities vary by room type.'
        },
        {
          question: 'Are pets allowed?',
          answer: 'We offer pet-friendly rooms in select properties. Please contact us in advance to arrange pet accommodation. Additional fees may apply.'
        },
        {
          question: 'Do you have accessible rooms?',
          answer: 'Yes, we have ADA-compliant accessible rooms available. Please specify your accessibility needs when booking.'
        },
        {
          question: 'Is WiFi free?',
          answer: 'Yes, complimentary high-speed WiFi is available throughout the property for all guests.'
        }
      ]
    },
    {
      category: 'Dining & Services',
      questions: [
        {
          question: 'Do you have on-site restaurants?',
          answer: 'Yes, we have multiple dining options including fine dining restaurants, casual cafes, and room service available 24/7.'
        },
        {
          question: 'Is breakfast included?',
          answer: 'Breakfast inclusion depends on your room rate. Some packages include complimentary breakfast. Check your booking details or upgrade at check-in.'
        },
        {
          question: 'Do you offer room service?',
          answer: 'Yes, 24-hour room service is available for all guests. Browse our menu through the in-room tablet or call the front desk.'
        }
      ]
    },
    {
      category: 'AI Room Finder',
      questions: [
        {
          question: 'How does the AI Room Finder work?',
          answer: 'Our AI Room Finder uses machine learning algorithms to analyze your preferences (travel type, group size, budget, dates) and recommends the best-matched rooms based on historical booking data and guest satisfaction.'
        },
        {
          question: 'Is the AI recommendation accurate?',
          answer: 'Our AI model has a 92% accuracy rate and continuously learns from guest feedback to improve recommendations. It considers multiple factors to find your perfect room.'
        },
        {
          question: 'Can I still browse rooms manually?',
          answer: 'Absolutely! The AI Room Finder is an optional tool. You can always browse all available rooms and filter them manually.'
        }
      ]
    },
    {
      category: 'Policies & Other',
      questions: [
        {
          question: 'What is your cancellation policy?',
          answer: 'Standard cancellation is free up to 24 hours before check-in. Cancellations within 24 hours may incur a one-night charge. Special rates may have different policies.'
        },
        {
          question: 'Do you offer group bookings?',
          answer: 'Yes, we offer special rates for group bookings of 5 or more rooms. Please contact our sales team for customized packages.'
        },
        {
          question: 'Is parking available?',
          answer: 'Yes, we offer both self-parking and valet parking services. Fees vary by location. Some packages include complimentary parking.'
        },
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach us 24/7 via phone (+92 310 4594964), email (shehroozking3@gmail.com), WhatsApp, or through our website contact form.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <div className="faq-hero">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
        </div>
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our services</p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="container">
          <div className="faq-intro">
            <h2>How Can We Help You?</h2>
            <p>Browse through our most frequently asked questions below. If you can't find what you're looking for, feel free to <a href="/contact">contact us</a>.</p>
          </div>

          <div className="faq-categories">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <h3 className="category-title">
                  <span className="category-icon">📋</span>
                  {category.category}
                </h3>
                <div className="faq-list">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isActive = activeIndex === index;
                    
                    return (
                      <div key={questionIndex} className={`faq-item ${isActive ? 'active' : ''}`}>
                        <button
                          className="faq-question"
                          onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        >
                          <span>{faq.question}</span>
                          <i className={`fas fa-chevron-${isActive ? 'up' : 'down'}`}></i>
                        </button>
                        <div className={`faq-answer ${isActive ? 'show' : ''}`}>
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="faq-cta">
            <h2>Still Have Questions?</h2>
            <p>Our support team is available 24/7 to assist you</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">Contact Us</a>
              <a href="tel:+923104594964" className="btn btn-secondary">Call Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
