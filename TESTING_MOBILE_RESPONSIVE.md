# Testing Mobile Responsive Design

## Quick Start Testing

### 1. Using Chrome DevTools (Recommended)

```bash
# Steps:
1. Open your browser to http://localhost:3000
2. Press F12 to open DevTools
3. Press Ctrl+Shift+M (or Cmd+Shift+M on Mac) to toggle Device Toolbar
4. Select different devices from the dropdown
```

### 2. Test These Screen Sizes

| Device | Width | What to Check |
|--------|-------|---------------|
| iPhone SE | 375px | Smallest screen, everything stacked |
| iPhone 12 Pro | 390px | Standard mobile experience |
| iPad Mini | 768px | Tablet view, 2-column grids |
| iPad Pro | 1024px | Large tablet, some desktop features |
| Desktop | 1280px+ | Full desktop experience |

## Feature Checklist

### ✅ Header Navigation
- [ ] Hamburger menu icon appears on mobile (≤768px)
- [ ] Clicking hamburger opens navigation drawer from left
- [ ] Navigation drawer has all menu items vertically stacked
- [ ] Book Now dropdown works inline (no overlay on mobile)
- [ ] Close button (X) closes the drawer
- [ ] Clicking overlay closes the drawer
- [ ] Logo and auth buttons stay on top row
- [ ] Auth buttons remain compact (LOGIN/REGISTER visible)

### ✅ Home Page
- [ ] Hero section: Image appears below text on mobile
- [ ] Hero buttons stack vertically and take full width
- [ ] Features grid: 3 columns → 1 column on mobile
- [ ] Stats: 4 columns → 2 columns → 1 column
- [ ] Testimonials: 3 columns → 1 column
- [ ] CTA buttons stack vertically

### ✅ Rooms Page
- [ ] Filter button appears on mobile
- [ ] Clicking filter button opens side drawer
- [ ] Room cards: multi-column → 1 column
- [ ] Room details stack properly
- [ ] Action buttons (View / Book) go full width
- [ ] Images scale to container width

### ✅ Smart Room Finder
- [ ] Mode selection buttons stack vertically
- [ ] Voice modal goes full-screen on mobile
- [ ] Question options display in 2 columns → 1 column
- [ ] Filter grid becomes single column
- [ ] Recommendation cards stack single column
- [ ] All buttons full width

### ✅ Booking Page
- [ ] Booking form and summary stack vertically
- [ ] Form inputs full width
- [ ] Date pickers work on mobile
- [ ] Stripe payment form responsive
- [ ] Confirm button full width

### ✅ Forms (Login/Register/Profile)
- [ ] Form fields full width
- [ ] Labels visible and readable
- [ ] Inputs are 16px font (prevents zoom on iOS)
- [ ] Submit buttons full width
- [ ] Error messages visible

### ✅ Admin Dashboard
- [ ] Stats grid: 4 → 2 → 1 columns
- [ ] Tables scroll horizontally
- [ ] Action buttons stack vertically
- [ ] Charts responsive (if any)

### ✅ My Bookings
- [ ] Booking cards stack vertically
- [ ] Images full width
- [ ] Cancel/View buttons full width

### ✅ Footer
- [ ] Footer grid: 4 columns → 2 columns → 1 column
- [ ] Social links centered on mobile
- [ ] Copyright text centered

### ✅ General Elements
- [ ] All buttons minimum 44px tap target
- [ ] Cards stack properly in grids
- [ ] Images don't overflow containers
- [ ] Text is readable (not too small)
- [ ] No horizontal scrolling (except tables)
- [ ] Modals slide up from bottom on mobile
- [ ] Chatbot stays in bottom corner

## Browser Testing

### Desktop Browsers
```bash
✅ Chrome (Latest)
✅ Firefox (Latest)
✅ Edge (Latest)
✅ Safari (if on Mac)
```

### Mobile Browsers (Real Devices)
```bash
✅ Chrome Mobile (Android)
✅ Safari (iOS)
✅ Firefox Mobile
✅ Samsung Internet
```

