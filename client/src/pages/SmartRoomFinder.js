import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './SmartRoomFinder.css';

const SmartRoomFinder = () => {
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    
    // Voice Assistant States
    const [voiceMode, setVoiceMode] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceMuted, setVoiceMuted] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [tempInputValue, setTempInputValue] = useState('');
    const synthRef = useRef(window.speechSynthesis);
    const hasGreetedRef = useRef(false);

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

    const [sortBy, setSortBy] = useState('match');

    function getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    }

    // Voice Assistant Questions
    const questions = [
        {
            key: 'userType',
            text: 'What type of traveler are you?',
            options: [
                { 
                    value: 'business_traveler', 
                    label: 'Business Travel', 
                    keywords: ['business', 'work', 'corporate', 'office', 'meeting', 'conference', 'professional', 'biz', 'bizness', 'busines', 'buisness', 'working', 'job']
                },
                { 
                    value: 'family_vacation', 
                    label: 'Family Vacation', 
                    keywords: ['family', 'kids', 'children', 'parents', 'relatives', 'vacation', 'holiday', 'fam', 'famly', 'familly', 'child', 'kid']
                },
                { 
                    value: 'couple_romantic', 
                    label: 'Romantic Getaway', 
                    keywords: ['couple', 'romantic', 'honeymoon', 'romance', 'partner', 'spouse', 'wife', 'husband', 'cupl', 'copl', 'romant', 'romanc', 'honeymon']
                },
                { 
                    value: 'solo_traveler', 
                    label: 'Solo Travel', 
                    keywords: ['solo', 'alone', 'single', 'myself', 'individual', 'one', 'slo', 'sola', 'alon', 'singl']
                },
                { 
                    value: 'group_friends', 
                    label: 'Friends Group', 
                    keywords: ['friends', 'group', 'party', 'buddies', 'mates', 'frends', 'frenz', 'freind', 'friend', 'grup', 'grp']
                },
                { 
                    value: 'luxury_seeker', 
                    label: 'Luxury Experience', 
                    keywords: ['luxury', 'premium', 'deluxe', 'expensive', 'fancy', 'high end', 'luxry', 'lux', 'luxuri', 'premum', 'delux']
                },
                { 
                    value: 'budget_conscious', 
                    label: 'Budget Friendly', 
                    keywords: ['budget', 'cheap', 'affordable', 'economical', 'low cost', 'inexpensive', 'budgt', 'buget', 'budjet', 'cheep', 'afordable']
                }
            ]
        },
        {
            key: 'groupSize',
            text: 'How many guests will be staying with you?',
            type: 'number',
            min: 1,
            max: 8
        },
        {
            key: 'stayDuration',
            text: 'How many nights will you be staying?',
            type: 'number',
            min: 1,
            max: 30
        },
        {
            key: 'season',
            text: 'Which season are you planning to visit?',
            options: [
                { 
                    value: 'spring', 
                    label: 'Spring', 
                    keywords: ['spring', 'march', 'april', 'may', 'springtime', 'spring time', 'early spring', 'late spring', 'spring season']
                },
                { 
                    value: 'summer', 
                    label: 'Summer', 
                    keywords: ['summer', 'june', 'july', 'august', 'summertime', 'summer time', 'hot season', 'warm season', 'peak summer', 'mid summer', 'summer vacation', 'summer holidays']
                },
                { 
                    value: 'fall', 
                    label: 'Fall', 
                    keywords: ['fall', 'autumn', 'september', 'october', 'november', 'fall season', 'autumn season', 'early fall', 'late fall', 'mid autumn']
                },
                { 
                    value: 'winter', 
                    label: 'Winter', 
                    keywords: ['winter', 'december', 'january', 'february', 'wintertime', 'winter time', 'cold season', 'winter season', 'early winter', 'late winter', 'mid winter', 'winter holidays', 'christmas', 'new year']
                }
            ]
        },
        {
            key: 'maxPrice',
            text: 'What is your maximum budget per night in Pakistani Rupees?',
            type: 'number',
            min: 2000,
            max: 40000
        }
    ];

    // Voice Functions - Speaking only (no microphone)
    const speak = (text) => {
        console.log('Speak called:', text);
        
        if (voiceMuted) return;
        
        // Cancel any ongoing speech and wait before starting new one
        synthRef.current.cancel();
        
        // Wait a bit to avoid interruption error
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onstart = () => {
                console.log('✓ Speech started');
                setIsSpeaking(true);
            };
            
            utterance.onend = () => {
                console.log('✓ Speech ended');
                setIsSpeaking(false);
            };
            
            utterance.onerror = (error) => {
                console.error('✗ Speech error:', error);
                setIsSpeaking(false);
            };
            
            synthRef.current.speak(utterance);
        }, 200);
    };



    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            const nextQ = currentQuestion + 1;
            setCurrentQuestion(nextQ);
            setTempInputValue(''); // Clear input for next question
            
            // Reduced delay for second question (moving from 0 to 1)
            const delay = currentQuestion === 0 ? 1500 : 1000;
            
            setTimeout(() => {
                const questionText = questions[nextQ].text;
                console.log('Speaking question:', questionText);
                speak(questionText);
            }, delay);
        } else {
            completeVoiceMode();
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            const prevQ = currentQuestion - 1;
            setCurrentQuestion(prevQ);
            setTimeout(() => {
                speak(questions[prevQ].text);
            }, 500);
        }
    };

    const completeVoiceMode = () => {
        speak('Great! These are the perfect rooms for you.');
        
        localStorage.setItem('roomFinderPreferences', JSON.stringify({
            userType: filters.userType,
            groupSize: filters.groupSize,
            stayDuration: filters.stayDuration,
            season: filters.season,
            maxPrice: filters.maxPrice
        }));
        
        setTimeout(() => {
            setVoiceMode(false);
            fetchRecommendations();
            
            setTimeout(() => {
                document.querySelector('.results-section')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 500);
        }, 3000);
    };

    const startVoiceMode = () => {
        setVoiceMode(true);
        setCurrentQuestion(0);
        setIsSpeaking(false);
        
        // Speak welcome message instantly
        if (isFirstVisit) {
            speak(questions[0].text);
        } else {
            speak('Welcome back! Would you like to use your previous preferences or start fresh?');
        }
    };

    const usePreviousPreferences = () => {
        // Speak instantly
        speak('Using your previous preferences. Finding rooms for you now.');
        setTimeout(() => {
            setVoiceMode(false);
            fetchRecommendations();
        }, 3000);
    };

    const startFresh = () => {
        synthRef.current.cancel();
        setIsFirstVisit(true);
        setCurrentQuestion(0);
        
        // Speak the first question instantly
        speak(questions[0].text);
    };

    const handleManualSelect = (value) => {
        const question = questions[currentQuestion];
        setFilters(prev => ({ ...prev, [question.key]: value }));
        
        const option = question.options?.find(opt => opt.value === value);
        const label = option ? option.label : value;
        
        speak(`${label}.`);
        
        // Longer delay for budget question to let speech complete
        const delay = currentQuestion === questions.length - 1 ? 3000 : 1200;
        setTimeout(() => nextQuestion(), delay);
    };

    // Fetch Recommendations
    const fetchRecommendations = async () => {
        try {
            setLoading(true);

            const aiResponse = await fetch('http://localhost:5002/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userType: filters.userType || 'solo_traveler',
                    season: filters.season || 'summer',
                    dayType: filters.dayType || 'weekday',
                    bookingAdvance: parseInt(filters.bookingAdvance) || 7,
                    stayDuration: parseInt(filters.stayDuration) || 2,
                    groupSize: parseInt(filters.groupSize) || 2,
                    budget: parseInt(filters.maxPrice) || 10000,
                    viewTime: 120,
                    previousBookings: 0
                })
            });

            const aiData = await aiResponse.json();

            if (!aiResponse.ok || !aiData.recommendations) {
                console.error('AI API Error:', aiData);
                throw new Error(aiData.error || 'AI recommendation failed');
            }

            const roomsResponse = await axios.get('/api/rooms');
            const allRooms = roomsResponse.data;

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

            let results = aiData.recommendations.map(aiRec => {
                const expectedType = roomTypeMap[aiRec.roomType] || aiRec.roomType;
                const matchingRoom = allRooms.find(room =>
                    room.type === expectedType ||
                    room.type === aiRec.roomType ||
                    room.type.includes(aiRec.roomType)
                );

                if (matchingRoom) {
                    return {
                        ...matchingRoom,
                        compatibilityScore: aiRec.compatibilityScore || 0,
                        bookingProbability: aiRec.bookingLikelihood || 0,
                        overallScore: aiRec.overallScore || 0,
                        isHighMatch: aiRec.isHighMatch || false,
                        recommendationReason: aiRec.recommendation || 'Recommended for you',
                        roomType: aiRec.roomType
                    };
                }
                return null;
            }).filter(Boolean);

            if (filters.minPrice) {
                results = results.filter(r => r.pricePerNight >= parseFloat(filters.minPrice));
            }
            if (filters.maxPrice) {
                results = results.filter(r => r.pricePerNight <= parseFloat(filters.maxPrice));
            }

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
            try {
                const roomsResponse = await axios.get('/api/rooms');
                const fallbackRooms = roomsResponse.data.slice(0, 10).map(room => ({
                    ...room,
                    compatibilityScore: 75,
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

    // Effects
    useEffect(() => {
        const savedPreferences = localStorage.getItem('roomFinderPreferences');
        
        if (savedPreferences) {
            setIsFirstVisit(false);
            const saved = JSON.parse(savedPreferences);
            setFilters(prev => ({ ...prev, ...saved }));
        }
        
        // Welcome voice message when page loads - no delay
        if (!hasGreetedRef.current) {
            hasGreetedRef.current = true;
            const welcomeText = 'Welcome to Hotelogix AI Room Finder!';
            const utterance = new SpeechSynthesisUtterance(welcomeText);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            synthRef.current.speak(utterance);
        }
        
        // Don't auto-load on mount - user must click "Find Perfect Rooms"
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (recommendations.length > 0) {
            let sorted = [...recommendations];
            if (sortBy === 'price') {
                sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
            } else if (sortBy === 'rating') {
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            } else {
                sorted.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            }
            setRecommendations(sorted);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleFindRooms = () => {
        fetchRecommendations();
    };

    const getMatchColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#3b82f6';
        if (score >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="smart-room-finder">
            {/* Hero Section */}
            <div className="finder-hero">
                <div className="container">
                    <h1 className="hero-title">Find Your Perfect Room with AI</h1>
                    <p className="hero-subtitle">Answer a few questions, get personalized recommendations powered by machine learning</p>

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

                    <div className="mode-selection">
                        <button onClick={startVoiceMode} className="btn btn-outline btn-large mode-btn">
                            <i className="fas fa-microphone"></i> Use Voice Assistant
                        </button>
                    </div>
                </div>
            </div>

            {/* Voice Assistant Modal */}
            {voiceMode && (
                <div className="voice-modal-overlay">
                    <div className="voice-modal">
                        <button className="voice-close-btn" onClick={() => setVoiceMode(false)}>
                            <i className="fas fa-times"></i>
                        </button>

                        {!isFirstVisit && currentQuestion === 0 && (
                            <div className="returning-user-options">
                                <button onClick={usePreviousPreferences} className="btn btn-gold">
                                    Use Previous Preferences
                                </button>
                                <button onClick={startFresh} className="btn btn-outline">
                                    Start Fresh
                                </button>
                            </div>
                        )}

                        {(isFirstVisit || currentQuestion > 0) && (
                            <>
                                <div className="voice-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </span>
                                </div>

                                <div className="voice-question">
                                    <h3>{questions[currentQuestion].text}</h3>
                                </div>

                                <div className="voice-controls">
                                    <button 
                                        className="mute-btn"
                                        onClick={() => setVoiceMuted(!voiceMuted)}
                                    >
                                        <i className={`fas fa-volume-${voiceMuted ? 'mute' : 'up'}`}></i>
                                        <span>{voiceMuted ? 'Unmute Voice' : 'Mute Voice'}</span>
                                    </button>
                                </div>

                                <div className="manual-options">
                                    <p className="or-divider">Select your answer:</p>
                                    
                                    {questions[currentQuestion].options ? (
                                        <div className="option-grid">
                                            {questions[currentQuestion].options.map(option => (
                                                <button
                                                    key={option.value}
                                                    className="option-btn"
                                                    onClick={() => handleManualSelect(option.value)}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="number-input-group">
                                            <input
                                                type="number"
                                                min={questions[currentQuestion].min}
                                                max={questions[currentQuestion].max}
                                                value={tempInputValue}
                                                onChange={(e) => {
                                                    setTempInputValue(e.target.value);
                                                    setFilters(prev => ({ 
                                                        ...prev, 
                                                        [questions[currentQuestion].key]: e.target.value 
                                                    }));
                                                }}
                                                placeholder={`Enter ${questions[currentQuestion].min}-${questions[currentQuestion].max}`}
                                                className="number-input"
                                            />
                                            <button 
                                                className="btn btn-gold"
                                                onClick={() => {
                                                    const value = tempInputValue || filters[questions[currentQuestion].key];
                                                    if (value) {
                                                        handleManualSelect(parseInt(value));
                                                        setTempInputValue('');
                                                    }
                                                }}
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="voice-navigation">
                                    <button 
                                        className="nav-btn"
                                        onClick={previousQuestion}
                                        disabled={currentQuestion === 0}
                                    >
                                        <i className="fas fa-arrow-left"></i> Previous
                                    </button>
                                    <button 
                                        className="nav-btn"
                                        onClick={nextQuestion}
                                    >
                                        Next <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Manual Filters Section - Always Visible */}
            <div className="filters-section">
                <div className="container">
                    <div className="filters-header">
                        <h2>Customize Your Search</h2>
                        <button onClick={startVoiceMode} className="btn btn-gold btn-small">
                            <i className="fas fa-microphone"></i> Voice Assistant
                        </button>
                    </div>

                        <div className="filters-grid">
                            <div className="filter-group">
                                <label>Traveler Type</label>
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
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="8" 
                                    value={filters.groupSize} 
                                    onChange={(e) => handleFilterChange('groupSize', e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label>Stay Duration (nights)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="30" 
                                    value={filters.stayDuration} 
                                    onChange={(e) => handleFilterChange('stayDuration', e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label>Max Price (PKR)</label>
                                <input 
                                    type="number" 
                                    min="2000" 
                                    max="40000" 
                                    value={filters.maxPrice} 
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="Enter max budget"
                                />
                            </div>
                        </div>

                    <button className="btn btn-gold btn-large" onClick={handleFindRooms}>
                        <i className="fas fa-search"></i> Find Perfect Rooms
                    </button>
                </div>
            </div>

            {/* Results Section */}
            <div className="results-section">
                <div className="container">
                    <div className="results-header">
                        <h2>
                            {recommendations.length > 0 
                                ? `${recommendations.length} Perfect Matches Found` 
                                : 'Finding Your Perfect Room...'}
                        </h2>
                        
                        {recommendations.length > 0 && (
                            <div className="sort-controls">
                                <label>Sort by:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="match">Best Match</option>
                                    <option value="price">Price (Low to High)</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <Loading />
                    ) : recommendations.length === 0 ? (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <p>No rooms match your criteria. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="recommendations-grid">
                            {recommendations.map((room, index) => (
                                <div key={room.id} className="recommendation-card">
                                    {room.isHighMatch && index === 0 && (
                                        <div className="top-pick-badge">
                                            <i className="fas fa-crown"></i> TOP PICK
                                        </div>
                                    )}

                                    <div className="room-image-container">
                                        <img 
                                            src={room.images?.[0] || '/placeholder-room.jpg'} 
                                            alt={room.type}
                                            className="room-image"
                                        />
                                        <div className="match-badge" style={{ backgroundColor: getMatchColor(room.compatibilityScore) }}>
                                            {Math.round(room.compatibilityScore)}% Match
                                        </div>
                                    </div>

                                    <div className="room-details">
                                        <h3>{room.type}</h3>
                                        <p className="room-description">{room.description}</p>

                                        <div className="room-features">
                                            <span><i className="fas fa-users"></i> {room.capacity} Guests</span>
                                            <span><i className="fas fa-bed"></i> {room.beds} Beds</span>
                                            <span><i className="fas fa-star"></i> {room.rating || 4.5}/5</span>
                                        </div>

                                        <div className="ai-insights">
                                            <div className="insight-item">
                                                <span className="insight-label">Compatibility:</span>
                                                <div className="insight-bar">
                                                    <div 
                                                        className="insight-fill" 
                                                        style={{ 
                                                            width: `${room.compatibilityScore}%`,
                                                            backgroundColor: getMatchColor(room.compatibilityScore)
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="insight-value">{Math.round(room.compatibilityScore)}%</span>
                                            </div>

                                            <div className="insight-item">
                                                <span className="insight-label">Booking Likelihood:</span>
                                                <div className="insight-bar">
                                                    <div 
                                                        className="insight-fill" 
                                                        style={{ 
                                                            width: `${room.bookingProbability}%`,
                                                            backgroundColor: '#3b82f6'
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="insight-value">{Math.round(room.bookingProbability)}%</span>
                                            </div>
                                        </div>

                                        <p className="recommendation-reason">
                                            <i className="fas fa-lightbulb"></i> {room.recommendationReason}
                                        </p>

                                        <div className="room-footer">
                                            <div className="price-info">
                                                <span className="price">PKR {room.pricePerNight?.toLocaleString()}</span>
                                                <span className="price-label">per night</span>
                                            </div>
                                            <Link to={`/rooms/${room.id}`} className="btn btn-gold">
                                                View Details <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartRoomFinder;
