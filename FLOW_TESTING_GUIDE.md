# 🧪 Flow Testing Guide

## Overview
This guide helps you test the complete restaurant, deal, and package booking flows.

## ✅ Prerequisites
- Frontend running on: http://localhost:3000
- Backend running on: http://localhost:5000
- Database seeded with test data

## 🔐 Test User Credentials
```
Email: admin@stoneycreek.com
Password: admin123
```

---

## 🍽️ RESTAURANT FLOW TEST

### Step 1: Browse Restaurants
1. Navigate to: http://localhost:3000/dining
2. ✅ Verify: 5 restaurants are displayed
3. ✅ Verify: Filter by cuisine, location, price range works
4. ✅ Verify: Featured restaurants appear first

### Step 2: View Restaurant Details
1. Click on any restaurant card
2. ✅ Verify: Redirects to `/restaurants/:id`
3. ✅ Verify: Restaurant details page shows:
   - Restaurant name and images
   - Cuisine type and location
   - Opening hours
   - Menu items
   - Amenities
   - "Reserve a Table" button

### Step 3: Make Reservation
1. Click "Reserve a Table" button
2. ✅ Verify: Redirects to `/restaurants/:id/reserve`
3. ✅ Verify: Reservation form shows:
   - Restaurant summary sidebar
   - Date picker
   - Time selector
   - Number of guests
   - Special requests field
4. Fill out the form:
   - Select a future date
   - Choose a time
   - Enter number of guests (1-10)
   - Add special requests (optional)
5. Click "Confirm Reservation"
6. ✅ Verify: Success message appears
7. ✅ Verify: Redirects to `/my-bookings`

### Step 4: View Reservation in My Bookings
1. Navigate to: http://localhost:3000/my-bookings
2. Click "Dining Reservations" tab
3. ✅ Verify: Your reservation appears with:
   - Restaurant name and image
   - Date and time
   - Number of guests
   - Status badge
   - Action buttons

---

## 🎁 DEAL FLOW TEST

### Step 1: Browse Deals
1. Navigate to: http://localhost:3000/deals
2. ✅ Verify: 6 deals are displayed
3. ✅ Verify: Filter by type and location works
4. ✅ Verify: Discount badges show correctly
5. ✅ Verify: Original and deal prices display

### Step 2: View Deal Details
1. Click on any deal card
2. ✅ Verify: Redirects to `/deals/:id`
3. ✅ Verify: Deal details page shows:
   - Deal title and images
   - Discount percentage
   - Original and deal prices
   - Savings amount
   - Terms and conditions
   - Validity dates
   - Availability counter
   - "Redeem This Deal" button

### Step 3: Redeem Deal
1. Click "Redeem This Deal" button
2. ✅ Verify: Redirects to `/deals/:id/redeem`
3. ✅ Verify: Redemption page shows:
   - Deal summary
   - Confirmation message
4. Click "Confirm Redemption"
5. ✅ Verify: Success page appears with:
   - Redemption code (e.g., "A1B2C3D4E5F6G7H8")
   - "Copy Code" button
   - Deal details
6. Click "Copy Code"
7. ✅ Verify: "Code copied!" toast appears
8. Click "View My Deals"
9. ✅ Verify: Redirects to `/my-bookings`

### Step 4: View Deal in My Bookings
1. Navigate to: http://localhost:3000/my-bookings
2. Click "My Deals" tab
3. ✅ Verify: Your redeemed deal appears with:
   - Deal title and image
   - Redemption code
   - Status (active/used/expired)
   - Savings amount
   - "Copy Code" button

---

## 📦 PACKAGE FLOW TEST

### Step 1: Browse Packages
1. Navigate to: http://localhost:3000/packages
2. ✅ Verify: 4 packages are displayed
3. ✅ Verify: Filter by location works
4. ✅ Verify: Package cards show:
   - Package name and image
   - Duration
   - Price
   - Preview of inclusions

### Step 2: View Package Details
1. Click on any package card
2. ✅ Verify: Redirects to `/packages/:id`
3. ✅ Verify: Package details page shows:
   - Package name and image gallery
   - Duration and location
   - Full list of inclusions
   - Price
   - "Book This Package" button

### Step 3: Book Package
1. Click "Book This Package" button
2. ✅ Verify: Redirects to `/packages/:id/book`
3. ✅ Verify: Booking form shows:
   - Package summary sidebar
   - Start date picker
   - Number of guests selector
   - Booking summary with total price
4. Fill out the form:
   - Select a future start date
   - Enter number of guests
5. ✅ Verify: Total price updates based on guests
6. Click "Confirm Booking"
7. ✅ Verify: Success message appears
8. ✅ Verify: Redirects to `/my-bookings`

### Step 4: View Package in My Bookings
1. Navigate to: http://localhost:3000/my-bookings
2. Click "Packages" tab
3. ✅ Verify: Your package booking appears with:
   - Package name and image
   - Duration
   - Start date
   - Number of guests
   - Inclusions preview
   - Total price
   - Status badge
   - Action buttons

---

## 📱 MY BOOKINGS PAGE TEST

### Overview Tab
1. Navigate to: http://localhost:3000/my-bookings
2. ✅ Verify: Hero section shows:
   - Total bookings count
   - Breakdown by type (Rooms, Dining, Deals, Packages)
