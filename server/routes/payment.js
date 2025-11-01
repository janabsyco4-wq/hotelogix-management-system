const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to verify JWT token
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create payment intent for room booking
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'usd', bookingType, bookingDetails } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user.userId.toString(),
        bookingType: bookingType || 'room',
        bookingDetails: JSON.stringify(bookingDetails)
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment and create booking
router.post('/confirm-booking', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, bookingType, bookingData } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    let booking;

    // Create booking based on type
    switch (bookingType) {
      case 'room':
        booking = await prisma.booking.create({
          data: {
            userId: req.user.userId,
            roomId: bookingData.roomId,
            checkIn: new Date(bookingData.checkIn),
            checkOut: new Date(bookingData.checkOut),
            totalPrice: bookingData.totalPrice,
            status: 'confirmed',
            paymentIntentId: paymentIntentId
          },
          include: {
            room: true,
            user: true
          }
        });
        break;

      case 'dining':
        booking = await prisma.diningReservation.create({
          data: {
            userId: req.user.userId,
            restaurantId: bookingData.restaurantId,
            date: new Date(bookingData.date),
            time: bookingData.time,
            guests: bookingData.guests,
            specialRequests: bookingData.specialRequests,
            status: 'confirmed',
            paymentIntentId: paymentIntentId
          },
          include: {
            restaurant: true,
            user: true
          }
        });
        break;

      case 'deal':
        booking = await prisma.dealRedemption.create({
          data: {
            userId: req.user.userId,
            dealId: bookingData.dealId,
            redemptionCode: `DEAL${Date.now()}`,
            status: 'active',
            paymentIntentId: paymentIntentId
          },
          include: {
            deal: true,
            user: true
          }
        });
        break;

      case 'package':
        booking = await prisma.packageBooking.create({
          data: {
            userId: req.user.userId,
            packageId: bookingData.packageId,
            startDate: new Date(bookingData.startDate),
            guests: bookingData.guests,
            totalPrice: bookingData.totalPrice,
            status: 'confirmed',
            paymentIntentId: paymentIntentId
          },
          include: {
            package: true,
            user: true
          }
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid booking type' });
    }

    res.json({
      success: true,
      booking: booking,
      message: 'Booking confirmed successfully!'
    });

  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment status
router.get('/payment-status/:paymentIntentId', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process refund (Admin only)
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, bookingType, bookingId, amount, reason } = req.body;

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment was not successful' });
    }

    // Create refund
    const refundAmount = amount ? Math.round(amount * 100) : paymentIntent.amount;
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
      reason: reason || 'requested_by_customer',
      metadata: {
        bookingType,
        bookingId: bookingId.toString(),
        adminId: req.user.userId.toString()
      }
    });

    // Update booking status based on type
    let updatedBooking;
    switch (bookingType) {
      case 'room':
        updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'refunded' },
          include: { room: true, user: true }
        });
        break;

      case 'dining':
        updatedBooking = await prisma.diningReservation.update({
          where: { id: bookingId },
          data: { status: 'cancelled' },
          include: { restaurant: true, user: true }
        });
        break;

      case 'deal':
        updatedBooking = await prisma.dealRedemption.update({
          where: { id: bookingId },
          data: { status: 'expired' },
          include: { deal: true, user: true }
        });
        break;

      case 'package':
        updatedBooking = await prisma.packageBooking.update({
          where: { id: bookingId },
          data: { status: 'refunded' },
          include: { package: true, user: true }
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid booking type' });
    }

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        created: refund.created
      },
      booking: updatedBooking,
      message: 'Refund processed successfully!'
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get refund details
router.get('/refund/:refundId', authenticateToken, async (req, res) => {
  try {
    const { refundId } = req.params;

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const refund = await stripe.refunds.retrieve(refundId);

    res.json({
      id: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
      reason: refund.reason,
      created: refund.created,
      paymentIntentId: refund.payment_intent
    });
  } catch (error) {
    console.error('Error retrieving refund:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    case 'charge.refunded':
      const refundedCharge = event.data.object;
      console.log('Charge refunded:', refundedCharge.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
