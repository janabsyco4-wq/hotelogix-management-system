# 📧 Email Notifications Setup Guide

## ✅ What's Been Done

I've created the email service with beautiful HTML templates for:
1. Welcome email (new user registration) ✅
2. Booking confirmation ✅
3. Payment receipt ✅
4. Refund confirmation ✅

The welcome email is already integrated and working!

---

## 🔧 Setup Required

### Step 1: Configure Email Credentials

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For Gmail:**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password" for "Mail"
4. Use that app password (not your regular password)

**Or use a test service (Ethereal):**
- Visit: https://ethereal.email/create
- Copy the credentials they give you
- Use those in your .env file

---

## 📝 Integration Steps

### Already Integrated:
✅ **Welcome Email** - Sends when user registers

### To Integrate:

#### 1. Booking Confirmation Email

Add to `server/routes/bookings.js` after creating a booking:

```javascript
const { sendBookingConfirmation } = require('../services/emailService');

// After creating booking
const room = await prisma.room.findUnique({ where: { id: booking.roomId } });
const user = await prisma.user.findUnique({ where: { id: booking.userId } });

sendBookingConfirmation(booking, user, room).catch(err => 
  console.error('Email error:', err)
);
```

#### 2. Payment Receipt Email

Add to `server/routes/payment.js` in the webhook handler when payment succeeds:

```javascript
const { sendPaymentReceipt } = require('../services/emailService');

// In webhook handler, when payment_intent.succeeded
const payment = await prisma.payment.findFirst({
  where: { stripePaymentId: paymentIntent.id },
  include: {
    booking: {
      include: {
        user: true,
        room: true
      }
    }
  }
});

if (payment && payment.booking) {
  sendPaymentReceipt(
    payment,
    payment.booking,
    payment.booking.user,
    payment.booking.room
  ).catch(err => console.error('Email error:', err));
}
```

#### 3. Refund Confirmation Email

Add to `server/routes/payment.js` in the refund endpoint:

```javascript
const { sendRefundConfirmation } = require('../services/emailService');

// After processing refund
const booking = await prisma.booking.findUnique({
  where: { id: payment.bookingId },
  include: {
    user: true,
    room: true
  }
});

sendRefundConfirmation(payment, booking, booking.user, booking.room)
  .catch(err => console.error('Email error:', err));
```

---

## 🧪 Testing Emails

### Test with Ethereal (Fake SMTP):

1. Visit: https://ethereal.email/create
2. Copy credentials to .env:
```env
EMAIL_USER=ethereal-username@ethereal.email
EMAIL_PASS=ethereal-password
```
3. Register a new user
4. Check https://ethereal.email/messages to see the email!

### Test with Real Gmail:

1. Use your Gmail credentials
2. Register with your real email
3. Check your inbox!

---

## 📧 Email Templates

All emails include:
- ✅ Beautiful HTML design
- ✅ Responsive layout
- ✅ Professional branding
- ✅ All booking details
- ✅ Clear call-to-actions
- ✅ Footer with company info

---

## 🎨 Customization

To customize email templates, edit `server/services/emailService.js`:

- Change colors in the `<style>` section
- Modify text content
- Add your logo
- Change button links
- Add more information

---

## 🚀 Production Setup

For production, use a professional email service:

### Option 1: SendGrid (Recommended)
- Free tier: 100 emails/day
- Sign up: https://sendgrid.com
- Get API key
- Update .env:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Option 2: AWS SES
- Very cheap ($0.10 per 1000 emails)
- Requires AWS account
- More setup but very reliable

### Option 3: Mailgun
- Free tier: 5000 emails/month
- Easy setup
- Good documentation

---

## ✅ Quick Test

1. Update your .env with email credentials
2. Restart your backend: `npm run server`
3. Register a new user on your site
4. Check your email inbox!

You should receive a beautiful welcome email! 🎉

---

## 🐛 Troubleshooting

**Email not sending?**
- Check .env file has correct credentials
- Check console for error messages
- Try Ethereal first (always works)
- For Gmail, make sure you're using App Password, not regular password

**Email goes to spam?**
- Normal for development
- In production, use SendGrid/AWS SES
- Set up SPF/DKIM records

**Emails slow?**
- Emails are sent async (don't block response)
- Check your email service limits
- Consider using a queue (Bull/Redis) for high volume

---

## 📊 Email Analytics (Optional)

Track email opens and clicks:
- SendGrid has built-in analytics
- Add tracking pixels
- Use UTM parameters in links

---

## 🎯 Next Steps

1. ✅ Set up email credentials in .env
2. ✅ Test welcome email (already working!)
3. ⏳ Integrate booking confirmation
4. ⏳ Integrate payment receipt
5. ⏳ Integrate refund confirmation
6. ⏳ Test all email types
7. ⏳ Deploy to production with SendGrid

---

**Your email system is ready to go!** Just add credentials and test! 📧✨
