require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Sending test email to raishaharyar3693@gmail.com...\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: '"Hotelogix" <janabsyco4@gmail.com>',
  to: 'raishaharyar3693@gmail.com',
  subject: '🏨 Welcome to Hotelogix - Test Email',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .feature { padding: 15px; margin: 10px 0; background: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px; }
        .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 SendGrid Email Test</h1>
          <p style="font-size: 18px; margin: 10px 0;">Hotelogix</p>
        </div>
        <div class="content">
          <div class="success">
            <h2 style="margin: 0;">✅ Email System Working!</h2>
          </div>
          
          <h2>Hello! 👋</h2>
          <p>If you're reading this, your SendGrid email system is working perfectly!</p>
          
          <p><strong>Test Details:</strong></p>
          <div class="feature">
            <strong>📧 To:</strong> raishaharyar3693@gmail.com<br>
            <strong>📤 From:</strong> Hotelogix<br>
            <strong>⏰ Sent:</strong> ${new Date().toLocaleString()}<br>
            <strong>🔧 Service:</strong> SendGrid SMTP
          </div>
          
          <h3>🏨 Your Hotel Management System Features:</h3>
          
          <div class="feature">
            <strong>🛏️ Room Bookings</strong><br>
            Browse and book luxurious rooms and suites
          </div>
          
          <div class="feature">
            <strong>🍽️ Restaurant Reservations</strong><br>
            Make dining reservations at our restaurants
          </div>
          
          <div class="feature">
            <strong>💳 Payment Processing</strong><br>
            Secure payments with Stripe integration
          </div>
          
          <div class="feature">
            <strong>📧 Email Notifications</strong><br>
            Automated emails for bookings, payments, and refunds
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000" class="button">
              Visit Hotel Website
            </a>
          </div>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
            <strong>🎯 Next Steps:</strong><br>
            Your email system is production-ready! Users will now receive:
          </p>
          <ul>
            <li>Welcome emails when they register</li>
            <li>Booking confirmations</li>
            <li>Payment receipts</li>
            <li>Refund notifications</li>
          </ul>
          
          <p>Best regards,<br><strong>The Hotelogix Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Hotelogix. All rights reserved.</p>
          <p>This is a test email from your SendGrid configuration.</p>
          <p style="margin-top: 10px; font-size: 10px; color: #999;">
            Message ID: ${Date.now()}-test-email
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email Send Failed:');
    console.log(error);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n📬 Check inbox at: raishaharyar3693@gmail.com');
    console.log('⚠️ Also check SPAM/Junk folder!');
    console.log('\n💡 If not received after 5 minutes:');
    console.log('   1. Check SendGrid dashboard: https://app.sendgrid.com/email_activity');
    console.log('   2. Verify sender identity: https://app.sendgrid.com/settings/sender_auth/senders');
  }
});
