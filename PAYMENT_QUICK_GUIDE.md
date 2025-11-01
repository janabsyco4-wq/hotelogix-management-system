# Payment Quick Guide 🚀

## Test All Payment Types Now!

### Login Credentials
- Email: `john@example.com`
- Password: `password123`

### Test Card
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

---

## 1. 🏨 Room Booking ($200)

1. Go to http://localhost:3000/rooms
2. Click any room → "Book Now"
3. Check-in: Tomorrow
4. Check-out: Day after tomorrow
5. Guests: 2
6. "Proceed to Payment" → Enter card → Pay

**Expected**: Booking confirmed, redirected to My Bookings

---

## 2. 🍽️ Dining Reservation ($50)

1. Go to http://localhost:3000/dining
2. Click any restaurant → "Reserve Table"
3. Date: Tomorrow
4. Time: 7:00 PM
5. Guests: 2
6. "Proceed to Payment" → Enter card → Pay

**Expected**: Reservation confirmed, redirected to My Bookings

---

## 3. 🎁 Deal Redemption ($78)

1. Go to http://localhost:3000/deals
2. Click any deal → "Redeem Deal"
3. Review deal details
4. "Proceed to Payment" → Enter card → Pay

**Expected**: Redemption code displayed, can copy code

---

## 4. 📦 Package Booking ($599)

1. Go to http://localhost:3000/packages
2. Click any package → "Book Package"
3. Start Date: Next week
4. Guests: 2
5. "Proceed to Payment" → Enter card → Pay

**Expected**: Package booked, redirected to My Bookings

---

## Verify Payments

### In Browser
- Go to http://localhost:3000/my-bookings
- All bookings should show "confirmed" status

### In Database
- Open http://localhost:5555 (Prisma Studio)
- Check tables: Booking, DiningReservation, DealRedemption, PackageBooking
- Each record should have a `paymentIntentId`

### In Stripe Dashboard
- Go to https://dashboard.stripe.com/test/payments
- See all test payments listed

---

## Quick Test Script

Run automated test:
```bash
node test-all-payments.js
```

This verifies all payment endpoints are working.

---

**All systems ready!** Start testing at http://localhost:3000 🎉
