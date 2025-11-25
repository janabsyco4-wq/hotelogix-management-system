import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import './mobile-responsive.css';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomView from './pages/RoomView';
import BookRoom from './pages/BookRoom';
import Bookings from './pages/Bookings';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import AIAnalytics from './pages/AIAnalytics';
import SmartRoomFinder from './pages/SmartRoomFinder';
import ProcessRefund from './pages/ProcessRefund';
import CancelBooking from './pages/CancelBooking';
import Dining from './pages/Dining';
import Deals from './pages/Deals';
import Packages from './pages/Packages';
import RestaurantView from './pages/RestaurantView';
import ReserveTable from './pages/ReserveTable';
import DealView from './pages/DealView';
import RedeemDeal from './pages/RedeemDeal';
import PackageView from './pages/PackageView';
import BookPackage from './pages/BookPackage';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Hide header on login and register pages
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <Chatbot />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomView />} />
          <Route path="/book/:id" element={<BookRoom />} />
          <Route path="/smart-finder" element={<SmartRoomFinder />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/restaurants/:id" element={<RestaurantView />} />
          <Route path="/restaurants/:id/reserve" element={<ReserveTable />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealView />} />
          <Route path="/deals/:id/redeem" element={<RedeemDeal />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageView />} />
          <Route path="/packages/:id/book" element={<BookPackage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {user && (
            <>
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/cancel-booking/:id" element={<CancelBooking />} />
              <Route path="/profile" element={<Profile />} />
              {user.email.includes('admin') && (
                <>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/notifications" element={<Notifications />} />
                  <Route path="/admin/refund/:id" element={<ProcessRefund />} />
                  <Route path="/ai-analytics" element={<AIAnalytics />} />
                </>
              )}
            </>
          )}
        </Routes>
      </main>
      {!hideHeader && <Footer />}
    </div>
  );
}

export default App;