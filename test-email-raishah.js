require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('📧 Sending test email to raishaharyar369@gmail.com...\n');

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
  from: '"Stoney Creek Resort" <janabsyco4@gmail.com>',
  to: 'raishaharyar369@gmail.com',
  subject: '🏨 Welcome to Stoney Creek Resort!',
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
          <h1>🎉 Welcome to Stoney Creek Resort!</h1>
        </div>
        <div class="content">
          <h2>Hello! 👋</h2>
          <p>This is a test email from your hotel management system.</p>
          
          <p><strong>Your SendGrid email system is working perfectly!</strong></p>
          
          <p>Here's what you can do with our system:</p>
          <ul>
            <li>🏨 Browse luxurious rooms and suites</li>
            <li>🍽️ Make restaurant reservations</li>
            <li>🎁 Discover exclusive deals</li>
            <li>⭐ Get personalized recommendations</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="http://localhost:3000/rooms" class="button">
              Explore Rooms
            </a>
          </div>
          
          <p>This email was sent at: <strong>${new Date().toLocaleString()}</strong></p>
          
          <p>Best regards,<br>The Stoney Creek Resort Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Stoney Creek Resort. All rights reserved.</p>
          <p>This is a test email from your SendGrid configuration.</p>
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
    console.log('\n📬 Check inbox at: raishaharyar369@gmail.com');
    console.log('⚠️ Also check SPAM folder!');
  }
});
