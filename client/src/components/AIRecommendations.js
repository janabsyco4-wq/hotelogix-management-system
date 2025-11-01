import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import './AIRecommendations.css';

const AIRecommendations = ({ 
  userProfile = {}, 
  maxRecommendations = 6,
  showFilters = true,
  title = "AI-Powered Recommendations for You" 
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userType: userProfile.userType || 'solo_traveler',
    season: userProfile.season || getCurrentSeason(),
    dayType: userProfile.dayType || 'weekday',
    bookingAdvance: userProfile.bookingAdvance || 7,
    stayDuration: userProfile.stayDuration || 2,
    groupSize: userProfile.groupSize || 2,
    ...userProfile
  });
  const [aiPowered, setAiPowered] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/recommendations/rooms?${params.toString()}`);
      
      setRecommendations(response.data.recommendations.slice(0, maxRecommendations));
      setAiPowered(response.data.aiPowered);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const trackInteraction = async (roomId, interactionType, metadata = {}) => {
    if (!user) return;
    
    try {
      await axios.post('/api/recommendations/interaction', {
        roomId,
        interactionType,
        metadata
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handleRoomClick = (room) => {
    trackInteraction(room.roomId, 'click', {
      compatibilityScore: room.compatibilityScore,
      bookingProbability: room.bookingProbability
    });
  };

  const handleRoomView = (room) => {
    trackInteraction(room.roomId, 'view', {
      viewDuration: Math.floor(Math.random() * 60) + 30 // Simulated view duration
    });
  };

  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#28a745';
    if (confidence >= 0.6) return '#ffc107';
    return '#dc3545';
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return '#28a745';
    if (score >= 0.6) return '#17a2b8';
    if (score >= 0.4) return '#ffc107';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="ai-recommendations">
        <div className="recommendations-header">
          <h2>{title}</h2>
          <div className="ai-badge">
            <span className="ai-icon">🤖</span>
            AI Powered
          </div>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <h2>{title}</h2>
        <div className={`ai-badge ${aiPowered ? 'active' : 'fallback'}`}>
          <span className="ai-icon">{aiPowered ? '🤖' : '📋'}</span>
          {aiPowered ? 'AI Powered' : 'Rule-Based'}
        </div>
      </div>

      {showFilters && (
        <div className="recommendation-filters">
          <div className="filter-group">
            <label>Travel Type</label>
            <select
              value={filters.userType}
              onChange={(e) => handleFilterChange('userType', e.target.value)}
            >
              <option value="business_traveler">Business Travel</option>
              <option value="family_vacation">Family Vacation</option>
              <option value="couple_romantic">Romantic Getaway</option>
              <option value="solo_traveler">Solo Travel</option>
              <option value="group_friends">Friends Group</option>
              <option value="luxury_seeker">Luxury Experience</option>
              <option value="budget_conscious">Budget Friendly</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Season</label>
            <select
              value={filters.season}
              onChange={(e) => handleFilterChange('season', e.target.value)}
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Group Size</label>
            <select
              value={filters.groupSize}
              onChange={(e) => handleFilterChange('groupSize', parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Stay Duration</label>
            <select
              value={filters.stayDuration}
              onChange={(e) => handleFilterChange('stayDuration', parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(nights => (
                <option key={nights} value={nights}>{nights} {nights === 1 ? 'night' : 'nights'}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <h3>No recommendations available</h3>
          <p>Try adjusting your preferences to see personalized suggestions.</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((room, index) => (
            <div 
              key={room.roomId || index} 
              className="recommendation-card"
              onMouseEnter={() => handleRoomView(room)}
            >
              <div className="card-image">
                <img 
                  src={room.images?.[0] || 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Room'} 
                  alt={room.title || room.roomType} 
                />
                <div className="recommendation-badges">
                  <div 
                    className="confidence-badge"
                    style={{ backgroundColor: getConfidenceColor(room.confidence) }}
                  >
                    {Math.round(room.confidence * 100)}% Match
                  </div>
                  {room.predictedRating >= 4.0 && (
                    <div className="rating-badge">
                      ⭐ {room.predictedRating.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{room.title || room.roomType}</h3>
                <p className="hotel-info">
                  📍 {room.location}
                </p>

                <div className="ai-scores">
                  <div className="score-item">
                    <span className="score-label">Compatibility</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${room.compatibilityScore * 100}%`,
                          backgroundColor: getScoreColor(room.compatibilityScore)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{Math.round(room.compatibilityScore * 100)}%</span>
                  </div>

                  <div className="score-item">
                    <span className="score-label">Booking Likelihood</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${room.bookingProbability * 100}%`,
                          backgroundColor: getScoreColor(room.bookingProbability)
                        }}
                      ></div>
                    </div>
                    <span className="score-value">{Math.round(room.bookingProbability * 100)}%</span>
                  </div>
                </div>

                <p className="recommendation-reason">
                  💡 {room.recommendationReason}
                </p>

                <div className="room-details">
                  <span className="detail">👥 {room.capacity} guests</span>
                  <span className="detail">📐 {room.size}</span>
                  <span className="detail">🛏️ {room.bedType}</span>
                </div>

                <div className="price-section">
                  <span className="price">${room.pricePerNight}/night</span>
                  {room.bookingProbability > 0.8 && (
                    <span className="demand-indicator">🔥 High Demand</span>
                  )}
                </div>

                <div className="card-actions">
                  <Link 
                    to={`/rooms/${room.roomId}`}
                    className="btn btn-primary"
                    onClick={() => handleRoomClick(room)}
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aiPowered && (
        <div className="ai-disclaimer">
          <p>
            🤖 Recommendations powered by machine learning based on user preferences and booking patterns.
            Results are personalized and continuously improved.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
