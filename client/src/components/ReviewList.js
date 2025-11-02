import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './ReviewList.css';

const ReviewList = ({ roomId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [roomId, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('sortBy', sortBy);
      if (filterRating) params.append('rating', filterRating);

      const response = await axios.get(`/api/reviews/room/${roomId}?${params.toString()}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId, helpful) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to mark reviews as helpful');
        return;
      }

      await axios.post(`/api/reviews/${reviewId}/helpful`, { helpful }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchReviews();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="review-list-container">
      <div className="review-controls">
        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="control-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div className="control-group">
          <label>Filter by rating:</label>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="control-select">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="reviewer-name">{review.user.name}</div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {review.title && <h4 className="review-title">{review.title}</h4>}
              {review.comment && <p className="review-comment">{review.comment}</p>}

              <div className="review-actions">
                <button
                  onClick={() => handleHelpful(review.id, true)}
                  className="helpful-btn"
                >
                  👍 Helpful ({review.helpful})
                </button>
                <button
                  onClick={() => handleHelpful(review.id, false)}
                  className="helpful-btn"
                >
                  👎 Not Helpful ({review.notHelpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
