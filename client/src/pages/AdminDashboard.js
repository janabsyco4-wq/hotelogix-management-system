import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './AdminDashboard.css';
import '../pages/Profile.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');

  // Data states
  const [stats, setStats] = useState({});
  const [rooms, setRooms] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [deals, setDeals] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  
  // Profile states
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileImage: ''
  });
  const [profileStats, setProfileStats] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    console.log('AdminDashboard mounted, user:', user);

    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.email.includes('admin') && user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }

    console.log('Fetching admin data...');
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Add auth token to requests
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      // Helper function to add delay between requests (ngrok free tier workaround)
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      // Fetch data sequentially with delays to avoid ngrok rate limits
      const roomsRes = await axios.get('/api/rooms', config).catch(() => ({ data: [] }));
      await delay(300);

      const restaurantsRes = await axios.get('/api/restaurants', config).catch(() => ({ data: [] }));
      await delay(300);

      const dealsRes = await axios.get('/api/deals', config).catch(() => ({ data: [] }));
      await delay(300);

      const packagesRes = await axios.get('/api/packages', config).catch(() => ({ data: [] }));
      await delay(300);

      const bookingsRes = await axios.get('/api/admin/bookings', config).catch(() => ({ data: [] }));
      await delay(300);

      const usersRes = await axios.get('/api/admin/users', config).catch(() => ({ data: [] }));
      await delay(300);

      const reservationsRes = await axios.get('/api/admin/reservations', config).catch(() => ({ data: [] }));
      await delay(300);

      const redemptionsRes = await axios.get('/api/admin/redemptions', config).catch(() => ({ data: [] }));
      await delay(300);

      const packageBookingsRes = await axios.get('/api/admin/package-bookings', config).catch(() => ({ data: [] }));

      console.log('=== ADMIN DASHBOARD DATA ===');
      console.log('Rooms:', roomsRes.data.length);
      console.log('Restaurants:', restaurantsRes.data.length);
      console.log('Deals:', dealsRes.data.length);
      console.log('Packages:', packagesRes.data.length);
      console.log('Bookings:', bookingsRes.data.length);
      console.log('Users:', usersRes.data.length);
      console.log('Reservations:', reservationsRes.data.length);
      console.log('Redemptions:', redemptionsRes.data.length);
      console.log('Package Bookings:', packageBookingsRes.data.length);
      console.log('TOTAL BOOKINGS:', bookingsRes.data.length + reservationsRes.data.length + redemptionsRes.data.length + packageBookingsRes.data.length);

      setRooms(roomsRes.data);
      setRestaurants(restaurantsRes.data);
      setDeals(dealsRes.data);
      setPackages(packagesRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setReservations(reservationsRes.data);
      setRedemptions(redemptionsRes.data);
      setPackageBookings(packageBookingsRes.data);

      // Calculate stats
      setStats({
        totalRooms: roomsRes.data.length,
        availableRooms: roomsRes.data.filter(r => r.isAvailable).length,
        totalRestaurants: restaurantsRes.data.length,
        activeRestaurants: restaurantsRes.data.filter(r => r.isActive).length,
        totalDeals: dealsRes.data.length,
        activeDeals: dealsRes.data.filter(d => d.isActive).length,
        totalPackages: packagesRes.data.length,
        activePackages: packagesRes.data.filter(p => p.isActive).length,
        totalBookings: bookingsRes.data.length,
        pendingBookings: bookingsRes.data.filter(b => b.status === 'pending').length,
        totalReservations: reservationsRes.data.length,
        pendingReservations: reservationsRes.data.filter(r => r.status === 'pending').length,
        totalRedemptions: redemptionsRes.data.length,
        activeRedemptions: redemptionsRes.data.filter(r => r.status === 'active').length,
        totalPackageBookings: packageBookingsRes.data.length,
        pendingPackageBookings: packageBookingsRes.data.filter(p => p.status === 'pending').length,
        totalUsers: usersRes.data.length,
        adminUsers: usersRes.data.filter(u => u.role === 'admin').length,
        allBookingsTotal: bookingsRes.data.length + reservationsRes.data.length + redemptionsRes.data.length + packageBookingsRes.data.length
      });

      // Calculate payment stats
      const paidBookings = bookingsRes.data.filter(b => b.paymentIntentId);
      const paidReservations = reservationsRes.data.filter(r => r.paymentIntentId);
      const paidRedemptions = redemptionsRes.data.filter(r => r.paymentIntentId);
      const paidPackages = packageBookingsRes.data.filter(p => p.paymentIntentId);

      // Filter out refunded/cancelled bookings for revenue calculation
      const activeBookings = paidBookings.filter(b => b.status !== 'refunded' && b.status !== 'cancelled');
      const activeReservations = paidReservations.filter(r => r.status !== 'cancelled');
      const activeRedemptions = paidRedemptions.filter(r => r.status !== 'expired');
      const activePackages = paidPackages.filter(p => p.status !== 'refunded');

      const roomRevenue = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const packageRevenue = activePackages.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
      const diningDeposits = activeReservations.length * 50; // ₨25 per guest × 2 guests average
      const dealRevenue = activeRedemptions.length * 78; // Average deal price

      const refundedBookings = paidBookings.filter(b => b.status === 'refunded' || b.status === 'cancelled');
      const refundedAmount = refundedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setPaymentStats({
        totalRevenue: roomRevenue + packageRevenue + diningDeposits + dealRevenue,
        roomRevenue,
        packageRevenue,
        diningDeposits,
        dealRevenue,
        totalPaidBookings: paidBookings.length + paidReservations.length + paidRedemptions.length + paidPackages.length,
        paidRoomBookings: activeBookings.length,
        paidDiningReservations: activeReservations.length,
        paidDealRedemptions: activeRedemptions.length,
        paidPackageBookings: activePackages.length,
        refundedBookings: refundedBookings.length,
        refundedAmount: refundedAmount,
        unpaidBookings: bookingsRes.data.filter(b => !b.paymentIntentId).length,
        allPaidBookings: [...paidBookings, ...paidReservations, ...paidRedemptions, ...paidPackages]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        city: response.data.city || '',
        country: response.data.country || '',
        profileImage: response.data.profileImage || ''
      });
      setProfileStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      setSaving(true);
      await axios.put('/api/profile', profile);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setSaving(true);
      await axios.put('/api/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsEditingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Load profile when profile tab is active
  useEffect(() => {
    if (activeTab === 'profile' && !profile.email) {
      fetchProfile();
    }
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRefundClick = (booking) => {
    navigate(`/admin/refund/${booking.id}`, { state: { booking } });
  };

  if (loading) {
    return <Loading message="Loading admin dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="hero-decoration">
          <div className="float-element float-1"></div>
          <div className="float-element float-2"></div>
          <div className="float-element float-3"></div>
          <div className="float-element float-4"></div>
        </div>
        <div className="container">
          <h1>🛠️ Admin Dashboard</h1>
          <p>Manage your hotel system</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav">
        <div className="container">
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              🛏️ Rooms ({rooms.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveTab('restaurants')}
            >
              🍽️ Restaurants ({restaurants.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
              onClick={() => setActiveTab('deals')}
            >
              🎁 Deals ({deals.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveTab('packages')}
            >
              📦 Packages ({packages.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              📋 Bookings ({bookings.length + reservations.length + redemptions.length + packageBookings.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users ({users.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              💳 Payments
            </button>
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Admin Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="container">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>System Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🛏️</div>
                  <div className="stat-info">
                    <h3>{stats.totalRooms}</h3>
                    <p>Total Rooms</p>
                    <span className="stat-detail">{stats.availableRooms} available</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-info">
                    <h3>{stats.totalRestaurants}</h3>
                    <p>Restaurants</p>
                    <span className="stat-detail">{stats.activeRestaurants} active</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎁</div>
                  <div className="stat-info">
                    <h3>{stats.totalDeals}</h3>
                    <p>Deals</p>
                    <span className="stat-detail">{stats.activeDeals} active</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.totalPackages}</h3>
                    <p>Packages</p>
                    <span className="stat-detail">{stats.activePackages} active</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛏️</div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings}</h3>
                    <p>Room Bookings</p>
                    <span className="stat-detail">{stats.pendingBookings} pending</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-info">
                    <h3>{stats.totalReservations}</h3>
                    <p>Dining Reservations</p>
                    <span className="stat-detail">{stats.pendingReservations} pending</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎁</div>
                  <div className="stat-info">
                    <h3>{stats.totalRedemptions}</h3>
                    <p>Deal Redemptions</p>
                    <span className="stat-detail">{stats.activeRedemptions} active</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.totalPackageBookings}</h3>
                    <p>Package Bookings</p>
                    <span className="stat-detail">{stats.pendingPackageBookings} pending</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                    <span className="stat-detail">{stats.adminUsers} admins</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-info">
                    <h3>{stats.allBookingsTotal}</h3>
                    <p>All Bookings</p>
                    <span className="stat-detail">Combined total</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Manage Rooms</h2>
                <button className="btn btn-primary">+ Add New Room</button>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Price/Night</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id}>
                        <td>#{room.id}</td>
                        <td>{room.title}</td>
                        <td>{room.type}</td>
                        <td>{room.location}</td>
                        <td>₨{room.pricePerNight.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                        <td>{room.capacity}</td>
                        <td>
                          <span className={`badge ${room.isAvailable ? 'success' : 'danger'}`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Edit">✏️</button>
                          <button className="btn-icon" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Restaurants Tab */}
          {activeTab === 'restaurants' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Manage Restaurants</h2>
                <button className="btn btn-primary">+ Add New Restaurant</button>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Cuisine</th>
                      <th>Location</th>
                      <th>Price Range</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map(restaurant => (
                      <tr key={restaurant.id}>
                        <td>#{restaurant.id}</td>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.cuisine}</td>
                        <td>{restaurant.location}</td>
                        <td>{restaurant.priceRange}</td>
                        <td>⭐ {restaurant.rating}</td>
                        <td>
                          <span className={`badge ${restaurant.isActive ? 'success' : 'danger'}`}>
                            {restaurant.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Edit">✏️</button>
                          <button className="btn-icon" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deals Tab */}
          {activeTab === 'deals' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Manage Deals</h2>
                <button className="btn btn-primary">+ Add New Deal</button>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Discount</th>
                      <th>Price</th>
                      <th>Valid Until</th>
                      <th>Redemptions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map(deal => (
                      <tr key={deal.id}>
                        <td>#{deal.id}</td>
                        <td>{deal.title}</td>
                        <td>{deal.type}</td>
                        <td>{deal.discount}%</td>
                        <td>₨{deal.dealPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                        <td>{formatDate(deal.validUntil)}</td>
                        <td>{deal.currentRedemptions}/{deal.maxRedemptions || '∞'}</td>
                        <td>
                          <span className={`badge ${deal.isActive ? 'success' : 'danger'}`}>
                            {deal.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Edit">✏️</button>
                          <button className="btn-icon" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Manage Packages</h2>
                <button className="btn btn-primary">+ Add New Package</button>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Duration</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Inclusions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <tr key={pkg.id}>
                        <td>#{pkg.id}</td>
                        <td>{pkg.name}</td>
                        <td>{pkg.duration}</td>
                        <td>{pkg.location}</td>
                        <td>₨{pkg.price.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                        <td>{pkg.includes?.length || 0} items</td>
                        <td>
                          <span className={`badge ${pkg.isActive ? 'success' : 'danger'}`}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon" title="Edit">✏️</button>
                          <button className="btn-icon" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="tab-content">
              <h2>All Bookings & Reservations (Total: {bookings.length + reservations.length + redemptions.length + packageBookings.length})</h2>

              {/* Room Bookings */}
              <div className="booking-section">
                <h3>🛏️ Room Bookings ({bookings.length})</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Room</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={`room-${booking.id}`}>
                          <td>#{booking.id}</td>
                          <td>{booking.user?.name || 'N/A'}</td>
                          <td>{booking.room?.title || 'N/A'}</td>
                          <td>{formatDate(booking.checkIn)}</td>
                          <td>{formatDate(booking.checkOut)}</td>
                          <td>₨{booking.totalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                          <td>
                            <span className={`badge ${booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>{formatDate(booking.createdAt)}</td>
                          <td>
                            <button className="btn-icon" title="View">👁️</button>
                            {booking.paymentIntentId && booking.status === 'confirmed' && (
                              <button
                                className="btn-icon"
                                title="Refund"
                                onClick={() => {
                                  setActiveTab('payments');
                                  setTimeout(() => handleRefundClick(booking), 100);
                                }}
                              >
                                💸
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dining Reservations */}
              <div className="booking-section">
                <h3>🍽️ Dining Reservations ({reservations.length})</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Restaurant</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Booked On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(reservation => (
                        <tr key={`dining-${reservation.id}`}>
                          <td>#{reservation.id}</td>
                          <td>{reservation.user?.name || 'N/A'}</td>
                          <td>{reservation.restaurant?.name || 'N/A'}</td>
                          <td>{formatDate(reservation.date)}</td>
                          <td>{reservation.time}</td>
                          <td>{reservation.guests}</td>
                          <td>
                            <span className={`badge ${reservation.status === 'confirmed' ? 'success' : reservation.status === 'pending' ? 'warning' : 'danger'}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td>{formatDate(reservation.createdAt)}</td>
                          <td>
                            <button className="btn-icon" title="View">👁️</button>
                            {reservation.paymentIntentId && reservation.status === 'confirmed' && (
                              <button
                                className="btn-icon"
                                title="Refund"
                                onClick={() => {
                                  setActiveTab('payments');
                                  setTimeout(() => handleRefundClick(reservation), 100);
                                }}
                              >
                                💸
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deal Redemptions */}
              <div className="booking-section">
                <h3>🎁 Deal Redemptions ({redemptions.length})</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Deal</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Redeemed</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redemptions.map(redemption => (
                        <tr key={`deal-${redemption.id}`}>
                          <td>#{redemption.id}</td>
                          <td>{redemption.user?.name || 'N/A'}</td>
                          <td>{redemption.deal?.title || 'N/A'}</td>
                          <td>{redemption.redemptionCode}</td>
                          <td>
                            <span className={`badge ${redemption.status === 'used' ? 'success' : redemption.status === 'active' ? 'warning' : 'danger'}`}>
                              {redemption.status}
                            </span>
                          </td>
                          <td>{redemption.redeemedAt ? formatDate(redemption.redeemedAt) : 'Not yet'}</td>
                          <td>{formatDate(redemption.createdAt)}</td>
                          <td>
                            <button className="btn-icon" title="View">👁️</button>
                            {redemption.paymentIntentId && redemption.status === 'active' && (
                              <button
                                className="btn-icon"
                                title="Refund"
                                onClick={() => {
                                  setActiveTab('payments');
                                  setTimeout(() => handleRefundClick(redemption), 100);
                                }}
                              >
                                💸
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Package Bookings */}
              <div className="booking-section">
                <h3>📦 Package Bookings ({packageBookings.length})</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Package</th>
                        <th>Start Date</th>
                        <th>Guests</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Booked On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageBookings.map(pkgBooking => (
                        <tr key={`package-${pkgBooking.id}`}>
                          <td>#{pkgBooking.id}</td>
                          <td>{pkgBooking.user?.name || 'N/A'}</td>
                          <td>{pkgBooking.package?.name || 'N/A'}</td>
                          <td>{formatDate(pkgBooking.startDate)}</td>
                          <td>{pkgBooking.guests}</td>
                          <td>₨{pkgBooking.totalPrice.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                          <td>
                            <span className={`badge ${pkgBooking.status === 'confirmed' ? 'success' : pkgBooking.status === 'pending' ? 'warning' : 'danger'}`}>
                              {pkgBooking.status}
                            </span>
                          </td>
                          <td>{formatDate(pkgBooking.createdAt)}</td>
                          <td>
                            <button className="btn-icon" title="View">👁️</button>
                            {pkgBooking.paymentIntentId && pkgBooking.status === 'confirmed' && (
                              <button
                                className="btn-icon"
                                title="Refund"
                                onClick={() => {
                                  setActiveTab('payments');
                                  setTimeout(() => handleRefundClick(pkgBooking), 100);
                                }}
                              >
                                💸
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Manage Users</h2>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Bookings</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'warning' : 'success'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.totalBookings || 0}
                          {user._count && (
                            <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '5px' }}>
                              (🛏️{user._count.bookings || 0} 🍽️{user._count.reservations || 0} 🎁{user._count.redemptions || 0} 📦{user._count.packageBookings || 0})
                            </span>
                          )}
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button className="btn-icon" title="View Details">👁️</button>
                          <button className="btn-icon" title="Edit">✏️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="tab-content">
              <h2>💳 Payment Analytics & Revenue</h2>

              {/* Revenue Overview */}
              <div className="payment-overview">
                <div className="stats-grid">
                  <div className="stat-card revenue-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.totalRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Total Revenue</p>
                      <span className="stat-detail">{paymentStats.totalPaidBookings || 0} paid bookings</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🛏️</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.roomRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Room Bookings</p>
                      <span className="stat-detail">{paymentStats.paidRoomBookings || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.packageRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Package Bookings</p>
                      <span className="stat-detail">{paymentStats.paidPackageBookings || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🍽️</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.diningDeposits?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Dining Deposits</p>
                      <span className="stat-detail">{paymentStats.paidDiningReservations || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.dealRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Deal Redemptions</p>
                      <span className="stat-detail">{paymentStats.paidDealRedemptions || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                      <h3>{paymentStats.unpaidBookings || 0}</h3>
                      <p>Unpaid Bookings</p>
                      <span className="stat-detail">Requires attention</span>
                    </div>
                  </div>
                  <div className="stat-card refunded-card">
                    <div className="stat-icon">💸</div>
                    <div className="stat-info">
                      <h3>₨{paymentStats.refundedAmount?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</h3>
                      <p>Refunded Amount</p>
                      <span className="stat-detail">{paymentStats.refundedBookings || 0} refunded</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="payment-history">
                <h3>Recent Payment Transactions</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>ID</th>
                        <th>User</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Payment ID</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentStats.allPaidBookings?.slice(0, 20).map((item, idx) => {
                        const isRoom = item.roomId !== undefined;
                        const isDining = item.restaurantId !== undefined;
                        const isDeal = item.dealId !== undefined;
                        const isPackage = item.packageId !== undefined;

                        let type = '📋';
                        let description = 'Booking';
                        let amount = item.totalPrice || 0;

                        if (isRoom) {
                          type = '🛏️';
                          description = `Room: ${item.room?.title || 'N/A'}`;
                        } else if (isDining) {
                          type = '🍽️';
                          description = `Dining: ${item.restaurant?.name || 'N/A'}`;
                          amount = item.guests * 25; // ₨25 per guest
                        } else if (isDeal) {
                          type = '🎁';
                          description = `Deal: ${item.deal?.title || 'N/A'}`;
                          amount = 78; // Average deal price
                        } else if (isPackage) {
                          type = '📦';
                          description = `Package: ${item.package?.name || 'N/A'}`;
                        }

                        return (
                          <tr key={`payment-${idx}`}>
                            <td>{type}</td>
                            <td>#{item.id}</td>
                            <td>{item.user?.email || 'N/A'}</td>
                            <td>{description}</td>
                            <td className="amount">₨{amount.toLocaleString('en-PK', {minimumFractionDigits: 0})}</td>
                            <td className="payment-id">{item.paymentIntentId?.substring(0, 20)}...</td>
                            <td>
                              <span className={`badge ${item.status === 'confirmed' ? 'success' :
                                item.status === 'refunded' ? 'danger' :
                                  item.status === 'cancelled' ? 'danger' :
                                    item.status === 'expired' ? 'danger' :
                                      item.status === 'pending' ? 'warning' : 'success'
                                }`}>
                                {item.status === 'refunded' ? 'Refunded' :
                                  item.status === 'cancelled' ? 'Cancelled' :
                                    item.status === 'expired' ? 'Expired' :
                                      item.status === 'confirmed' ? 'Confirmed' :
                                        item.status === 'active' ? 'Active' :
                                          item.status || 'Paid'}
                              </span>
                            </td>
                            <td>{formatDate(item.createdAt)}</td>
                            <td>
                              <button className="btn-icon" title="View Details">👁️</button>
                              <button
                                className="btn-icon"
                                title="Refund"
                                onClick={() => handleRefundClick({ ...item, amount })}
                              >
                                💸
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="payment-breakdown">
                <h3>Revenue Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill room"
                        style={{ width: `${(paymentStats.roomRevenue / paymentStats.totalRevenue * 100) || 0}%` }}
                      ></div>
                    </div>
                    <div className="breakdown-info">
                      <span className="label">🛏️ Room Bookings</span>
                      <span className="value">₨{paymentStats.roomRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</span>
                      <span className="percentage">
                        {((paymentStats.roomRevenue / paymentStats.totalRevenue * 100) || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill package"
                        style={{ width: `${(paymentStats.packageRevenue / paymentStats.totalRevenue * 100) || 0}%` }}
                      ></div>
                    </div>
                    <div className="breakdown-info">
                      <span className="label">📦 Package Bookings</span>
                      <span className="value">₨{paymentStats.packageRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</span>
                      <span className="percentage">
                        {((paymentStats.packageRevenue / paymentStats.totalRevenue * 100) || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill dining"
                        style={{ width: `${(paymentStats.diningDeposits / paymentStats.totalRevenue * 100) || 0}%` }}
                      ></div>
                    </div>
                    <div className="breakdown-info">
                      <span className="label">🍽️ Dining Deposits</span>
                      <span className="value">₨{paymentStats.diningDeposits?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</span>
                      <span className="percentage">
                        {((paymentStats.diningDeposits / paymentStats.totalRevenue * 100) || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-bar">
                      <div
                        className="bar-fill deal"
                        style={{ width: `${(paymentStats.dealRevenue / paymentStats.totalRevenue * 100) || 0}%` }}
                      ></div>
                    </div>
                    <div className="breakdown-info">
                      <span className="label">🎁 Deal Redemptions</span>
                      <span className="value">₨{paymentStats.dealRevenue?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0'}</span>
                      <span className="percentage">
                        {((paymentStats.dealRevenue / paymentStats.totalRevenue * 100) || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content profile-section">
              <h2>Admin Profile Settings</h2>
              
              <div className="admin-profile-container">
                {/* Profile Info Card */}
                <div className="profile-card">
                  <div className="card-header">
                    <h3>👤 Profile Information</h3>
                    {!isEditingProfile ? (
                      <button type="button" className="btn-edit" onClick={() => setIsEditingProfile(true)}>
                        ✏️ Edit
                      </button>
                    ) : (
                      <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)}>
                        ✖️ Cancel
                      </button>
                    )}
                  </div>

                  {!isEditingProfile ? (
                    <div className="profile-view">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{profile.name || 'Not set'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{profile.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{profile.phone || 'Not set'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{profile.address || 'Not set'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">City:</span>
                        <span className="info-value">{profile.city || 'Not set'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Country:</span>
                        <span className="info-value">{profile.country || 'Not set'}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="disabled-input"
                      />
                      <small>Email cannot be changed</small>
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          placeholder="Lahore"
                        />
                      </div>

                      <div className="form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          value={profile.country}
                          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Password Change Card */}
                <div className="profile-card">
                  <div className="card-header">
                    <h3>🔒 Change Password</h3>
                    {!isEditingPassword && (
                      <button type="button" className="btn-edit" onClick={() => setIsEditingPassword(true)}>
                        🔒 Change
                      </button>
                    )}
                  </div>

                  {!isEditingPassword ? (
                    <div className="profile-view">
                      <div className="info-row">
                        <span className="info-label">Password:</span>
                        <span className="info-value">••••••••</span>
                      </div>
                      <p className="info-note">Click "Change" button to update your password</p>
                    </div>
                  ) : (
                    <div>
                      <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        style={{ marginBottom: '1rem' }}
                      >
                        ✖️ Cancel
                      </button>
                      <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                      <label>Current Password *</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password *</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        minLength="6"
                      />
                      <small>Minimum 6 characters</small>
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password *</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Changing...' : 'Change Password'}
                      </button>
                    </form>
                    </div>
                  )}
                </div>

                {/* Admin Stats Card */}
                <div className="profile-card">
                  <h3>📊 Admin Statistics</h3>
                  <div className="admin-stats-grid">
                    <div className="admin-stat-item">
                      <span className="stat-label">Total Bookings Managed</span>
                      <span className="stat-value">{profileStats.totalBookings || 0}</span>
                    </div>
                    <div className="admin-stat-item">
                      <span className="stat-label">Total Revenue</span>
                      <span className="stat-value">${profileStats.totalSpent?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="admin-stat-item">
                      <span className="stat-label">Role</span>
                      <span className="stat-value badge-admin">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
