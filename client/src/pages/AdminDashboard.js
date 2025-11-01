import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import './AdminDashboard.css';

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
      const diningDeposits = activeReservations.length * 50; // $25 per guest × 2 guests average
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
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
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
                        <td>${room.pricePerNight}</td>
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
                        <td>${deal.dealPrice}</td>
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
                        <td>${pkg.price}</td>
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
                          <td>${booking.totalPrice}</td>
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
                          <td>${pkgBooking.totalPrice}</td>
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
                        <td>{user._count?.bookings || 0}</td>
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
                      <h3>${paymentStats.totalRevenue?.toFixed(2) || '0.00'}</h3>
                      <p>Total Revenue</p>
                      <span className="stat-detail">{paymentStats.totalPaidBookings || 0} paid bookings</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🛏️</div>
                    <div className="stat-info">
                      <h3>${paymentStats.roomRevenue?.toFixed(2) || '0.00'}</h3>
                      <p>Room Bookings</p>
                      <span className="stat-detail">{paymentStats.paidRoomBookings || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <h3>${paymentStats.packageRevenue?.toFixed(2) || '0.00'}</h3>
                      <p>Package Bookings</p>
                      <span className="stat-detail">{paymentStats.paidPackageBookings || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🍽️</div>
                    <div className="stat-info">
                      <h3>${paymentStats.diningDeposits?.toFixed(2) || '0.00'}</h3>
                      <p>Dining Deposits</p>
                      <span className="stat-detail">{paymentStats.paidDiningReservations || 0} paid</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎁</div>
                    <div className="stat-info">
                      <h3>${paymentStats.dealRevenue?.toFixed(2) || '0.00'}</h3>
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
                      <h3>${paymentStats.refundedAmount?.toFixed(2) || '0.00'}</h3>
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
                          amount = item.guests * 25; // $25 per guest
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
                            <td className="amount">${amount.toFixed(2)}</td>
                            <td className="payment-id">{item.paymentIntentId?.substring(0, 20)}...</td>
                            <td>
                              <span className={`badge ${
                                item.status === 'confirmed' ? 'success' : 
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
                      <span className="value">${paymentStats.roomRevenue?.toFixed(2) || '0.00'}</span>
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
                      <span className="value">${paymentStats.packageRevenue?.toFixed(2) || '0.00'}</span>
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
                      <span className="value">${paymentStats.diningDeposits?.toFixed(2) || '0.00'}</span>
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
                      <span className="value">${paymentStats.dealRevenue?.toFixed(2) || '0.00'}</span>
                      <span className="percentage">
                        {((paymentStats.dealRevenue / paymentStats.totalRevenue * 100) || 0).toFixed(1)}%
                      </span>
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
