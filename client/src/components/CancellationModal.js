import React, { useState } from 'react';
import CancellationPolicy from './CancellationPolicy';
import './CancellationModal.css';

const CancellationModal = ({ booking, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'Change of plans',
    'Found better accommodation',
    'Travel dates changed',
    'Emergency situation',
    'Price too high',
    'Other'
  ];

  const handleConfirm = async () => {
    const finalReason = reason === 'Other' ? otherReason : reason;
    
    if (!finalReason) {
      alert('Please select or enter a cancellation reason');
      return;
    }

    setLoading(true);
    await onConfirm(finalReason);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="cancellation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancel Booking</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="modal-content">
          {/* Booking Info */}
          <div className="booking-info">
            <h3>Booking Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Booking ID:</span>
                <span className="value">#{booking.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Room:</span>
                <span className="value">{booking.room?.title || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Check-in:</span>
                <span className="value">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Check-out:</span>
                <span className="value">{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Refund Calculator */}
          <CancellationPolicy 
            showCalculator={true}
            bookingAmount={booking.totalPrice}
            checkInDate={booking.checkIn}
          />

          {/* Cancellation Reason */}
          <div className="reason-section">
            <h3>Reason for Cancellation</h3>
            <p className="reason-note">Help us improve by telling us why you're cancelling</p>
            
            <div className="reason-options">
              {reasons.map((r) => (
                <label key={r} className="reason-option">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {reason === 'Other' && (
              <textarea
                className="other-reason-input"
                placeholder="Please specify your reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows="3"
              />
            )}
          </div>

          {/* Warning */}
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <div className="warning-text">
              <strong>Important:</strong> Once cancelled, this booking cannot be restored. 
              The refund will be processed according to our cancellation policy and credited 
              to your original payment method within 5-7 business days.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Keep Booking
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleConfirm}
            disabled={loading || !reason}
          >
            {loading ? 'Processing...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
