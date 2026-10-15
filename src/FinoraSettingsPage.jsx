import React, { useState, useEffect } from 'react';
import './FinoraSettingsPage.css';
import { authService } from './services/authService';

/**
 * Screen 14 — Profile & Settings Page React Component
 * Full-stack personal finance application: Finora
 * Tagline: "Track. Plan. Save. Grow."
 */
export default function FinoraSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Form State initialized dynamically from stored session
  const [profile, setProfile] = useState(() => {
    const u = authService.getCurrentUser() || {};
    return {
      fullName: u.name || '',
      displayName: u.displayName || u.name || '',
      email: u.email || '',
      phoneCode: u.phoneCountry || '+91',
      phoneNumber: u.phone || '',
      dob: u.dob || '',
      country: u.country || 'India',
      language: u.language || 'en-IN',
      about: u.bio || '',
      avatar: u.avatar || ''
    };
  });

  // Regional Preferences State
  const [preferences, setPreferences] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    timeZone: 'Asia/Kolkata',
    showCents: true,
    compactNumbers: false,
    hideBalances: false,
    confirmDelete: true
  });

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Appearance State
  const [theme, setTheme] = useState('light');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Fetch latest user info from server
    authService.getMe()
      .then((res) => {
        const u = res.user || res.data;
        if (u) {
          setProfile({
            fullName: u.name || '',
            displayName: u.displayName || u.name || '',
            email: u.email || '',
            phoneCode: u.phoneCountry || '+91',
            phoneNumber: u.phone || '',
            dob: u.dob || '',
            country: u.country || 'India',
            language: u.language || 'en-IN',
            about: u.bio || '',
            avatar: u.avatar || ''
          });
        }
      })
      .catch(() => {});

    // Fetch user settings from server
    authService.getSettings()
      .then((res) => {
        const s = res.settings || res.data;
        if (s) {
          setPreferences((prev) => ({ ...prev, ...s }));
        }
      })
      .catch(() => {});
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateMe({
        name: profile.fullName,
        displayName: profile.displayName,
        phone: profile.phoneNumber,
        bio: profile.about
      });
      if (res.user) {
        setProfile(prev => ({
          ...prev,
          fullName: res.user.name,
          displayName: res.user.displayName,
          phoneNumber: res.user.phone
        }));
      }
      setIsDirty(false);
      showToast('Profile information successfully saved!');
    } catch (err) {
      showToast(err.message || 'Error updating profile.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in both current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className={`finora-settings-container ${theme === 'dark' ? 'theme-dark' : ''}`}>
      
      {/* 1. Sidebar Navigation (220px) */}
      <aside className="finora-settings-sidebar">
        <div>
          <div style={{ padding: '0 20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Finora</h2>
            <span style={{ fontSize: '0.625rem', color: '#C7B8FF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Track. Plan. Save. Grow.
            </span>
          </div>

          <nav className="finora-settings-nav">
            <a href="dashboard.html" className="finora-settings-nav-item">Dashboard</a>
            <a href="transactions.html" className="finora-settings-nav-item">Transactions</a>
            <a href="add-income.html" className="finora-settings-nav-item">Income</a>
            <a href="add-expense.html" className="finora-settings-nav-item">Expenses</a>
            <a href="analytics.html" className="finora-settings-nav-item">Analytics</a>
            <a href="budgets.html" className="finora-settings-nav-item">Budgets</a>
            <a href="goals.html" className="finora-settings-nav-item">Goals</a>
            <a href="categories.html" className="finora-settings-nav-item">Categories</a>
            <a href="recurring.html" className="finora-settings-nav-item">Recurring</a>
            <a href="settings.html" className="finora-settings-nav-item active">Settings</a>
          </nav>
        </div>

        <div style={{ padding: '0 16px' }}>
          <button
            onClick={() => authService.logout()}
            style={{ background: 'transparent', border: 'none', color: '#FF8F9C', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="finora-settings-main">
        <header className="finora-settings-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Dashboard / Settings</div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '2px 0 0 0' }}>Profile & Settings</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{profile.fullName || 'User'}</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#7957FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8125rem', overflow: 'hidden' }}>
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.fullName || 'User'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{(profile.fullName || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>
        </header>

        <div className="finora-settings-content">
          
          {/* Unsaved Changes Banner */}
          {isDirty && (
            <div style={{ background: '#FFF9E6', border: '1px solid #F5B544', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#925C03', fontSize: '0.875rem' }}>You have unsaved changes in your settings.</span>
              <button 
                onClick={handleProfileSave}
                style={{ background: '#7957FF', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          )}

          <div className="finora-settings-grid">
            
            {/* Left Vertical Tab Navigation */}
            <div className="finora-settings-tabs-card">
              <button 
                className={`finora-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                My Profile
              </button>
              <button 
                className={`finora-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
              <button 
                className={`finora-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button 
                className={`finora-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </button>
              <button 
                className={`finora-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account Management
              </button>
            </div>

            {/* Right Panel Content */}
            <div className="finora-settings-panel-content">
              {activeTab === 'profile' && (
                <div className="finora-panel-card">
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px 0' }}>Personal Information</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '20px' }}>Keep your account details up to date.</p>

                  <form onSubmit={handleProfileSave}>
                    <div className="finora-input-group">
                      <label className="finora-input-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="finora-input-text" 
                        value={profile.fullName}
                        onChange={(e) => { setProfile({ ...profile, fullName: e.target.value }); setIsDirty(true); }}
                        required
                      />
                    </div>

                    <div className="finora-input-group">
                      <label className="finora-input-label">Display Name</label>
                      <input 
                        type="text" 
                        className="finora-input-text" 
                        value={profile.displayName}
                        onChange={(e) => { setProfile({ ...profile, displayName: e.target.value }); setIsDirty(true); }}
                      />
                    </div>

                    <div className="finora-input-group">
                      <label className="finora-input-label">Email Address</label>
                      <input 
                        type="email" 
                        className="finora-input-text" 
                        value={profile.email} 
                        readOnly
                      />
                    </div>

                    <div className="finora-input-group">
                      <label className="finora-input-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="finora-input-text" 
                        value={profile.phoneNumber}
                        onChange={(e) => { setProfile({ ...profile, phoneNumber: e.target.value }); setIsDirty(true); }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      style={{ background: '#7957FF', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '12px' }}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="finora-panel-card">
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px 0' }}>Regional & Financial Preferences</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '20px' }}>Personalize how Finora displays your financial information.</p>

                  <div className="finora-input-group">
                    <label className="finora-input-label">Preferred Currency</label>
                    <select 
                      className="finora-input-text" 
                      value={preferences.currency || 'INR'} 
                      disabled
                    >
                      <option value="INR">INR — Indian Rupee (₹) [Standard]</option>
                    </select>
                  </div>

                  <div style={{ background: '#F6F7FC', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Number Format Preview:</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7957FF' }}>₹1,25,450.00</div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="finora-panel-card">
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px 0' }}>Account Security</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '20px' }}>Password and authentication safeguards.</p>

                  <form onSubmit={handlePasswordChange} style={{ marginBottom: '24px' }}>
                    <div className="finora-input-group">
                      <label className="finora-input-label">Current Password</label>
                      <input 
                        type="password" 
                        className="finora-input-text" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current password"
                        required
                      />
                    </div>
                    <div className="finora-input-group">
                      <label className="finora-input-label">New Password (min 8 chars)</label>
                      <input 
                        type="password" 
                        className="finora-input-text" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                      />
                    </div>
                    <div className="finora-input-group">
                      <label className="finora-input-label">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="finora-input-text" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      style={{ background: '#7957FF', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Update Password
                    </button>
                  </form>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F6F7FC', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
                      <div style={{ fontSize: '0.8125rem', color: '#75809A' }}>
                        Status: <strong style={{ color: twoFactorEnabled ? '#23B981' : '#F06575' }}>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</strong>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      style={{ background: twoFactorEnabled ? '#FFFFFF' : '#7957FF', color: twoFactorEnabled ? '#18213D' : '#FFFFFF', border: '1px solid #E8EBF3', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {twoFactorEnabled ? 'Disable 2FA' : 'Configure 2FA'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="finora-panel-card">
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px 0' }}>Appearance & Theme</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '20px' }}>Customize visual aesthetics.</p>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={() => setTheme('light')}
                      style={{ flex: 1, padding: '16px', border: theme === 'light' ? '2px solid #7957FF' : '1px solid #E8EBF3', borderRadius: '12px', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Light Theme
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      style={{ flex: 1, padding: '16px', border: theme === 'dark' ? '2px solid #7957FF' : '1px solid #E8EBF3', borderRadius: '12px', background: '#141A3E', color: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Dark Theme
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="finora-panel-card">
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 4px 0' }}>Account Management</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '20px' }}>Data export and account lifecycle.</p>

                  <button 
                    onClick={() => showToast('Financial export started...')}
                    style={{ background: '#7957FF', color: '#FFFFFF', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Download Financial Data (CSV)
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#11183F', color: '#FFFFFF', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          {toastMessage}
        </div>
      )}

    </div>
  );
}
