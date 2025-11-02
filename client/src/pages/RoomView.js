import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './RoomView.css';

const RoomView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  const handleBackToRooms = () => {
    navigate('/rooms');
  };

  if (loading) {
    return (
      <div className="room-view">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-view">
        <div className="error">Room not found</div>
      </div>
    );
  }

  return (
    <div className="room-view">
      <div className="room-header">
        <img src={room.images[0]} alt={room.title} className="room-main-image" />
      </div>

      <div className="room-body">
        {/* Left Section */}
        <div className="room-left">
          <h1 className="room-title">{room.title}</h1>
          <p className="room-location">📍 {room.location}</p>
          <p className="room-type">{room.type}</p>

          {/* Room Details */}
          <div className="room-details">
            <div className="detail">
              <span>👥 Capacity</span> {room.capacity} guests
            </div>
            <div className="detail">
              <span>📐 Size</span> {room.size}
            </div>
            <div className="detail">
              <span>🛏️ Bed</span> {room.bedType}
            </div>
            <div className="detail">
              <span>💰 Price</span> ${room.pricePerNight}/night
            </div>
          </div>

          {/* Description */}
          <div className="room-section">
            <h2>Description</h2>
            <p>{room.description}</p>
          </div>

          {/* Amenities */}
          <div className="room-section">
            <h2>Amenities</h2>
            <ul className="amenities-list">
              {room.amenities.map((amenity, index) => (
                <li key={index}>✓ {amenity}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="action-buttons">
            <button onClick={handleBackToRooms} className="btn btn-secondary">
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

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Guest Reviews</h2>
          
          <div className="rating-info">
            <span className="rating-score">4.7</span>
            <span className="rating-stars">
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star half">★</span>
            </span>
            <span className="review-count">(18 reviews)</span>
          </div>

          <div className="reviews-list">
            <div className="review-card">
              <div className="review-header">
                <strong>Ahmed Khan</strong>
                <span className="review-date">1 week ago</span>
              </div>
              <div className="review-stars">
                ★★★★★
              </div>
              <p>Excellent room with great amenities. The staff was very helpful and the location is perfect! Would definitely stay here again.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Fatima Ali</strong>
                <span className="review-date">2 weeks ago</span>
              </div>
              <div className="review-stars">
                ★★★★★
              </div>
              <p>Beautiful room and very clean. Highly recommend for families! The kids loved the spacious layout.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Hassan Raza</strong>
                <span className="review-date">3 weeks ago</span>
              </div>
              <div className="review-stars">
                ★★★★☆
              </div>
              <p>Great value for money. Room was comfortable and spacious. Only minor issue was the WiFi speed.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Ayesha Malik</strong>
                <span className="review-date">1 month ago</span>
              </div>
              <div className="review-stars">
                ★★★★★
              </div>
              <p>Loved the stay! Everything was perfect from check-in to check-out. The bed was incredibly comfortable.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Usman Tariq</strong>
                <span className="review-date">1 month ago</span>
              </div>
              <div className="review-stars">
                ★★★★★
              </div>
              <p>Outstanding service and beautiful room. The view was amazing and breakfast was delicious!</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Zainab Ahmed</strong>
                <span className="review-date">2 months ago</span>
              </div>
              <div className="review-stars">
                ★★★★☆
              </div>
              <p>Very nice room with modern amenities. Good location near attractions. Would recommend!</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Ali Haider</strong>
                <span className="review-date">2 months ago</span>
              </div>
              <div className="review-stars">
                ★★★★★
              </div>
              <p>Perfect for business travelers. Clean, quiet, and professional. The workspace was excellent.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <strong>Sana Iqbal</strong>
                <span className="review-date">3 months ago</span>
              </div>
              <div className="review-stars">
                ★★★★☆
              </div>
              <p>Comfortable stay with friendly staff. Room was clean and well-maintained. Good experience overall.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
