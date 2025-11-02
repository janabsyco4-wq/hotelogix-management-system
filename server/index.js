const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://hotelogix-management-system.vercel.app',
  'https://hotelogix-management-system-entl69r3b-shehrooz-hafeezs-projects.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

// Add explicit CORS headers before cors middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now during development
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/attractions', require('./routes/attractions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/reviews', require('./routes/reviews'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Hotelogix API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      rooms: '/api/rooms',
      attractions: '/api/attractions',
      auth: '/api/auth',
      bookings: '/api/bookings',
      restaurants: '/api/restaurants',
      deals: '/api/deals',
      packages: '/api/packages',
      recommendations: '/api/recommendations'
    }
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: '🏨 Welcome to Stoney Creek Resort API',
    version: '1.0.0',
    status: 'operational',
    documentation: 'https://github.com/your-repo/api-docs',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      rooms: {
        list: 'GET /api/rooms',
        details: 'GET /api/rooms/:id',
        availability: 'GET /api/rooms/:id/availability'
      },
      restaurants: {
        list: 'GET /api/restaurants',
        details: 'GET /api/restaurants/:id',
        reserve: 'POST /api/restaurants/reservations'
      },
      deals: {
        list: 'GET /api/deals',
        details: 'GET /api/deals/:id',
        redeem: 'POST /api/deals/:id/redeem'
      },
      packages: {
        list: 'GET /api/packages',
        details: 'GET /api/packages/:id',
        book: 'POST /api/packages/:id/book'
      },
      bookings: {
        create: 'POST /api/bookings',
        myBookings: 'GET /api/bookings/my-bookings'
      },
      recommendations: {
        rooms: 'GET /api/recommendations/rooms',
        pricing: 'GET /api/recommendations/pricing/:roomId'
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard',
        bookings: 'GET /api/admin/bookings',
        users: 'GET /api/admin/users'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'Hotelogix API is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});