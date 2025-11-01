# ✅ Stoney Creek Hotel - Complete Testing Checklist

Use this checklist to manually verify all features and links in the application.

---

## 🚀 Pre-Testing Setup

- [ ] Backend server is running (`npm run server` or `.\run-backend.bat`)
- [ ] Frontend server is running (`cd client && npm start` or `.\run-frontend.bat`)
- [ ] Backend accessible at `http://localhost:5000`
- [ ] Frontend accessible at `http://localhost:3000`
- [ ] Database has seed data (`npm run prisma:migrate`)

---

## 1️⃣ Home Page Testing

### Navigation
- [ ] Open `http://localhost:3000`
- [ ] Page loads successfully
- [ ] Header displays with logo "SC"
- [ ] Navigation menu shows: HOME, ROOMS
- [ ] LOGIN and REGISTER buttons visible (when not logged in)
- [ ] Theme toggle button (🌙/☀️) visible

### Content
- [ ] Hero section displays with title "Welcome to Stoney Creek Hotels"
- [ ] "EXPLORE ROOMS" button is visible
- [ ] AI Recommendations section displays
- [ ] Features section shows 3 feature cards
- [ ] All images load correctly

### Interactions
- [ ] Click "EXPLORE ROOMS" → Navigates to `/rooms`
- [ ] Click theme toggle → Theme changes (light/dark)
- [ ] Click logo → Returns to home page
- [ ] Click HOME in nav → Stays on home page
- [ ] Click ROOMS in nav → Navigates to `/rooms`

---

## 2️⃣ Rooms Page Testing

### Navigation
- [ ] Navigate to `http://localhost:3000/rooms`
- [ ] Page loads successfully
- [ ] Header navigation still works
- [ ] Page title "Our Rooms" displays

### Filters
- [ ] Filters sidebar visible on desktop
- [ ] "🔍 Filters" button visible on mobile
- [ ] Featured Rooms checkbox works
- [ ] Available Only checkbox works
- [ ] Room Type dropdown populates with types
- [ ] Min Price input accepts numbers
- [ ] Max Price input accepts numbers
- [ ] "🔄 Clear All Filters" button works
- [ ] Applying filters updates room list

### Room Cards
- [ ] Room cards display in grid
- [ ] Each card shows:
  - [ ] Room image
  - [ ] Room title
  - [ ] Room type badge
  - [ ] Price per night
  - [ ] Hotel name and location
  - [ ] Capacity, size, bed type
  - [ ] Description
  - [ ] Amenities preview
  - [ ] "VIEW DETAILS" button
  - [ ] "BOOK NOW" button (if available)
- [ ] Featured rooms show "Featured" badge
- [ ] Unavailable rooms show "Not Available" overlay

### Interactions
- [ ] Click "VIEW DETAILS" → Navigates to `/rooms/:id`
- [ ] Click "BOOK NOW" → Navigates to `/book/:id` (or login if not authenticated)
- [ ] Hover effects work on cards
- [ ] Responsive design works (resize browser)

---

## 3️⃣ Room View Page Testing

### Navigation
- [ ] Click "VIEW DETAILS" on any room from rooms page
- [ ] Navigate to `http://localhost:3000/rooms/1`
- [ ] Page loads successfully

### Content
- [ ] Hero image gallery displays
- [ ] Previous/Next buttons visible
- [ ] Image counter shows (e.g., "1 / 3")
- [ ] Room title displays
- [ ] Room type badge displays
- [ ] Hotel location displays
- [ ] Quick info section shows:
  - [ ] Guest capacity
  - [ ] Room size
  - [ ] Bed type
  - [ ] Price per night
- [ ] "About This Room" description displays
- [ ] Amenities section lists all amenities with checkmarks

### Interactions
- [ ] Click previous button → Shows previous image
- [ ] Click next button → Shows next image
- [ ] Image counter updates correctly
- [ ] Click "Back to Rooms" → Navigates to `/rooms`
- [ ] Click "Book Now" → Navigates to `/book/:id` (or login if not authenticated)
- [ ] If room not available, "Not Available" button is disabled

---

## 4️⃣ Authentication Testing

### Registration
- [ ] Click "REGISTER" in header
- [ ] Navigate to `http://localhost:3000/register`
- [ ] Registration form displays
- [ ] Form fields: Name, Email, Phone, Password
- [ ] Fill in all fields
- [ ] Click "REGISTER" button
- [ ] Success: Redirects to home page
- [ ] User is automatically logged in
- [ ] Header shows "Hello, [Name]" and "LOGOUT" button
- [ ] "MY BOOKINGS" appears in navigation

### Login
- [ ] Logout if logged in
- [ ] Click "LOGIN" in header
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Login form displays
- [ ] Form fields: Email, Password
- [ ] Enter credentials
- [ ] Click "LOGIN" button
- [ ] Success: Redirects to home page
- [ ] User is logged in
- [ ] Header updates with user info

