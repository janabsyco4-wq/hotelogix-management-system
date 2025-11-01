# Quick Payment Test Guide 🚀

## Test the Payment Integration Now!

### Step 1: Open the Application
Navigate to: **http://localhost:3000**

### Step 2: Login
- Email: `john@example.com`
- Password: `password123`

### Step 3: Browse Rooms
- Click "Rooms" in the navigation
- Select any room you like
- Click "Book Now"

### Step 4: Enter Booking Details
- **Check-in**: Select any future date
- **Check-out**: Select a date after check-in
- **Guests**: Select number of guests
- Click **"Proceed to Payment"**

### Step 5: Complete Payment
Use these **Stripe test card details**:

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry Date | Any future date (e.g., `12/25`) |
| CVC | Any 3 digits (e.g., `123`) |
| ZIP | Any 5 digits (e.g., `12345`) |

Click **"Pay $XXX.XX"**

### Step 6: Verify Success
- ✅ You should see a success message
- ✅ You'll be redirected to "My Bookings"
- ✅ Your booking will appear with status "confirmed"

## Other Test Cards

### Successful Payments
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

### Declined Payments (to test error handling)
- `4000 0000 0000 9995` - Declined
- `4000 0000 0000 0002` - Declined (generic)

### Requires Authentication
- `4000 0025 0000 3155` - Requires 3D Secure

## What to Check

✅ Payment form loads correctly
✅ Card validation works
✅ Loading state shows during processing
✅ Success message appears
✅ Booking is created in database
✅ Redirect to My Bookings works
✅ Booking shows correct details

## Troubleshooting

**Payment form doesn't appear?**
- Check browser console for errors
- Verify frontend is running on port 3000
- Check that Stripe keys are configured

**Payment fails?**
- Verify backend is running on port 5000
- Check backend console for errors
- Ensure you're using test card numbers

**Booking doesn't appear?**
- Check My Bookings page
- Verify you're logged in
- Check Prisma Studio at http://localhost:5555

## Admin View

Login as admin to see all bookings:
- Email: `admin@hotelogix.com`
- Password: `admin123`
- Navigate to Admin Dashboard
- View all bookings with payment details

---

**Ready to test?** Open http://localhost:3000 and start booking! 🎉
