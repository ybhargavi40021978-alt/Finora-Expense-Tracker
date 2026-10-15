import React, { useState } from 'react';
import './FinoraRegisterPage.css';
import { authService } from './services/authService';

/**
 * FinoraRegisterPage — Screen 3: Registration Page React Component
 * 
 * Full-screen 46% / 54% split layout:
 * - Left Panel (46%): Dark Navy to Indigo gradient, 3D financial illustration,
 *   brand wordmark & logo, "Start Your Financial Journey" headline.
 * - Right Panel (54%): Clean white background, centered 400px form,
 *   Full Name, Email Address, Password with 4-segment strength meter,
 *   Confirm Password with visibility toggle, Terms & Privacy checkbox,
 *   Primary violet "Create Account" button, Google OAuth secondary button,
 *   and "Already have an account? Login" link.
 */
export default function FinoraRegisterPage({ onNavigateToLogin, onRegisterSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & Feedback
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [alertInfo, setAlertInfo] = useState(null); // { type: 'error' | 'success', message: '' }

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).toLowerCase());

  // Password Strength Calculation (0 - 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 10) score++;
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (varietyCount >= 3) score++;
    if (varietyCount === 4 && pass.length >= 8) score++;
    return Math.min(Math.max(score, 1), 4);
  };

  const strengthScore = getPasswordStrength(password);

  const getStrengthCaption = () => {
    if (!password) return { text: 'Use at least 8 characters.', cls: '' };
    if (strengthScore === 1) return { text: 'Weak — use at least 8 characters.', cls: 'weak' };
    if (strengthScore === 2) return { text: 'Fair — add uppercase or numbers.', cls: 'fair' };
    if (strengthScore === 3) return { text: 'Good password.', cls: 'good' };
    return { text: 'Strong password!', cls: 'strong' };
  };

  const strengthCaption = getStrengthCaption();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');
    setAlertInfo(null);

    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError('Please enter your full name.');
      hasError = true;
    }

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (!termsAccepted) {
      setTermsError('You must agree to the Terms of Service to continue.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const res = await authService.register({
        name: fullName.trim(),
        email: email.trim(),
        password
      });

      setIsLoading(false);
      setAlertInfo({
        type: 'success',
        message: 'Account created successfully! Welcome to Finora.'
      });

      if (onRegisterSuccess) {
        setTimeout(() => onRegisterSuccess(res.user), 800);
      } else {
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      }
    } catch (err) {
      setIsLoading(false);
      setAlertInfo({
        type: 'error',
        message: err.message || 'Registration failed. Please check your credentials.'
      });
    }
  };

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setAlertInfo({
        type: 'success',
        message: 'Google account linked! Setting up your Finora profile...'
      });
      if (onRegisterSuccess) {
        setTimeout(() => onRegisterSuccess({ fullName: 'Google User', email: 'user@gmail.com', provider: 'google' }), 1000);
      }
    }, 850);
  };

  return (
    <div className="register-layout-wrapper">
      {/* ===================================================================
          1. LEFT BRANDING & ILLUSTRATION PANEL (~46% width)
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
                src="assets/finora-register-character.jpg"
                alt="Person creating their wealth goals with Finora"
                className="illustration-img"
                style={{
                  transform: `perspective(800px) rotateX(${-(mousePos.y / 250) * 7}deg) rotateY(${(mousePos.x / 250) * 7}deg)`
                }}
              />
            </div>

            {/* Floating Goal Badge */}
            <div
              className="panel-floating-badge badge-goal"
              style={{
                transform: `translate3d(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px, 0)`
              }}
            >
              <div className="badge-icon-mint">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#43D9A3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="badge-text-group">
                <span className="b-sub">First Goal</span>
                <span className="b-main">Emergency Fund <strong className="text-mint">84%</strong></span>
              </div>
            </div>

            {/* Smart Budgeting Badge */}
            <div
              className="panel-floating-badge badge-smart"
              style={{
                transform: `translate3d(${mousePos.x * 0.07}px, ${mousePos.y * 0.07}px, 0)`
              }}
            >
              <span className="smart-dot" />
              <span>AI Automated Budgeting</span>
            </div>
          </div>
        </div>

        {/* Supporting Copy */}
        <div className="panel-copy-area">
          <h2 className="panel-headline">
            Start Your<br />
            Financial Journey
          </h2>
          <p className="panel-tagline">Create your account and take control of your money.</p>
        </div>
      </aside>

      {/* ===================================================================
          2. RIGHT REGISTRATION PANEL (~54% width, Clean White)
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
          {/* Header */}
          <div className="form-header">
            <h1 className="welcome-heading">Create Your <span className="text-accent-violet">Account</span></h1>
            <p className="welcome-subtext">Join Finora and start managing your finances.</p>
          </div>

          {/* Feedback Alert */}
          {alertInfo && (
            <div className={`alert-banner ${alertInfo.type}`} role="alert">
              <span className="alert-message">{alertInfo.message}</span>
            </div>
          )}

          {/* Form */}
          <form className="register-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            {/* Decoy trap inputs to disrupt browser autofill popups */}
            <div style={{ opacity: 0, position: 'absolute', top: 0, left: -9999, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }} aria-hidden="true">
              <input type="text" name="trap_user" tabIndex={-1} autoComplete="username" />
              <input type="password" name="trap_pass" tabIndex={-1} autoComplete="current-password" />
            </div>

            {/* 1. Full Name Field */}
            <div className={`form-group ${fullNameError ? 'has-error' : ''}`}>
              <label htmlFor="react-fullname" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon leading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="react-fullname"
                  name="react_fullname_noautofill"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={fullName}
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
                    setFullName(e.target.value);
                    if (fullNameError) setFullNameError('');
                  }}
                  required
                />
              </div>
              {fullNameError && <span className="field-error">{fullNameError}</span>}
            </div>

            {/* 2. Email Address Field */}
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
                  name="react_email_noautofill"
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

            {/* 3. Password Field with 4-Segment Strength Indicator */}
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
                  name="react_pwd_noautofill"
                  className="form-input has-trailing"
                  placeholder="Create a password"
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

              {/* Strength Bars */}
              <div className="password-strength-container">
                <div className="strength-bars">
                  <span className={`strength-bar ${strengthScore >= 1 ? (strengthScore === 1 ? 'weak' : strengthScore === 2 ? 'fair' : strengthScore === 3 ? 'good' : 'strong') : ''}`} />
                  <span className={`strength-bar ${strengthScore >= 2 ? (strengthScore === 2 ? 'fair' : strengthScore === 3 ? 'good' : 'strong') : ''}`} />
                  <span className={`strength-bar ${strengthScore >= 3 ? (strengthScore === 3 ? 'good' : 'strong') : ''}`} />
                  <span className={`strength-bar ${strengthScore >= 4 ? 'strong' : ''}`} />
                </div>
                <span className={`strength-caption ${strengthCaption.cls}`}>{strengthCaption.text}</span>
              </div>

              {passwordError && <span className="field-error">{passwordError}</span>}
            </div>

            {/* 4. Confirm Password Field */}
            <div className={`form-group ${confirmPasswordError ? 'has-error' : ''}`}>
              <label htmlFor="react-confirm-password" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon leading-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#75809A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="react-confirm-password"
                  name="react_cpwd_noautofill"
                  className="form-input has-trailing"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  data-lpignore="true"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  onMouseDown={(e) => e.target.removeAttribute('readonly')}
                  onTouchStart={(e) => e.target.removeAttribute('readonly')}
                  onBlur={(e) => e.target.setAttribute('readonly', 'readonly')}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
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
              {confirmPasswordError && <span className="field-error">{confirmPasswordError}</span>}
            </div>

            {/* 5. Terms & Privacy Agreement */}
            <div className={`terms-row ${termsError ? 'has-error' : ''}`}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (termsError) setTermsError('');
                  }}
                />
                <span className="custom-checkbox">
                  <svg width="11" height="9" viewBox="0 0 12 10" fill="none">
                    <polyline points="1.5 5 4.5 8 10.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="terms-text">
                  I agree to the{' '}
                  <button type="button" className="legal-link" onClick={() => setShowTermsModal(true)}>
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="legal-link" onClick={() => setShowTermsModal(true)}>
                    Privacy Policy
                  </button>.
                </span>
              </label>
              {termsError && <span className="field-error">{termsError}</span>}
            </div>

            {/* 6. Primary Create Account Button */}
            <button type="submit" className="btn-primary-register" disabled={isLoading}>
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <span className="btn-text">Create Your Account</span>
              )}
            </button>

            {/* 7. Divider */}
            <div className="form-divider" aria-hidden="true">
              <span className="divider-line" />
              <span className="divider-text">or</span>
              <span className="divider-line" />
            </div>

            {/* 8. Google Registration Button */}
            <button
              type="button"
              className="btn-google-register"
              onClick={handleGoogleRegister}
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

            {/* 9. Login Link */}
            <p className="login-footer">
              Already have an account?{' '}
              <a
                href="login.html"
                className="link-login"
                onClick={(e) => {
                  if (onNavigateToLogin) {
                    e.preventDefault();
                    onNavigateToLogin();
                  }
                }}
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </main>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="terms-modal-backdrop open" onClick={() => setShowTermsModal(false)}>
          <div className="terms-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="terms-header">
              <h3>Terms of Service & Privacy</h3>
              <button
                type="button"
                className="terms-close"
                onClick={() => setShowTermsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="terms-body">
              <p>Finora respects your privacy and utilizes bank-grade 256-bit AES encryption to keep all your financial data secure. We never sell your personal information or transaction history to third parties.</p>
              <p>By creating an account, you consent to our automated expense categorization and analytics services designed to help you build better money habits.</p>
            </div>
            <button
              type="button"
              className="btn-primary-register"
              onClick={() => {
                setTermsAccepted(true);
                setTermsError('');
                setShowTermsModal(false);
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