## Common Issues & Fixes

### Issue: Hamburger menu not showing
**Fix:** Check screen width is ≤768px in DevTools

### Issue: Navigation drawer not opening
**Fix:** Check mobile-responsive.css is imported in index.js

### Issue: Content behind fixed header
**Fix:** Verify body has `padding-top: 60px` on mobile

### Issue: Horizontal scrolling
**Fix:** Check for elements with fixed widths > viewport

### Issue: Buttons not full width
**Fix:** Verify `.btn` has `width: 100%` in media query

### Issue: iOS zoom on input focus
**Fix:** Ensure inputs have `font-size: 16px`

## Performance Testing

```bash
# Chrome DevTools
1. Network tab → Throttling → Slow 3G
2. Performance tab → Record
3. Navigate through pages
4. Check for:
   - Layout shifts
   - Paint times
   - JavaScript execution
```

## Accessibility Testing

```bash
# Keyboard Navigation
- Tab through all elements
- Enter/Space to activate
- Escape to close modals/drawers

# Screen Reader
- Use NVDA (Windows) or VoiceOver (Mac)
- Navigate through pages
- Verify labels are announced
```

## Responsive Images Test

```bash
# Check these pages:
- Home hero image
- Room cards images
- Restaurant images
- Deal/Package images

# Verify:
- Images don't pixelate
- Load appropriate sizes
- Scale properly
```

## Touch Gestures Test (Real Device Only)

```bash
- Swipe to scroll
- Tap buttons/links
- Pinch to zoom (should be disabled)
- Long press (context menus)
```

## Landscape Mode Test

```bash
# Rotate device to landscape
# Check:
- Header still works
- Content doesn't break
- Navigation accessible
```

## Form Testing Checklist

```bash
# Test on mobile:
✅ Login form
✅ Register form
✅ Booking form
✅ Contact form
✅ Search/filter forms
✅ Profile update form

# Verify:
- Inputs large enough to tap
- Virtual keyboard doesn't hide submit button
- Validation messages visible
- Success/error states work
```

## Final Checklist Before Deployment

```bash
1. Test all pages on:
   ✅ iPhone (Safari)
   ✅ Android (Chrome)
   ✅ Tablet (iPad/Android)

2. Verify:
   ✅ No JavaScript errors
   ✅ No CSS layout breaks
   ✅ All images load
   ✅ Forms submit correctly
   ✅ Navigation works
   ✅ Modals/drawers work
   ✅ Chatbot accessible

3. Performance:
   ✅ Lighthouse score > 90
   ✅ Page loads < 3 seconds
   ✅ No layout shift

4. Accessibility:
   ✅ WCAG 2.1 AA compliant
   ✅ Keyboard navigation works
   ✅ Screen reader friendly
```

## Automated Testing (Optional)

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Responsive tests
npm install --save-dev cypress
npx cypress open
```

## Visual Regression Testing (Optional)

```bash
# Install Percy
npm install --save-dev @percy/cli @percy/cypress

# Take snapshots
npx percy snapshot ./build
```

## Report Issues

If you find responsive issues:

1. **Document:**
   - Page URL
   - Screen size
   - Browser/Device
   - Screenshot

2. **Priority:**
   - Critical: Functionality broken
   - High: UX significantly impacted
   - Medium: Minor layout issues
   - Low: Cosmetic only

3. **Fix Location:**
   - Check `mobile-responsive.css` first
   - Then page-specific CSS
   - Use `!important` if needed to override

## Quick Fixes Reference

```css
/* Element too wide */
.element {
  max-width: 100% !important;
  overflow-x: hidden !important;
}

/* Text too small */
.text {
  font-size: 14px !important;
}

/* Buttons not full width */
@media (max-width: 768px) {
  .btn {
    width: 100% !important;
  }
}

/* Grid not responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}

/* Content behind header */
body {
  padding-top: 60px !important;
}
```

---

Happy Testing! 🎉
