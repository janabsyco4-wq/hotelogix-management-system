# Room Images Fix - MyBookings Page

## Issue
Room images were not showing in the MyBookings page for room bookings.

## Root Cause
The `/api/bookings/my-bookings` endpoint was returning room data with JSON strings for the `images` and `amenities` fields, but NOT parsing them like the other API routes do.

### Example of the Problem:

**Other routes (restaurants, deals, packages):**
```javascript
// They parse JSON before sending
const restaurantsWithParsedData = restaurants.map(restaurant => ({
  ...restaurant,
  images: JSON.parse(restaurant.images || '[]'),  // ✅ Parsed
  // ...
}));
```

**Bookings route (BEFORE fix):**
```javascript
// It was NOT parsing JSON
const bookings = await prisma.booking.findMany({
  where: { userId },
  include: { room: true }
});

res.json(bookings);  // ❌ Room images still as JSON string
```

This meant the frontend received:
```javascript
{
  id: 1,
  room: {
    images: "[\"https://...\", \"https://...\"]",  // ❌ JSON string
    amenities: "[\"WiFi\", \"TV\"]"                 // ❌ JSON string
  }
}
```

Instead of:
```javascript
{
  id: 1,
  room: {
    images: ["https://...", "https://..."],  // ✅ Array
    amenities: ["WiFi", "TV"]                 // ✅ Array
  }
}
```

## Solution Applied

Updated `server/routes/bookings.js` to parse JSON fields before sending responses.

### 1. Fixed GET /api/bookings/my-bookings

```javascript
// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });

    // ✅ Parse JSON fields in room data
    const bookingsWithParsedData = bookings.map(booking => ({
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]'),
        amenities: JSON.parse(booking.room.amenities || '[]')
      }
    }));

    res.json(bookingsWithParsedData);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
```

### 2. Fixed GET /api/bookings/:id

```javascript
// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(id), userId },
      include: {
        room: true,
        user: { select: { name: true, email: true, phone: true } }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // ✅ Parse JSON fields in room data
    const bookingWithParsedData = {
      ...booking,
      room: {
        ...booking.room,
        images: JSON.parse(booking.room.images || '[]'),
        amenities: JSON.parse(booking.room.amenities || '[]')
      }
    };

    res.json(bookingWithParsedData);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});
```

### 3. Fixed POST /api/bookings (Create Booking)

```javascript
// Create booking
const booking = await prisma.booking.create({
  data: {
    userId,
    roomId: parseInt(roomId),
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    status: 'confirmed'
  },
  include: {
    room: true,
    user: { select: { name: true, email: true, phone: true } }
  }
});

// ✅ Parse JSON fields in room data
const bookingWithParsedData = {
  ...booking,
  room: {
    ...booking.room,
    images: JSON.parse(booking.room.images || '[]'),
    amenities: JSON.parse(booking.room.amenities || '[]')
  }
};

res.status(201).json(bookingWithParsedData);
```

## Why This Works

Now the backend API returns room data in the same format as other routes:

```javascript
// Frontend receives this:
{
  id: 1,
  userId: 1,
  roomId: 1,
  checkIn: "2025-11-15T00:00:00.000Z",
  checkOut: "2025-11-17T00:00:00.000Z",
  totalPrice: 299.98,
  status: "confirmed",
  room: {
    id: 1,
    title: "Deluxe Suite",
    images: [                              // ✅ Already an array!
      "https://images.unsplash.com/...",
      "https://images.unsplash.com/..."
    ],
    amenities: [                           // ✅ Already an array!
      "WiFi",
      "TV",
      "Mini Bar"
    ]
  }
}
```

The frontend code in MyBookings.js can now access images directly:

```javascript
// This now works correctly:
<img src={booking.room.images?.[0] || ''} alt={booking.room.title} />
```

## Consistency Across All Routes

Now ALL API routes parse JSON fields consistently:

| Route | Parses JSON? |
|-------|-------------|
| `/api/rooms` | ✅ Yes |
| `/api/restaurants` | ✅ Yes |
| `/api/deals` | ✅ Yes |
| `/api/packages` | ✅ Yes |
| `/api/bookings` | ✅ Yes (NOW FIXED) |

## Testing

### Test Room Images Display

1. **Login** to the application
2. **Book a room** from /rooms page
3. **Navigate** to /my-bookings
4. **Verify** room image displays correctly
5. **Check** browser console for no errors

### Test API Response

```bash
# Get bookings (requires auth token)
curl http://localhost:5000/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response should have parsed arrays:
{
  "id": 1,
  "room": {
    "images": ["https://...", "https://..."],  // ✅ Array, not string
    "amenities": ["WiFi", "TV"]                 // ✅ Array, not string
  }
}
```

## Files Modified

✅ `server/routes/bookings.js`
- Added JSON parsing to GET /my-bookings
- Added JSON parsing to GET /:id
- Added JSON parsing to POST / (create booking)

## Status

✅ **FIXED** - Room images now display correctly in MyBookings page
✅ Backend restarted with changes
✅ All booking endpoints now parse JSON consistently
✅ Ready for testing

---

*Last Updated: November 1, 2025*
