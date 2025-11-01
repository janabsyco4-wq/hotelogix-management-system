# Hotelogix - Full Stack Hotel Management System

A complete full-stack hotel management and booking system built with React, Node.js, Express, and Prisma with SQLite database.

## 🚀 Features

### Frontend (React)
- **Responsive Design**: Mobile-first approach with modern UI
- **User Authentication**: Login/Register with JWT tokens
- **Hotel Browsing**: View available hotels and rooms
- **Booking System**: Make and manage reservations
- **Attractions Carousel**: Interactive showcase of local attractions
- **Real-time Updates**: Dynamic content loading

### Backend (Node.js + Express)
- **RESTful API**: Clean API endpoints for all operations
- **Authentication**: JWT-based user authentication
- **Database Integration**: Prisma ORM with SQLite
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing

### Database (SQLite + Prisma)
- **User Management**: User profiles and authentication
- **Hotel System**: Hotels, rooms, and availability
- **Booking Management**: Reservations and status tracking
- **Attractions**: Local points of interest
- **Relationships**: Proper foreign key relationships

## 📁 Project Structure

```
stoney-creek-fullstack/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Database seeding
├── package.json           # Root package.json
├── .env                   # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
node prisma/seed.js
```

### 3. Environment Variables

The `.env` file is already configured with default values:
- Database: SQLite (file:./dev.db)
- JWT Secret: Change in production
- Server Port: 5000
- Client URL: http://localhost:3000

### 4. Start the Application

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `GET /api/hotels/:id/rooms/available` - Get available rooms

### Bookings
- `POST /api/bookings` - Create new booking (auth required)
- `GET /api/bookings/my-bookings` - Get user's bookings (auth required)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (auth required)

### Attractions
- `GET /api/attractions` - Get all attractions
- `GET /api/attractions/:id` - Get attraction by ID

## 🎯 Usage

### For Users
1. **Browse Hotels**: Visit the homepage to see available hotels
2. **Register/Login**: Create an account or sign in
3. **Make Bookings**: Select dates and room types
4. **Manage Bookings**: View and cancel reservations

### For Development
1. **Database Management**: Use `npx prisma studio` to view/edit data
2. **API Testing**: Backend runs on http://localhost:5000
3. **Frontend Development**: React app runs on http://localhost:3000

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio

# Production
npm run build        # Build React app for production
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token sent with authenticated requests
4. Protected routes require valid token

## 🗄️ Database Schema

### Key Models
- **User**: User profiles and authentication
- **Hotel**: Hotel information and amenities
- **Room**: Individual rooms with pricing
- **Booking**: Reservations linking users to rooms
- **Attraction**: Local points of interest

## 🚀 Deployment

### Frontend (React)
- Build: `cd client && npm run build`
- Deploy to Netlify, Vercel, or similar

### Backend (Node.js)
- Deploy to Heroku, Railway, or similar
- Update DATABASE_URL for production database

### Database
- For production, switch from SQLite to PostgreSQL
- Update `prisma/schema.prisma` datasource

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure database is properly seeded
4. Check that both frontend and backend are running

---

**Built with ❤️ using React, Node.js, and Prisma**