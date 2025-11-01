import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SmartRoomFinder.css';

const SmartRoomFinder = () => {
    const [step, setStep] = useState('filters'); // filters, results
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    const [filters, setFilters] = useState({
        userType: 'solo_traveler',
        season: getCurrentSeason(),
        dayType: 'weekday',
        bookingAdvance: 7,
        stayDuration: 2,
        groupSize: 2,
        minPrice: '',
        maxPrice: '',
        checkIn: '',
        checkOut: ''
    });

    const [sortBy, setSortBy] = useState('match'); // match, price, rating

    function getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    }

    useEffect(() => {
        if (step === 'results') {
            fetchRecommendations();
        }
    }, [step, sortBy]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters);
            const response = await axios.get(`/api/recommendations/rooms?${params.toString()}`);

            let results = response.data.recommendations || [];

            // Sort results
            if (sortBy === 'price') {
                results.sort((a, b) => a.pricePerNight - b.pricePerNight);
            } else if (sortBy === 'rating') {
                results.sort((a, b) => b.predictedRating - a.predictedRating);
            } else {
                results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            }

            setRecommendations(results);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleFindRooms = () => {
        setStep('results');
    };

    const toggleCompare = (room) => {
        if (compareList.find(r => r.roomId === room.roomId)) {
            setCompareList(compareList.filter(r => r.roomId !== room.roomId));
        } else if (compareList.length < 3) {
            setCompareList([...compareList, room]);
        }
    };

    const getMatchColor = (score) => {
        if (score >= 0.8) return '#10b981';
        if (score >= 0.6) return '#3b82f6';
        if (score >= 0.4) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="smart-room-finder">
            {/* Hero Section */}
            <div className="finder-hero">
                <div className="hero-decoration">
                    <div className="float-element float-1"></div>
                    <div className="float-element float-2"></div>
                    <div className="float-element float-3"></div>
                    <div className="float-element float-4"></div>
                </div>
                <div className="container">
                    <div className="hero-logo">
                        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="32" fill="url(#gradient)" />
                            <circle cx="32" cy="32" r="30" fill="url(#innerGradient)" opacity="0.3" />
                            <path d="M32 20 L38 26 L32 32 L26 26 Z" fill="white" />
                            <circle cx="32" cy="38" r="6" fill="white" opacity="0.9" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#357ABD', stopOpacity: 1 }} />
                                </linearGradient>
                                <radialGradient id="innerGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
                                    <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="hero-title">Find Your Perfect Room with AI</h1>
                    <p className="hero-subtitle">Answer a few questions, get personalized recommendations powered by machine learning</p>

                    {/* Trust Signals */}
                    <div className="trust-signals">
                        <div className="trust-item">
                            <span className="trust-number">1,234+</span>
                            <span className="trust-label">Guests Found Perfect Rooms</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-number">92%</span>
                            <span className="trust-label">AI Accuracy</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-number">4.8/5</span>
                            <span className="trust-label">Average Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="finder-content">
                <div className="container">
                    {step === 'filters' && (
                        <div className="filters-section">
                            <h2 className="section-title">Tell Us About Your Stay</h2>

                            <div className="filters-grid">
                                {/* Travel Type */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">👤</span>
                                        Travel Type
                                    </label>
                                    <select
                                        value={filters.userType}
                                        onChange={(e) => handleFilterChange('userType', e.target.value)}
                                        className="filter-select"
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

                                {/* Group Size */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">👥</span>
                                        Group Size
                                    </label>
                                    <select
                                        value={filters.groupSize}
                                        onChange={(e) => handleFilterChange('groupSize', parseInt(e.target.value))}
                                        className="filter-select"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                                            <option key={size} value={size}>
                                                {size} {size === 1 ? 'person' : 'people'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stay Duration */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">🌙</span>
                                        Stay Duration
                                    </label>
                                    <select
                                        value={filters.stayDuration}
                                        onChange={(e) => handleFilterChange('stayDuration', parseInt(e.target.value))}
                                        className="filter-select"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(nights => (
                                            <option key={nights} value={nights}>
                                                {nights} {nights === 1 ? 'night' : 'nights'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Season */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">🌤️</span>
                                        Season
                                    </label>
                                    <select
                                        value={filters.season}
                                        onChange={(e) => handleFilterChange('season', e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="spring">Spring</option>
                                        <option value="summer">Summer</option>
                                        <option value="fall">Fall</option>
                                        <option value="winter">Winter</option>
                                    </select>
                                </div>

                                {/* Budget Range */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">💰</span>
                                        Budget Range
                                    </label>
                                    <div className="price-range">
                                        <input
                                            type="number"
                                            placeholder="Min $"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            className="filter-input"
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max $"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            className="filter-input"
                                        />
                                    </div>
                                </div>

                                {/* Dates (Optional) */}
                                <div className="filter-card">
                                    <label className="filter-label">
                                        <span className="label-icon">📅</span>
                                        Dates (Optional)
                                    </label>
                                    <div className="date-range">
                                        <input
                                            type="date"
                                            value={filters.checkIn}
                                            onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                                            className="filter-input"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <input
                                            type="date"
                                            value={filters.checkOut}
                                            onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                                            className="filter-input"
                                            min={filters.checkIn || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleFindRooms} className="btn btn-primary btn-large find-btn">
                                🤖 Find My Perfect Room
                            </button>
                        </div>
                    )}

                    {step === 'results' && (
                        <div className="results-section">
                            <div className="results-header">
                                <div className="results-info">
                                    <button onClick={() => setStep('filters')} className="back-btn">
                                        ← Back to Filters
                                    </button>
                                    <h2>{recommendations.length} AI-Matched Rooms Found</h2>
                                    <p>Sorted by best match for your preferences</p>
                                </div>

                                <div className="results-controls">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="match">Best Match</option>
                                        <option value="price">Lowest Price</option>
                                        <option value="rating">Highest Rating</option>
                                    </select>

                                    {compareList.length > 0 && (
                                        <button
                                            onClick={() => setShowComparison(!showComparison)}
                                            className="btn btn-secondary"
                                        >
                                            Compare ({compareList.length})
                                        </button>
                                    )}
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">
                                    <div className="spinner"></div>
                                    <p>AI is analyzing your preferences...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="recommendations-grid">
                                        {recommendations.map((room, index) => (
                                            <div key={room.roomId} className="recommendation-card">
                                                <div className="card-image">
                                                    <img src={room.images?.[0] || 'https://via.placeholder.com/400x300'} alt={room.title} />
                                                    <div className="match-badge" style={{ backgroundColor: getMatchColor(room.compatibilityScore) }}>
                                                        {Math.round(room.compatibilityScore * 100)}% Match
                                                    </div>
                                                    {index < 3 && <div className="top-pick-badge">Top Pick #{index + 1}</div>}
                                                </div>

                                                <div className="card-content">
                                                    <h3>{room.title || room.roomType}</h3>
                                                    <p className="room-location">📍 {room.location}</p>

                                                    <div className="why-recommended">
                                                        <h4>Why We Recommend This:</h4>
                                                        <p>{room.recommendationReason}</p>
                                                    </div>

                                                    <div className="room-stats">
                                                        <div className="stat">
                                                            <span className="stat-label">Booking Likelihood</span>
                                                            <div className="stat-bar">
                                                                <div
                                                                    className="stat-fill"
                                                                    style={{
                                                                        width: `${room.bookingProbability * 100}%`,
                                                                        backgroundColor: getMatchColor(room.bookingProbability)
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="stat-value">{Math.round(room.bookingProbability * 100)}%</span>
                                                        </div>
                                                    </div>

                                                    <div className="room-details">
                                                        <span>👥 {room.capacity} guests</span>
                                                        <span>📐 {room.size}</span>
                                                        <span>🛏️ {room.bedType}</span>
                                                    </div>

                                                    <div className="card-footer">
                                                        <div className="price">
                                                            <span className="price-amount">${room.pricePerNight}</span>
                                                            <span className="price-label">/night</span>
                                                        </div>
                                                        <div className="card-actions">
                                                            <button
                                                                onClick={() => toggleCompare(room)}
                                                                className={`btn btn-secondary btn-small ${compareList.find(r => r.roomId === room.roomId) ? 'active' : ''}`}
                                                                disabled={compareList.length >= 3 && !compareList.find(r => r.roomId === room.roomId)}
                                                            >
                                                                {compareList.find(r => r.roomId === room.roomId) ? '✓ Added' : 'Compare'}
                                                            </button>
                                                            <Link to={`/rooms/${room.roomId}`} className="btn btn-primary btn-small">
                                                                View & Book
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty State */}
                                    {recommendations.length === 0 && (
                                        <div className="empty-state">
                                            <div className="empty-icon">🔍</div>
                                            <h3>No rooms match your preferences</h3>
                                            <p>Try adjusting your filters or budget range to see more options</p>
                                            <button
                                                onClick={() => setStep('filters')}
                                                className="btn btn-primary"
                                            >
                                                Modify Filters
                                            </button>
                                        </div>
                                    )}

                                    {/* Comparison Modal */}
                                    {showComparison && compareList.length > 0 && (
                                        <div className="comparison-modal">
                                            <div className="modal-overlay" onClick={() => setShowComparison(false)}></div>
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h2>Compare Rooms</h2>
                                                    <button onClick={() => setShowComparison(false)} className="close-btn">✕</button>
                                                </div>
                                                <div className="comparison-grid">
                                                    {compareList.map(room => (
                                                        <div key={room.roomId} className="comparison-card">
                                                            <img src={room.images?.[0]} alt={room.title} />
                                                            <h3>{room.title}</h3>
                                                            <div className="comparison-details">
                                                                <div className="detail-row">
                                                                    <span>Match Score:</span>
                                                                    <strong>{Math.round(room.compatibilityScore * 100)}%</strong>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span>Price:</span>
                                                                    <strong>${room.pricePerNight}/night</strong>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span>Capacity:</span>
                                                                    <strong>{room.capacity} guests</strong>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span>Size:</span>
                                                                    <strong>{room.size}</strong>
                                                                </div>
                                                                <div className="detail-row">
                                                                    <span>Bed Type:</span>
                                                                    <strong>{room.bedType}</strong>
                                                                </div>
                                                            </div>
                                                            <Link to={`/rooms/${room.roomId}`} className="btn btn-primary">
                                                                Book This Room
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartRoomFinder;
