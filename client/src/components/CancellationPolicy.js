import React from 'react';
import './CancellationPolicy.css';

const CancellationPolicy = ({ compact = false, showCalculator = false, bookingAmount = 0, checkInDate = null }) => {
  
  const calculateRefund = () => {
    if (!checkInDate || !bookingAmount) return null;
    
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);
    
    let refundPercentage = 0;
    let refundAmount = 0;
    let policy = '';
    
    if (hoursUntilCheckIn >= 48) {
      refundPercentage = 100;
      policy = 'Free cancellation (48+ hours before check-in)';
    } else if (hoursUntilCheckIn >= 24) {
      refundPercentage = 50;
      policy = 'Partial refund (24-48 hours before check-in)';
    } else {
      refundPercentage = 0;
      policy = 'No refund (less than 24 hours before check-in)';
    }
    
    refundAmount = (bookingAmount * refundPercentage) / 100;
    
    return {
      refundPercentage,
      refundAmount,
      policy,
      hoursUntilCheckIn: Math.floor(hoursUntilCheckIn)
    };
  };

  const refundInfo = showCalculator ? calculateRefund() : null;

  if (compact) {
    return (
      <div className="cancellation-policy-compact">
        <div className="policy-icon">🔄</div>
        <div className="policy-text">
          <strong>Free cancellation</strong> up to 48 hours before check-in
        </div>
      </div>
    );
  }

  return (
    <div className="cancellation-policy">
      <div className="policy-header">
        <h3>📋 Cancellation Policy</h3>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <div className="policy-item success">
            <div className="policy-icon">✅</div>
            <div className="policy-details">
              <h4>Free Cancellation</h4>
              <p>Cancel up to <strong>48 hours</strong> before check-in for a <strong>full refund</strong></p>
            </div>
          </div>

          <div className="policy-item warning">
            <div className="policy-icon">⚠️</div>
            <div className="policy-details">
              <h4>Partial Refund</h4>
              <p>Cancel between <strong>24-48 hours</strong> before check-in for a <strong>50% refund</strong></p>
            </div>
          </div>

          <div className="policy-item danger">
            <div className="policy-icon">❌</div>
            <div className="policy-details">
              <h4>No Refund</h4>
              <p>Cancel less than <strong>24 hours</strong> before check-in - <strong>No refund</strong></p>
            </div>
          </div>
        </div>

        {showCalculator && refundInfo && (
          <div className="refund-calculator">
            <h4>Your Refund Estimate</h4>
            <div className="calculator-content">
              <div className="calc-row">
                <span>Booking Amount:</span>
                <strong>PKR {bookingAmount.toLocaleString()}</strong>
              </div>
              <div className="calc-row">
                <span>Time Until Check-in:</span>
                <strong>{refundInfo.hoursUntilCheckIn} hours</strong>
              </div>
              <div className="calc-row">
                <span>Applicable Policy:</span>
                <strong>{refundInfo.policy}</strong>
              </div>
              <div className="calc-row highlight">
                <span>Refund Amount:</span>
                <strong className={refundInfo.refundPercentage === 100 ? 'success' : refundInfo.refundPercentage === 50 ? 'warning' : 'danger'}>
                  PKR {refundInfo.refundAmount.toLocaleString()} ({refundInfo.refundPercentage}%)
                </strong>
              </div>
            </div>
          </div>
        )}

        <div className="policy-notes">
          <h4>Important Notes:</h4>
          <ul>
            <li>Refunds are processed within 5-7 business days</li>
            <li>Refund will be credited to your original payment method</li>
            <li>No-shows are not eligible for refunds</li>
            <li>Special rates and packages may have different policies</li>
            <li>For group bookings (5+ rooms), contact us directly</li>
          </ul>
        </div>

        <div className="policy-contact">
          <p>Questions about cancellation? Contact us:</p>
          <div className="contact-info">
            <span>📞 +92 310 4594964</span>
            <span>📧 shehroozking3@gmail.com</span>
            <span>💬 WhatsApp: +92 310 4594964</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
