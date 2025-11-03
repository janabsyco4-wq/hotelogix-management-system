const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if using Ethereal (test email service)
  if (process.env.EMAIL_USER && process.env.EMAIL_USER.includes('ethereal.email')) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Production (SendGrid)
  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // Use TLS, not SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Gmail for development
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: '"Hotelogix Pakistan" <reservations@hotelogix.pk>',
      to: user.email,
      subject: 'Welcome to Hotelogix Pakistan! 🏨',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hotelogix Pakistan!</h1>
              <p>Your Gateway to Premium Hospitality</p>
            </div>
            <div class="content">
              <h2>Hi ${user.name}! 👋</h2>
              <p>Thank you for joining Hotelogix Pakistan. We're excited to have you as part of our community!</p>
              
              <p><strong>Your account is now active and ready to use.</strong></p>
              
              <p>Discover the best of Pakistani hospitality:</p>
              <ul>
                <li>🏨 Browse luxurious rooms across Lahore, Multan, Okara & Sheikhupura</li>
                <li>🍽️ Reserve tables at authentic Pakistani restaurants</li>
                <li>🎁 Discover exclusive deals and travel packages</li>
                <li>⭐ Get AI-powered personalized recommendations</li>
                <li>💬 24/7 chatbot assistance in English & Urdu</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/rooms" class="button">
                  Explore Rooms
                </a>
              </div>
              
              <p>Need assistance? Contact us:</p>
              <p>📞 +92-300-1234567 | 📧 support@hotelogix.pk<br>
              🌐 www.hotelogix.pk</p>
              
              <p>Best regards,<br>The Hotelogix Pakistan Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Hotelogix Pakistan. All rights reserved.</p>
              <p>Serving Lahore, Multan, Okara & Sheikhupura</p>
              <p>You're receiving this email because you created an account with us.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (booking, user, room) => {
  try {
    const transporter = createTransporter();

    const checkIn = new Date(booking.checkIn).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const checkOut = new Date(booking.checkOut).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const mailOptions = {
      from: '"Hotelogix Pakistan" <reservations@hotelogix.pk>',
      to: user.email,
      subject: `Booking Confirmed - ${room.title} 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #667eea; }
            .total { font-size: 24px; color: #667eea; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed!</h1>
              <p>Booking ID: #${booking.id}</p>
            </div>
            <div class="content">
              <h2>Hi ${user.name}! 🎉</h2>
              <p>Great news! Your booking has been confirmed. We can't wait to welcome you to Hotelogix Pakistan!</p>
              
              <div class="booking-details">
                <h3>📋 Booking Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Room:</span>
                  <span>${room.title}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${room.location}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Check-in:</span>
                  <span>${checkIn}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Check-out:</span>
                  <span>${checkOut}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Guests:</span>
                  <span>${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Booking Type:</span>
                  <span>${booking.bookingType}</span>
                </div>
                
                <div class="detail-row" style="border-bottom: none; margin-top: 20px;">
                  <span class="detail-label">Total Amount:</span>
                  <span class="total">₨${booking.totalPrice.toLocaleString('en-PK')}</span>
                </div>
              </div>
              
              <h3>What's Next?</h3>
              <ul>
                <li>📧 Save this email for your records</li>
                <li>🆔 Bring a valid ID for check-in</li>
                <li>⏰ Check-in time: 2:00 PM</li>
                <li>🚪 Check-out time: 12:00 PM (Noon)</li>
                <li>🆔 Bring valid CNIC or Passport</li>
              </ul>
              
              <p><strong>Need to make changes?</strong> Visit your bookings page or contact us.</p>
              
              <p>Looking forward to hosting you!</p>
              
              <p>Best regards,<br>The Hotelogix Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Hotelogix. All rights reserved.</p>
              <p>Booking ID: #${booking.id}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending booking confirmation:', error.message);
  }
};

// Send payment receipt email
const sendPaymentReceipt = async (payment, booking, user, room) => {
  try {
    const transporter = createTransporter();

    const paymentDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const mailOptions = {
      from: '"Hotelogix Pakistan" <janabsyco4@gmail.com>',
      to: user.email,
      subject: `Payment Receipt - Booking #${booking.id} 💳`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; }
            .amount { font-size: 28px; color: #10b981; font-weight: bold; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Successful!</h1>
              <p>Receipt #${payment.id}</p>
            </div>
            <div class="content">
              <h2>Hi ${user.name}!</h2>
              <p>Thank you for your payment. Your transaction was successful.</p>
              
              <div class="receipt">
                <h3 style="text-align: center; color: #10b981;">Payment Receipt</h3>
                
                <div class="amount">₨${payment.amount.toLocaleString('en-PK')}</div>
                
                <div class="detail-row">
                  <span class="detail-label">Payment ID:</span>
                  <span>#${payment.id}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>#${booking.id}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Room:</span>
                  <span>${room.name}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span>Credit Card (****${payment.stripePaymentId.slice(-4)})</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Payment Date:</span>
                  <span>${paymentDate}</span>
                </div>
                
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Status:</span>
                  <span style="color: #10b981; font-weight: bold;">✅ ${payment.status.toUpperCase()}</span>
                </div>
              </div>
              
              <p><strong>📧 Keep this receipt for your records.</strong></p>
              
              <p>If you have any questions about this payment, please contact our support team.</p>
              
              <p>Best regards,<br>The Hotelogix Pakistan Team<br>
              📞 +92 310 4594964 | 📧 shehroozking3@gmail.com</p>
            </div>
            <div class="footer">
              <p>© 2025 Hotelogix Pakistan. All rights reserved.</p>
              <p>Lahore • Multan • Okara • Sheikhupura</p>
              <p>This is an automated receipt. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Payment receipt sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending payment receipt:', error.message);
  }
};

// Send refund confirmation email
const sendRefundConfirmation = async (payment, booking, user, room) => {
  try {
    const transporter = createTransporter();

    const refundDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const mailOptions = {
      from: '"Hotelogix Pakistan" <janabsyco4@gmail.com>',
      to: user.email,
      subject: `Refund Processed - Booking #${booking.id} 💰`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .refund-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; }
            .amount { font-size: 28px; color: #f59e0b; font-weight: bold; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Refund Processed</h1>
              <p>Booking #${booking.id}</p>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Your refund has been processed successfully.</p>
              
              <div class="refund-box">
                <h3 style="text-align: center; color: #f59e0b;">Refund Details</h3>
                
                <div class="amount">$${payment.refundAmount || payment.amount}</div>
                
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>#${booking.id}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Room:</span>
                  <span>${room.name}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Original Payment:</span>
                  <span>₨${payment.amount.toLocaleString('en-PK')}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Refund Amount:</span>
                  <span style="color: #f59e0b; font-weight: bold;">$${payment.refundAmount || payment.amount}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Refund Date:</span>
                  <span>${refundDate}</span>
                </div>
                
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Status:</span>
                  <span style="color: #f59e0b; font-weight: bold;">✅ REFUNDED</span>
                </div>
              </div>
              
              <p><strong>⏰ Processing Time:</strong> The refund will appear in your account within 5-10 business days, depending on your bank.</p>
              
              <p>We're sorry to see you cancel your booking. We hope to welcome you to Hotelogix in the future!</p>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>The Hotelogix Pakistan Team<br>
              📞 +92 310 4594964 | 📧 shehroozking3@gmail.com</p>
            </div>
            <div class="footer">
              <p>© 2025 Hotelogix Pakistan. All rights reserved.</p>
              <p>Lahore • Multan • Okara • Sheikhupura</p>
              <p>Refund ID: ${payment.stripeRefundId || 'N/A'}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Refund confirmation sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending refund confirmation:', error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendPaymentReceipt,
  sendRefundConfirmation
};
