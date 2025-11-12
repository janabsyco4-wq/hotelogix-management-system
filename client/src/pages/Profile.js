import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import Loading from '../components/Loading';
import './Profile.css';

function Profile() {
  // eslint-disable-next-line no-unused-vars
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileImage: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalDiningReservations: 0,
    totalDealRedemptions: 0,
    totalPackageBookings: 0,
    totalSpent: 0
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [authUser, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
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
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
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
      setIsEditingProfile(false); // Exit edit mode after save
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
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsEditingPassword(false); // Exit edit mode after save
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your profile..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} />
              ) : (
                <span>{profile.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile Information
            </button>
            <button
              className={activeTab === 'password' ? 'active' : ''}
              onClick={() => setActiveTab('password')}
            >
              🔒 Change Password
            </button>
            <button
              className={activeTab === 'stats' ? 'active' : ''}
              onClick={() => setActiveTab('stats')}
            >
              📊 Account Statistics
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                {!isEditingProfile ? (
                  <button 
                    type="button" 
                    className="btn-edit" 
                    onClick={() => setIsEditingProfile(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setIsEditingProfile(false)}
                  >
                    ✖️ Cancel
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                // View Mode
                <div className="profile-view">
                  <div className="info-row">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{profile.name || 'Not set'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email Address:</span>
                    <span className="info-value">{profile.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone Number:</span>
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
                // Edit Mode
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

                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Change Password</h2>
                {!isEditingPassword && (
                  <button 
                    type="button" 
                    className="btn-edit" 
                    onClick={() => setIsEditingPassword(true)}
                  >
                    🔒 Change Password
                  </button>
                )}
              </div>

              {!isEditingPassword ? (
                // View Mode
                <div className="profile-view">
                  <div className="info-row">
                    <span className="info-label">Password:</span>
                    <span className="info-value">••••••••</span>
                  </div>
                  <p className="info-note">Click "Change Password" button above to update your password</p>
                </div>
              ) : (
                // Edit Mode
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

                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="profile-section">
              <h2>Account Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🛏️</div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings || 0}</h3>
                    <p>Room Bookings</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-info">
                    <h3>{stats.totalDiningReservations || 0}</h3>
                    <p>Dining Reservations</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎁</div>
                  <div className="stat-info">
                    <h3>{stats.totalDealRedemptions || 0}</h3>
                    <p>Deals Redeemed</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.totalPackageBookings || 0}</h3>
                    <p>Package Bookings</p>
                  </div>
                </div>

                <div className="stat-card highlight">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>₨{stats.totalSpent?.toLocaleString('en-PK', {minimumFractionDigits: 0}) || '0.00'}</h3>
                    <p>Total Spent</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <button onClick={() => navigate('/my-bookings')} className="action-btn">
                  📋 View My Bookings
                </button>
                <button onClick={() => navigate('/rooms')} className="action-btn">
                  🏨 Browse Rooms
                </button>
                <button onClick={() => navigate('/dining')} className="action-btn">
                  🍽️ Make Reservation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
