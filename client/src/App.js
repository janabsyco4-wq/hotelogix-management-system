import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomView from './pages/RoomView';
import BookRoom from './pages/BookRoom';
import Bookings from './pages/Bookings';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AIAnalytics from './pages/AIAnalytics';
import SmartRoomFinder from './pages/SmartRoomFinder';
import ProcessRefund from './pages/ProcessRefund';
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
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {user && (
            <>
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
              {user.email.includes('admin') && (
                <>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/refund/:id" element={<ProcessRefund />} />
                  <Route path="/ai-analytics" element={<AIAnalytics />} />
                </>
              )}
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;