### Logout
- [ ] Click "LOGOUT" button in header
- [ ] User is logged out
- [ ] Header shows "LOGIN" and "REGISTER" buttons
- [ ] "MY BOOKINGS" disappears from navigation
- [ ] Stays on current page

### Protected Route Access
- [ ] Logout if logged in
- [ ] Try to access `http://localhost:3000/bookings`
- [ ] Should redirect to login page
- [ ] Try to access `http://localhost:3000/book/1`
- [ ] Should redirect to login page

---

## 5️⃣ Booking Flow Testing

### Prerequisites
- [ ] User is logged in
- [ ] Navigate to rooms page

### Booking from Rooms List
- [ ] Click "BOOK NOW" on an available room
- [ ] Navigate to `http://localhost:3000/book/:id`
- [ ] Booking page loads

### Booking from Room View
- [ ] Click "VIEW DETAILS" on a room
- [ ] On room view page, click "Book Now"
- [ ] Navigate to `http://localhost:3000/book/:id`
- [ ] Booking page loads

### Booking Page Content
- [ ] Page title "Complete Your Booking" displays
- [ ] "Back to Room Details" button visible
- [ ] Booking form displays with:
  - [ ] Check-in date picker
  - [ ] Check-out date picker
  - [ ] Number of guests dropdown
  - [ ] "Confirm Booking" button
- [ ] Booking summary displays with:
  - [ ] Room thumbnail image
  - [ ] Room title and type
  - [ ] Hotel name
  - [ ] Check-in date
  - [ ] Check-out date
  - [ ] Number of guests
  - [ ] Number of nights
  - [ ] Price breakdown
  - [ ] Total price

### Booking Form Interactions
- [ ] Select check-in date (today or future)
- [ ] Select check-out date (after check-in)
- [ ] Number of nights calculates automatically
- [ ] Select number of guests
- [ ] Total price updates correctly
- [ ] Click "Confirm Booking"
- [ ] Success message appears
- [ ] Redirects to `/bookings`

### Booking Validation
- [ ] Try to submit without dates → Shows error
- [ ] Try to select check-out before check-in → Shows error
- [ ] Try to select past dates → Prevented by date picker

---

## 6️⃣ My Bookings Page Testing

### Prerequisites
- [ ] User is logged in
- [ ] User has at least one booking

### Navigation
- [ ] Click "MY BOOKINGS" in header
- [ ] Navigate to `http://localhost:3000/bookings`
- [ ] Page loads successfully

### Content
- [ ] Page title "My Bookings" displays
- [ ] All user bookings display
- [ ] Each booking shows:
  - [ ] Room image
  - [ ] Room title
  - [ ] Hotel name and location
  - [ ] Check-in date
  - [ ] Check-out date
  - [ ] Number of nights
  - [ ] Total price
  - [ ] Booking status
  - [ ] Booking date
  - [ ] "Cancel Booking" button (if not cancelled)

### Interactions
- [ ] Click "Cancel Booking" on a confirmed booking
- [ ] Confirmation prompt appears
- [ ] Confirm cancellation
- [ ] Booking status updates to "Cancelled"
- [ ] "Cancel Booking" button disappears
- [ ] Success message appears

### Empty State
- [ ] If no bookings, shows "No bookings yet" message
- [ ] Shows "Browse Rooms" button
- [ ] Click button → Navigates to `/rooms`

---

## 7️⃣ Admin Features Testing

### Prerequisites
- [ ] Register/Login with email containing "admin" (e.g., `admin@test.com`)

### Admin Navigation
- [ ] After login, "ADMIN" appears in header
- [ ] "AI ANALYTICS" appears in header
- [ ] Click "ADMIN" → Navigates to `/admin`
- [ ] Click "AI ANALYTICS" → Navigates to `/ai-analytics`

### Admin Dashboard
- [ ] Navigate to `http://localhost:3000/admin`
- [ ] Dashboard displays
- [ ] Statistics cards show:
  - [ ] Total bookings
  - [ ] Total revenue
  - [ ] Active users
  - [ ] Available rooms
- [ ] Recent bookings table displays
- [ ] Room management section displays

### AI Analytics
- [ ] Navigate to `http://localhost:3000/ai-analytics`
- [ ] Analytics page displays
- [ ] AI insights and charts display
- [ ] Recommendation statistics show

### Non-Admin Access
- [ ] Logout
- [ ] Login with regular user (no "admin" in email)
- [ ] "ADMIN" and "AI ANALYTICS" should NOT appear in header
- [ ] Try to access `/admin` directly → Should be blocked
- [ ] Try to access `/ai-analytics` directly → Should be blocked

---

## 8️⃣ Theme Testing

