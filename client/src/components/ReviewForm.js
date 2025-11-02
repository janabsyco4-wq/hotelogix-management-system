import React, { useState } from 'react';
import axios from '../api/axios';
import './ReviewForm.css';

const ReviewForm = ({ bookingId, roomId, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reviews', {
        rating,
        title,
        comment,
        roomId,
        bookingId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Rating *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">
            {rating > 0 && (
              rating === 1 ? 'Poor' :
              rating === 2 ? 'Fair' :
              rating === 3 ? 'Good' :
              rating === 4 ? 'Very Good' :
              'Excellent'
            )}
          </span>
        </div>

        <div className="form-group">
          <label>Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            maxLength={100}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Review (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with other guests..."
            maxLength={1000}
            rows={5}
            className="form-input"
          />
          <span className="char-count">{comment.length}/1000</span>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
