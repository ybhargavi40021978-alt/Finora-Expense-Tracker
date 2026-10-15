import React, { useState } from 'react';
import './FinoraLoginPage.css';
import { authService } from './services/authService';

/**
 * FinoraLoginPage — Screen 2: Login Page React Component
 * 
 * Full-screen 46% / 54% split layout:
 * - Left Panel (46%): Dark Navy to Indigo gradient, 3D financial illustration,
 *   brand wordmark & logo, "Better Money Habits, Brighter Future" headline.
 * - Right Panel (54%): Clean white background, centered 400px form,
 *   Email & Password fields with icons, password visibility toggle,
 *   Remember Me checkbox, Forgot Password recovery, primary violet login button,
 *   Google OAuth secondary button, and Register link.
 */
export default function FinoraLoginPage({ onNavigateToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation & feedback state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [alertInfo, setAlertInfo] = useState(null); // { type: 'error' | 'success', message: '' }
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).toLowerCase());

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setAlertInfo(null);

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email address is required.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const res = await authService.login({
        email: email.trim(),
        password
      });

      setIsLoading(false);
      setAlertInfo({
        type: 'success',
        message: 'Welcome back! Authentication successful. Redirecting to Finora Dashboard...'
      });

      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess(res.user), 800);
      } else {
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      }
    } catch (err) {
      setIsLoading(false);
      setAlertInfo({
        type: 'error',
        message: err.message || 'Invalid email or password. Please verify your credentials and try again.'
      });
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setAlertInfo({
        type: 'success',
        message: 'Google authentication successful! Redirecting...'
      });
      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess({ email: 'user@google.com', provider: 'google' }), 1000);
      }
    }, 850);
  };

  return (
    <div className="login-layout-wrapper">
      {/* ===================================================================
          1. LEFT ILLUSTRATION PANEL (~46% width)
          =================================================================== */}
      <aside 
        className="left-panel" 
        onMouseMove={handleMouseMove} 
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      >
        <div className="panel-glow panel-glow-violet" aria-hidden="true" />
        <div className="panel-glow panel-glow-blue" aria-hidden="true" />

        {/* Brand Logo & Wordmark */}
        <div className="panel-top-bar">
          <a href="index.html" className="brand-link">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="2" r="2" fill="#43D9A3" />
              </svg>
            </div>
            <span className="brand-name">Finora</span>
          </a>
        </div>

        {/* Center 3D Illustration & Floating Cards */}
        <div className="panel-illustration-area">
          <div className="illustration-stage">
            <div className="illustration-wrapper">
              <img
                src="assets/finora-login-character.jpg"
                alt="Person managing money with Finora app"
                className="illustration-img"
                style={{
                  transform: `perspective(800px) rotateX(${-(mousePos.y / 250) * 7}deg) rotateY(${(mousePos.x / 250) * 7}deg)`
                }}
              />
            </div>

            {/* Floating Savings Badge */}
            <div
              className="panel-floating-badge badge-growth"
              style={{
                transform: `translate3d(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px, 0)`
              }}
            >
              <div className="badge-icon-mint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#43D9A3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className="badge-text-group">
                <span className="b-sub">Weekly Savings</span>
                <span className="b-main">+$940.00 <strong className="text-mint">+18.5%</strong></span>
              </div>
            </div>

            {/* Vault Badge */}
            <div
              className="panel-floating-badge badge-vault"
              style={{
                transform: `translate3d(${mousePos.x * 0.07}px, ${mousePos.y * 0.07}px, 0)`
              }}
            >
              <span className="vault-dot" />
              <span>256-bit Encrypted Vault</span>
            </div>
          </div>
        </div>

        {/* Supporting Copy */}
        <div className="panel-copy-area">
          <h2 className="panel-headline">
            Better Money Habits,<br />
            Brighter Future
          </h2>
          <p className="panel-tagline">Track. Plan. Save. Grow.</p>
        </div>
      </aside>

      {/* ===================================================================
          2. RIGHT LOGIN PANEL (~54% width, Clean White)
          =================================================================== */}
      <main className="right-panel">
        {/* Mobile Header Bar */}
        <div className="mobile-brand-bar">
          <a href="index.html" className="mobile-brand-link">
            <div className="brand-icon small">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="2" r="2" fill="#43D9A3" />
              </svg>
            </div>
            <span className="brand-name dark">Finora</span>
          </a>
        </div>

        <div className="form-container">
          {/* Welcome Heading */}
          <div className="form-header">
            <h1 className="welcome-heading">Welcome Back!</h1>
            <p className="welcome-subtext">Sign in to your account to continue.</p>
          </div>

          {/* Feedback Alert */}
          {alertInfo && (
            <div className={`alert-banner ${alertInfo.type}`} role="alert">
              <span className="alert-message">{alertInfo.message}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            {/* Decoy trap inputs to disrupt browser autofill popups */}
            <div style={{ opacity: 0, position: 'absolute', top: 0, left: -9999, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }} aria-hidden="true">
              <input type="text" name="trap_user" tabIndex={-1} autoComplete="username" />
              <input type="password" name="trap_pass" tabIndex={-1} autoComplete="current-password" />
            </div>

            {/* Email Field */}
            <div className={`form-group ${emailError ? 'has-error' : ''}`}>
              <label htmlFor="react-email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon leading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="text"
                  inputMode="email"
                  id="react-email"
                  name="react_log_email_noautofill"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                  onTouchStart={(e) => e.target.removeAttribute('readonly')}
                  onBlur={(e) => e.target.setAttribute('readonly', 'readonly')}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  required
                />
              </div>
              {emailError && <span className="field-error">{emailError}</span>}
            </div>

            {/* Password Field */}
            <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
              <label htmlFor="react-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon leading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="react-password"
                  name="react_log_pwd_noautofill"
                  className="form-input has-trailing"
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="new-password"
                  data-lpignore="true"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                  onTouchStart={(e) => e.target.removeAttribute('readonly')}
                  onBlur={(e) => e.target.setAttribute('readonly', 'readonly')}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <span className="field-error">{passwordError}</span>}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="remember-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="custom-checkbox">
                  <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
                    <polyline points="1.5 5 4.5 8 10.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <button
                type="button"
                className="link-forgot-password"
                onClick={() => setShowRecoveryModal(true)}
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Login Button */}
            <button type="submit" className="btn-primary-login" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <span className="btn-text">Login</span>
              )}
            </button>

            {/* Divider */}
            <div className="form-divider" aria-hidden="true">
              <span className="divider-line" />
              <span className="divider-text">or</span>
              <span className="divider-line" />
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              className="btn-google-login"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <span className="btn-spinner" style={{ borderColor: '#7957FF', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  <span className="google-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </span>
                  <span className="google-text">Continue with Google</span>
                </>
              )}
            </button>

            {/* Registration Link */}
            <p className="register-footer">
              Don't have an account?{' '}
              <a 
                href="index.html#signup" 
                className="link-register" 
                onClick={(e) => {
                  if (onNavigateToRegister) {
                    e.preventDefault();
                    onNavigateToRegister();
                  }
                }}
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Password Recovery Flow Modal */}
      {showRecoveryModal && (
        <div className="recovery-modal-backdrop open" onClick={() => setShowRecoveryModal(false)}>
          <div className="recovery-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="recovery-header">
              <div className="recovery-icon-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7957FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="recovery-title">Reset Your Password</h3>
              <p className="recovery-subtitle">Enter your email and we'll send you a password recovery link.</p>
              <button
                type="button"
                className="recovery-close"
                onClick={() => setShowRecoveryModal(false)}
              >
                ✕
              </button>
            </div>
            <form
              className="recovery-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Password reset link sent to ${recoveryEmail}`);
                setShowRecoveryModal(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary-login">Send Reset Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