### Light/Dark Mode
- [ ] Click theme toggle (🌙) in header
- [ ] Theme changes to dark mode
- [ ] Icon changes to (☀️)
- [ ] All pages use dark theme
- [ ] Navigate to different pages → Theme persists
- [ ] Click theme toggle again → Returns to light mode
- [ ] Refresh page → Theme preference persists

### Theme Consistency
- [ ] Check all pages in light mode
- [ ] Check all pages in dark mode
- [ ] Verify colors are readable
- [ ] Verify contrast is sufficient
- [ ] Verify images display correctly

---

## 9️⃣ Responsive Design Testing

### Desktop (1920x1080)
- [ ] All pages display correctly
- [ ] Navigation is horizontal
- [ ] Filters sidebar is visible
- [ ] Room grid shows 3 columns
- [ ] Images are full size

### Tablet (768x1024)
- [ ] All pages display correctly
- [ ] Navigation adapts
- [ ] Room grid shows 2 columns
- [ ] Filters sidebar collapses
- [ ] Mobile filter button appears

### Mobile (375x667)
- [ ] All pages display correctly
- [ ] Navigation becomes hamburger menu (if implemented)
- [ ] Room grid shows 1 column
- [ ] Filters are in modal/drawer
- [ ] Buttons are touch-friendly
- [ ] Text is readable
- [ ] Images scale properly

---

## 🔟 API Testing

### Public Endpoints
- [ ] `GET http://localhost:5000/` → Returns API info
- [ ] `GET http://localhost:5000/api/health` → Returns health status
- [ ] `GET http://localhost:5000/api/hotels` → Returns hotels list
- [ ] `GET http://localhost:5000/api/rooms` → Returns rooms list
- [ ] `GET http://localhost:5000/api/rooms/1` → Returns room details
- [ ] `GET http://localhost:5000/api/attractions` → Returns attractions
- [ ] `GET http://localhost:5000/api/recommendations` → Returns recommendations

### Authentication Endpoints
- [ ] `POST http://localhost:5000/api/auth/register` → Creates user
- [ ] `POST http://localhost:5000/api/auth/login` → Returns token

### Protected Endpoints (Requires Token)
- [ ] `POST http://localhost:5000/api/bookings` → Creates booking
- [ ] `GET http://localhost:5000/api/bookings/my-bookings` → Returns user bookings
- [ ] `PATCH http://localhost:5000/api/bookings/:id/cancel` → Cancels booking

---

## 1️⃣1️⃣ Error Handling Testing

### Network Errors
- [ ] Stop backend server
- [ ] Try to load rooms page → Shows error message
- [ ] Try to submit booking → Shows error message
- [ ] Start backend server → App recovers

### Invalid Data
- [ ] Try to access non-existent room `/rooms/999` → Shows "Room not found"
- [ ] Try to access non-existent booking → Shows error
- [ ] Submit booking with invalid dates → Shows validation error

### Authentication Errors
- [ ] Try to login with wrong password → Shows error message
- [ ] Try to register with existing email → Shows error message
- [ ] Try to access protected route without login → Redirects to login

---

## 1️⃣2️⃣ Performance Testing

### Load Times
- [ ] Home page loads in < 2 seconds
- [ ] Rooms page loads in < 2 seconds
- [ ] Room details page loads in < 2 seconds
- [ ] Booking page loads in < 2 seconds

### Interactions
- [ ] Navigation is instant
- [ ] Filter changes update quickly
- [ ] Form submissions are responsive
- [ ] Image gallery transitions are smooth

---

## 1️⃣3️⃣ Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Safari (if available)
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

---

## 🎯 Final Verification

### Complete User Journey
1. [ ] Open home page
2. [ ] Browse AI recommendations
3. [ ] Click "EXPLORE ROOMS"
4. [ ] Apply filters
5. [ ] View room details
6. [ ] Register new account
7. [ ] Book a room
8. [ ] View booking in "My Bookings"
9. [ ] Cancel booking
10. [ ] Logout
11. [ ] Login again
12. [ ] Verify booking history persists

### Admin Journey
1. [ ] Register with admin email
2. [ ] Access admin dashboard
3. [ ] View AI analytics
4. [ ] Verify admin features work
5. [ ] Logout

---

## ✅ Testing Complete!

**Date Tested:** _______________  
**Tested By:** _______________  
**Browser:** _______________  
**OS:** _______________

**Overall Status:** 
- [ ] ✅ All tests passed
- [ ] ⚠️ Some issues found (document below)
- [ ] ❌ Major issues found (document below)

**Issues Found:**
```
(List any issues discovered during testing)
```

**Notes:**
```
(Additional observations or comments)
```

---

## 🚀 Quick Test Commands

```bash
# Start both servers
npm run dev

# Test backend routes
.\test-routes.bat

# View database
npm run prisma:studio

# Check backend logs
# (View terminal running backend)

# Check frontend logs
# (View browser console)
```

---

**Last Updated:** November 1, 2025
