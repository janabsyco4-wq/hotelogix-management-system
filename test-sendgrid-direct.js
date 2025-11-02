require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Testing SendGrid Configuration...\n');

// Show configuration (hide sensitive parts)
console.log('📋 Current Configuration:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 10)}...` : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Enable debug output
  logger: true  // Log to console
});

// Test connection
console.log('🔌 Testing SMTP Connection...\n');
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ SMTP Connection Failed:');
    console.log(error);
  } else {
    console.log('✅ SMTP Server is ready to send emails\n');
    
    // Try sending a test email
    console.log('📧 Sending test email...\n');
    
    const mailOptions = {
      from: '"Stoney Creek Resort" <janabsyco4@gmail.com>',
      to: 'janabsyco4@gmail.com',
      subject: 'SendGrid Test Email - ' + new Date().toLocaleString(),
      text: 'This is a test email from your SendGrid configuration.',
      html: '<h1>Test Email</h1><p>If you receive this, SendGrid is working!</p><p>Sent at: ' + new Date().toLocaleString() + '</p>'
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email Send Failed:');
        console.log(error);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('\n📬 Check your inbox at: janabsyco4@gmail.com');
        console.log('⚠️ Also check your SPAM folder!');
      }
    });
  }
});