3. ✅ Verify: All 4 tabs are visible

### Room Bookings Tab
1. Click "Room Bookings" tab
2. ✅ Verify: Shows all room bookings with:
   - Room image and title
   - Check-in and check-out dates
   - Total price
   - Status badge
   - "View Room" and "Cancel" buttons

### Dining Reservations Tab
1. Click "Dining Reservations" tab
2. ✅ Verify: Shows all dining reservations with:
   - Restaurant image and name
   - Date, time, and guest count
   - Special requests (if any)
   - Status badge
   - "View Restaurant" and "Cancel" buttons

### My Deals Tab
1. Click "My Deals" tab
2. ✅ Verify: Shows all redeemed deals with:
   - Deal image and title
   - Redemption code
   - Discount badge
   - Savings amount
   - Status badge
   - "Copy Code" button (if active)

### Packages Tab
1. Click "Packages" tab
2. ✅ Verify: Shows all package bookings with:
   - Package image and name
   - Duration and start date
   - Guest count
   - Inclusions preview
   - Total price
   - Status badge
   - "View Package" and "Cancel" buttons

---

## 🔄 NAVIGATION TEST

### Back Navigation
1. From any detail page, click "Back to [List]"
2. ✅ Verify: Returns to listing page

### Breadcrumb Navigation
1. Test navigation flow:
   - Listing → Detail → Booking → My Bookings
2. ✅ Verify: Each step works correctly

### Direct URL Access
1. Test direct URL access:
   - `/restaurants/1`
   - `/restaurants/1/reserve`
   - `/deals/1`
   - `/deals/1/redeem`
   - `/packages/1`
   - `/packages/1/book`
2. ✅ Verify: All pages load correctly

---

## 🎨 UI/UX TEST

### Responsive Design
1. Test on different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. ✅ Verify: Layout adapts correctly
3. ✅ Verify: Sidebars collapse on mobile
4. ✅ Verify: Buttons are touch-friendly

### Loading States
1. ✅ Verify: Loading spinners appear during API calls
2. ✅ Verify: Skeleton screens show while loading

### Error Handling
1. Test with invalid IDs (e.g., `/restaurants/999`)
2. ✅ Verify: Error messages display
3. ✅ Verify: User can navigate back

### Empty States
1. Create a new user with no bookings
2. ✅ Verify: Empty state messages show
3. ✅ Verify: "Browse" buttons work

---

## 🔐 AUTHENTICATION TEST

### Protected Routes
1. Log out
2. Try to access:
   - `/restaurants/1/reserve`
   - `/deals/1/redeem`
   - `/packages/1/book`
   - `/my-bookings`
3. ✅ Verify: Redirects to login page

### Login Flow
1. Log in with test credentials
2. ✅ Verify: Redirects back to intended page
3. ✅ Verify: User info appears in header

---

## 📊 API ENDPOINT TEST

### Restaurant Endpoints
```bash
# Get all restaurants
curl http://localhost:5000/api/restaurants

# Get single restaurant
curl http://localhost:5000/api/restaurants/1

# Create reservation (requires auth token)
curl -X POST http://localhost:5000/api/restaurants/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"restaurantId":1,"date":"2025-11-15","time":"19:00","guests":2}'

# Get my reservations
curl http://localhost:5000/api/restaurants/reservations/my-reservations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Deal Endpoints
```bash
# Get all deals
curl http://localhost:5000/api/deals

# Get single deal
curl http://localhost:5000/api/deals/1

# Redeem deal (requires auth token)
curl -X POST http://localhost:5000/api/deals/1/redeem \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get my redemptions
curl http://localhost:5000/api/deals/redemptions/my-deals \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Package Endpoints
```bash
# Get all packages
curl http://localhost:5000/api/packages

# Get single package
curl http://localhost:5000/api/packages/1

# Book package (requires auth token)
curl -X POST http://localhost:5000/api/packages/1/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"startDate":"2025-11-20","guests":2}'

# Get my package bookings
curl http://localhost:5000/api/packages/bookings/my-packages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ SUCCESS CRITERIA

All flows are working correctly if:

1. ✅ All listing pages display data
2. ✅ All detail pages show complete information
3. ✅ All booking/reservation/redemption forms work
4. ✅ All submissions create database records
5. ✅ My Bookings page displays all user activities
6. ✅ Navigation flows work seamlessly
7. ✅ Authentication protects booking routes
8. ✅ UI is responsive on all devices
9. ✅ Loading and error states work
10. ✅ API endpoints return correct data

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution**: Check if data is loaded before rendering

### Issue: "401 Unauthorized"
**Solution**: Ensure user is logged in and token is valid

### Issue: "404 Not Found"
**Solution**: Verify the ID exists in database

### Issue: Proxy errors
**Solution**: Ensure backend is running on port 5000

### Issue: CORS errors
**Solution**: Check CORS configuration in server/index.js

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Restaurant Flow: ☐ Pass ☐ Fail
Deal Flow: ☐ Pass ☐ Fail
Package Flow: ☐ Pass ☐ Fail
My Bookings: ☐ Pass ☐ Fail
Navigation: ☐ Pass ☐ Fail
UI/UX: ☐ Pass ☐ Fail
Authentication: ☐ Pass ☐ Fail
API Endpoints: ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
_________________________________
```
