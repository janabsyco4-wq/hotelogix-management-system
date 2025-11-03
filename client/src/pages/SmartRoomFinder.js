
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './SmartRoomFinder.css';

const SmartRoomFinder = () => {
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    const [filters, setFilters] = useState({
        userType: 'solo_traveler',
        season: getCurrentSeason(),
        dayType: 'weekday',
        bookingAdvance: 7,
        stayDuration: 2,
        groupSize: 2,
        minPrice: '',
        maxPrice: ''
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
        // Load recommendations on mount
        fetchRecommendations();
    }, []);

    useEffect(() => {
        // Re-sort when sortBy changes
        if (recommendations.length > 0) {
            sortRecommendations();
        }
    }, [sortBy]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);

            // Call Python AI API for recommendations
            const aiResponse = await fetch('http://localhost:5002/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userType: filters.userType,
                    season: filters.season,
                    dayType: filters.dayType,
                    bookingAdvance: filters.bookingAdvance,
                    stayDuration: filters.stayDuration,
                    groupSize: filters.groupSize,
                    budget: filters.maxPrice || 200,
                    viewTime: 120,
                    previousBookings: 0
                })
            });

            const aiData = await aiResponse.json();

            // Check if AI API returned an error
            if (!aiResponse.ok || !aiData.recommendations) {
                console.error('AI API Error:', aiData);
                throw new Error(aiData.error || 'AI recommendation failed');
            }

            // Get actual room data from backend
            const roomsResponse = await axios.get('/api/rooms');
            const allRooms = roomsResponse.data;

            // Match AI recommendations with actual rooms
            let results = aiData.recommendations.map(aiRec => {
                // Map AI room types to database room types (Pakistan - 10 types)
                const roomTypeMap = {
                    'Budget': 'Budget Room',
                    'Economy': 'Economy Room',
                    'Standard': 'Standard Room',
                    'Business': 'Business Room',
                    'Deluxe': 'Deluxe Room',
                    'Junior Suite': 'Junior Suite',
                    'Executive Suite': 'Executive Suite',
                    'Family Suite': 'Family Suite',
                    'Presidential Suite': 'Presidential Suite',
                    'Royal': 'Royal Suite'
                };

                const expectedType = roomTypeMap[aiRec.roomType] || aiRec.roomType;
                const matchingRoom = allRooms.find(room =>
                    room.type === expectedType ||
                    room.type === aiRec.roomType ||
                    room.type.includes(aiRec.roomType)
                );

                if (matchingRoom) {
                    return {
                        ...matchingRoom,
                        compatibilityScore: aiRec.compatibilityScore || 0, // Already 0-100
                        bookingProbability: aiRec.bookingLikelihood || 0, // Already 0-100
                        overallScore: aiRec.overallScore || 0,
                        isHighMatch: aiRec.isHighMatch || false,
                        recommendationReason: aiRec.recommendation || 'Recommended for you',
                        roomType: aiRec.roomType
                    };
                }
                return null;
            }).filter(Boolean);

            // Apply price filter if set
            if (filters.minPrice) {
                results = results.filter(r => r.pricePerNight >= parseFloat(filters.minPrice));
            }
            if (filters.maxPrice) {
                results = results.filter(r => r.pricePerNight <= parseFloat(filters.maxPrice));
            }

            // Sort results
            if (sortBy === 'price') {
                results.sort((a, b) => a.pricePerNight - b.pricePerNight);
            } else if (sortBy === 'rating') {
                results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else {
                results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            }

            setRecommendations(results);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            // Fallback to regular rooms if AI fails
            try {
                const roomsResponse = await axios.get('/api/rooms');
                const fallbackRooms = roomsResponse.data.slice(0, 10).map(room => ({
                    ...room,
                    compatibilityScore: 75, // Default score
                    bookingProbability: 60,
                    overallScore: 70,
                    isHighMatch: true,
                    recommendationReason: 'Popular choice'
                }));
                setRecommendations(fallbackRooms);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setRecommendations([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleFindRooms = () => {
        fetchRecommendations();
        setShowFilters(false); // Collapse filters after search
    };

    const sortRecommendations = () => {
        let sorted = [...recommendations];
        if (sortBy === 'price') {
            sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (sortBy === 'rating') {
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else {
            sorted.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        }
        setRecommendations(sorted);
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
                            <span className="trust-number">5,000+</span>
                            <span className="trust-label">Happy Guests</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-number">95%</span>
                            <span className="trust-label">Match Accuracy</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-number">4.9★</span>
                            <span className="trust-label">User Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="finder-content">
                <div className="container">
                    {/* Filters Section - Always visible, collapsible */}
                    <div className={`filters-section ${showFilters ? 'expanded' : 'collapsed'}`}>
                        <div className="filters-header" onClick={() => setShowFilters(!showFilters)}>
                            <h2 className="section-title">
                                {showFilters ? '🔽' : '▶️'} Adjust Your Preferences
                            </h2>
                            <button className="toggle-filters-btn">
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="filters-content">
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
                                                placeholder="Min PKR"
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                className="filter-input"
                                            />
                                            <span>-</span>
                                            <input
                                                type="number"
                                                placeholder="Max PKR"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                className="filter-input"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <button onClick={handleFindRooms} className="btn btn-primary btn-large find-btn">
                                    🤖 Update Recommendations
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results Section - Always visible below filters */}
                    <div className="results-section">
                        <div className="results-header">
                            <div className="results-info">
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
                            </div>
                        </div>

                        {loading ? (
                            <Loading message="AI is analyzing your preferences..." />
                        ) : (
                            <>
                                <div className="recommendations-grid">
                                    {recommendations.map((room, index) => (
                                        <div key={room.id} className="recommendation-card">
                                            <div className="card-image">
                                                <img src={room.images?.[0] || 'https://via.placeholder.com/400x300'} alt={room.title} />
                                                <div className="match-badge" style={{ backgroundColor: getMatchColor(room.compatibilityScore / 100) }}>
                                                    {Math.round(room.compatibilityScore)}% Match
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
                                                                    width: `${room.bookingProbability}%`,
                                                                    backgroundColor: getMatchColor(room.bookingProbability / 100)
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="stat-value">{Math.round(room.bookingProbability)}%</span>
                                                    </div>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="price">
                                                        <span className="price-amount">₨{room.pricePerNight?.toLocaleString('en-PK')}</span>
                                                        <span className="price-label">/night</span>
                                                    </div>
                                                    <div className="card-actions">
                                                        <Link to={`/rooms/${room.id}`} className="btn btn-primary btn-large">
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
                                        <p>Try adjusting your filters above to see more options</p>
                                        <button
                                            onClick={() => setShowFilters(true)}
                                            className="btn btn-primary"
                                        >
                                            Adjust Filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartRoomFinder;
