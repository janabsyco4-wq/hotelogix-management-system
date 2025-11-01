import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StripePayment.css';

const StripePayment = ({ amount, bookingType, bookingData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Create payment intent
      const { data } = await axios.post('/api/payment/create-payment-intent', {
        amount,
        bookingType,
        bookingDetails: { ...bookingData, totalPrice: amount }
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
        toast.error(result.error.message);
      } else {
        // Payment successful, confirm booking
        const bookingRes = await axios.post('/api/payment/confirm-booking', {
          paymentIntentId: result.paymentIntent.id,
          bookingType,
          bookingData: { ...bookingData, totalPrice: amount }
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.success('Payment successful! Booking confirmed.');
        onSuccess(bookingRes.data.booking);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="stripe-payment">
      <form onSubmit={handleSubmit}>
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="summary-row">
            <span>Total Amount:</span>
            <span className="amount">${amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="card-element-container">
          <label>Card Details</label>
          <CardElement options={cardElementOptions} />
        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <div className="payment-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!stripe || processing}
          >
            {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </button>
        </div>

        <div className="payment-secure">
          🔒 Secure payment powered by Stripe
        </div>
      </form>
    </div>
  );
};

export default StripePayment;
