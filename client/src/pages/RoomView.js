import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './RoomView.css';

const RoomView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Room not found');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  if (loading) {
    return (
      <div className="room-view-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-view-page">
        <div className="container">
          <h2>Room not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="room-view-page">
      <div className="room-hero">
        <div className="image-gallery">
          <button className="gallery-btn gallery-btn-prev" onClick={prevImage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <img 
            src={room.images[currentImageIndex] || 'https://via.placeholder.com/800x500'} 
            alt={room.title} 
            className="hero-image" 
          />
          
          <button className="gallery-btn gallery-btn-next" onClick={nextImage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="image-counter">
            {currentImageIndex + 1} / {room.images.length}
          </div>
        </div>
      </div>

      <div className="room-content">
        <div className="container">
          <div className="room-info">
            <div className="room-header">
              <h1 className="room-title">{room.title}</h1>
              <span className="room-type-badge">{room.type}</span>
            </div>
            
            <div className="room-location">
              <span className="location-icon">📍</span>
              <span>{room.location}</span>
            </div>
            
            <div className="room-quick-info">
              <div className="quick-info-item">
                <span className="info-icon">👥</span>
                <span>Up to {room.capacity} guests</span>
              </div>
              <div className="quick-info-item">
                <span className="info-icon">📐</span>
                <span>{room.size}</span>
              </div>
              <div className="quick-info-item">
                <span className="info-icon">🛏️</span>
                <span>{room.bedType}</span>
              </div>
              <div className="quick-info-item">
                <span className="info-icon">💰</span>
                <span>${room.pricePerNight}/night</span>
              </div>
            </div>
            
            <div className="room-description">
              <h2>About This Room</h2>
              <p>{room.description}</p>
            </div>
            
            <div className="amenities-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-check">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => navigate('/rooms')} className="btn btn-secondary">
                Back to Rooms
              </button>
              {room.isAvailable ? (
                <button onClick={handleBookNow} className="btn btn-primary">
                  Book Now
                </button>
              ) : (
                <button className="btn btn-disabled" disabled>
                  Not Available
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
