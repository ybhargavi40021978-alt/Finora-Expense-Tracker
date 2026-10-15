import React, { useState, useEffect } from 'react';
import './FinoraLandingPage.css';

/**
 * FinoraLandingPage — Production React Component
 * 
 * Reusable, desktop-first fintech SaaS landing page component.
 * Features:
 * - Dark Navy & Violet gradient canvas (#11183F / #20275D)
 * - 3D Financial Character with floating interactive cards (Income, Chart, Analytics)
 * - 4-item clean white feature strip directly attached to hero
 * - Responsive navigation, Demo modal, and Auth modal
 */
export default function FinoraLandingPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactServerErr, setContactServerErr] = useState('');

  // Escape key handler for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDemoModalOpen(false);
        setAuthModalOpen(false);
        setPrivacyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active scrollspy
  useEffect(() => {
    const sections = ['home', 'features', 'about', 'why-choose', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          const navKey = sections[i] === 'why-choose' ? 'features' : sections[i];
          setActiveNav(navKey);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleStageMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const openSignUp = () => {
    setIsSignUp(true);
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setIsSignUp(false);
    setAuthModalOpen(true);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  const validateContact = () => {
    const errs = {};
    if (!contactData.name.trim()) errs.name = 'Full name is required.';
    else if (contactData.name.trim().length < 2) errs.name = 'Please enter a valid full name.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactData.email.trim()) errs.email = 'Email address is required.';
    else if (!emailRegex.test(contactData.email.trim())) errs.email = 'Please enter a valid email address.';

    if (!contactData.subject) errs.subject = 'Please select a subject.';

    if (!contactData.message.trim()) errs.message = 'Please enter your message.';
    else if (contactData.message.trim().length < 10) errs.message = 'Message must be at least 10 characters long.';

    if (!contactData.privacy) errs.privacy = 'You must agree before submitting.';

    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactServerErr('');
    setContactSuccess(false);

    if (!validateContact()) return;

    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactData.name.trim(),
          email: contactData.email.trim(),
          subject: contactData.subject,
          message: contactData.message.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactSuccess(true);
        setContactData({ name: '', email: '', subject: '', message: '', privacy: false });
        setContactErrors({});
      } else {
        setContactServerErr(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setContactServerErr('Network error. Please check your connection and try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="finora-page-wrapper">
      {/* Background ambient lighting */}
      <div className="ambient-glow ambient-glow-violet" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-blue" aria-hidden="true" />

      {/* Hero Region (Navy-Indigo Gradient) */}
      <div className="hero-region">
        {/* Navigation Bar */}
        <header className="navbar">
          <div className="nav-container">
            {/* Brand Logo */}
            <a href="#home" className="brand-link" onClick={() => setActiveNav('home')}>
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

            {/* Navigation links */}
            <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              {['home', 'features', 'about', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={`nav-link ${activeNav === item ? 'active' : ''}`}
                  onClick={() => {
                    setActiveNav(item);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              ))}
            </nav>

            {/* Action buttons */}
            <div className="nav-actions">
              <button type="button" className="btn-link-login" onClick={openLogin}>
                Login
              </button>
              <button type="button" className="btn-nav-primary" onClick={openSignUp}>
                Get Started
              </button>
              <button
                type="button"
                className="mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Main Content */}
        <main className="hero-main" id="home">
          <div className="hero-container">
            {/* Left Column: Heading, Paragraph, CTA */}
            <div className="hero-content">
              <div className="hero-tag">
                <span className="tag-pulse" />
                <span className="tag-text">Next-Gen Personal Finance</span>
              </div>

              <h1 className="hero-heading">
                Take Control<br />
                of Your <span className="gradient-accent">Finances</span>
              </h1>

              <p className="hero-paragraph">
                Track your income, manage expenses, set goals and build a better financial future — all in one place.
              </p>

              <div className="hero-cta-group">
                <button type="button" className="btn-cta-primary" onClick={openSignUp}>
                  <span>Get Started Free</span>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="cta-arrow-icon">
                    <path d="M4.167 10h11.666m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button type="button" className="btn-cta-secondary" onClick={() => setDemoModalOpen(true)}>
                  <span className="play-icon-bubble">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="hero-social-proof">
                <div className="rating-stars">★★★★★</div>
                <span className="rating-text">Loved by <strong>40,000+</strong> smart savers worldwide</span>
              </div>
            </div>

            {/* Right Column: 3D Visual Stage with Floating Cards */}
            <div className="hero-visual">
              <div className="visual-radial-glow" aria-hidden="true" />
              <div
                className="visual-stage"
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
              >
                {/* 3D Character Illustration */}
                <div className="character-wrapper">
                  <img
                    src="assets/finora-hero-character.jpg"
                    alt="Finora financial 3D illustration"
                    className="character-image"
                    style={{
                      transform: `perspective(1000px) rotateX(${-(mousePos.y / 300) * 8}deg) rotateY(${(mousePos.x / 300) * 8}deg)`
                    }}
                  />
                  <div className="character-base-blend" />
                </div>

                {/* Floating Card 1: Income */}
                <div
                  className="floating-card card-income"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px, 0)`
                  }}
                >
                  <div className="card-income-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#43D9A3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                  <div className="card-income-details">
                    <span className="card-label">Monthly Income</span>
                    <div className="card-value-row">
                      <span className="card-amount">+$3,850.00</span>
                      <span className="card-badge mint">+14.2%</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: Savings Sparkline Chart */}
                <div
                  className="floating-card card-chart"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.07}px, ${mousePos.y * 0.07}px, 0)`
                  }}
                >
                  <div className="card-chart-header">
                    <span className="chart-title">Net Savings</span>
                    <span className="chart-badge">+28.4%</span>
                  </div>
                  <div className="card-chart-body">
                    <svg width="140" height="42" viewBox="0 0 140 42" fill="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="42" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#48B9F5" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#48B9F5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,35 Q20,28 35,30 T70,18 T105,12 T140,4 L140,42 L0,42 Z" fill="url(#chartGrad)" />
                      <path d="M0,35 Q20,28 35,30 T70,18 T105,12 T140,4" stroke="#48B9F5" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="140" cy="4" r="3.5" fill="#43D9A3" stroke="#11183F" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Floating Card 3: Analytics Card */}
                <div
                  className="floating-card card-analytics"
                  style={{
                    transform: `translate3d(${mousePos.x * 0.04}px, ${mousePos.y * 0.04}px, 0)`
                  }}
                >
                  <div className="donut-mini">
                    <svg width="34" height="34" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(199, 184, 255, 0.15)" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#7957FF" strokeWidth="4.5" strokeDasharray="52 100" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#43D9A3" strokeWidth="4.5" strokeDasharray="24 100" strokeDashoffset="-52" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <span className="analytics-name">Budget Status</span>
                    <span className="analytics-status">On Track · <strong>76%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Feature Strip (Clean White Row Directly Attached to Hero) */}
      <section className="feature-strip" id="features">
        <div className="feature-strip-container">
          {/* Feature 1 */}
          <div className="feature-item">
            <div className="feature-icon-box icon-mint">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#43D9A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="14" rx="3" />
                <path d="M16 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">Track Income &amp; Expenses</h2>
              <p className="feature-description">Organize every transaction.</p>
            </div>
          </div>

          <div className="feature-divider" aria-hidden="true" />

          {/* Feature 2 */}
          <div className="feature-item">
            <div className="feature-icon-box icon-violet">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7957FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <path d="M3 20h18" />
              </svg>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">Smart Analytics &amp; Insights</h2>
              <p className="feature-description">Understand your spending.</p>
            </div>
          </div>

          <div className="feature-divider" aria-hidden="true" />

          {/* Feature 3 */}
          <div className="feature-item">
            <div className="feature-icon-box icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#48B9F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" fill="#48B9F5" />
              </svg>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">Set Budgets &amp; Goals</h2>
              <p className="feature-description">Stay on track financially.</p>
            </div>
          </div>

          <div className="feature-divider" aria-hidden="true" />

          {/* Feature 4 */}
          <div className="feature-item">
            <div className="feature-icon-box icon-cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="feature-text">
              <h2 className="feature-title">Secure &amp; Private Data</h2>
              <p className="feature-description">Keep your data protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. SECTION: ABOUT FINORA
          ====================================================================== */}
      <section className="landing-section section-about" id="about" aria-labelledby="about-title">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">ABOUT FINORA</span>
            <h2 className="section-title" id="about-title">Your Money. Your Goals. Your Future.</h2>
            <p className="section-lead">
              Finora is a personal finance management platform designed to make managing money simpler and more organized. Track your income and expenses, understand your spending habits, plan budgets, and work toward your financial goals—all in one place.
            </p>
          </div>

          <div className="about-two-col">
            {/* Left Column: Text & Benefits */}
            <div className="about-left-col">
              <h3 className="about-subheading">Designed to make every financial decision clearer.</h3>
              <p className="about-lead-para">
                We believe that managing personal finances should feel simple, not stressful. Finora brings your everyday financial activity into one organized workspace, helping you understand where your money goes and make more informed decisions about your future.
              </p>

              <div className="about-benefits-list">
                <div className="about-benefit-item">
                  <div className="benefit-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="9" rx="1" />
                      <rect x="14" y="3" width="7" height="5" rx="1" />
                      <rect x="14" y="12" width="7" height="9" rx="1" />
                      <rect x="3" y="16" width="7" height="5" rx="1" />
                    </svg>
                  </div>
                  <div>
                    <h4>Complete Financial Overview</h4>
                    <p>Keep track of income, expenses, and balances in one place.</p>
                  </div>
                </div>

                <div className="about-benefit-item">
                  <div className="benefit-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Smarter Spending Decisions</h4>
                    <p>Review spending patterns and monitor your budgets.</p>
                  </div>
                </div>

                <div className="about-benefit-item">
                  <div className="benefit-icon-box" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Goal-Oriented Saving</h4>
                    <p>Set savings targets, track your progress, and stay motivated.</p>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-start-journey" onClick={openSignUp}>
                <span>Start Your Journey</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Right Column: Visual illustration */}
            <div className="about-right-col" aria-label="Finora dashboard preview illustration">
              <div className="about-visual-card">
                <div className="visual-card-header">
                  <span className="card-sample-title">Financial Health Summary</span>
                  <span className="card-sample-tag">Sample Data</span>
                </div>

                {/* Monthly Income vs Expense Comparison */}
                <div className="visual-comparison-box">
                  <div className="comparison-header">
                    <span className="comparison-income">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="8 12 12 16 16 12" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                      </svg>
                      Income: $4,250
                    </span>
                    <span className="comparison-expense">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="16 12 12 8 8 12" />
                        <line x1="12" y1="16" x2="12" y2="8" />
                      </svg>
                      Expenses: $2,680
                    </span>
                  </div>
                  <div className="comparison-progress-track" role="progressbar" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} aria-label="Income versus expense ratio">
                    <div className="comparison-progress-fill" />
                  </div>
                </div>

                {/* Savings Goal Mini Card */}
                <div className="visual-goal-box">
                  <div className="goal-ring-icon" aria-hidden="true">
                    <div className="goal-ring-inner">82%</div>
                  </div>
                  <div className="goal-info">
                    <span className="goal-label">Active Savings Goal</span>
                    <h4 className="goal-title">Emergency Fund ($8,200 / $10,000)</h4>
                    <span className="goal-badge-ontrack">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      On track to reach target
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Mission Statement Panel */}
          <div className="mission-statement-panel">
            <div className="mission-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <h3 className="mission-heading">Our Mission</h3>
            <p className="mission-text">
              “Our mission is to help people build healthier financial habits by making their money easier to understand, organize, and manage.”
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. SECTION: WHY CHOOSE FINORA (4 Features Grid)
          ====================================================================== */}
      <section className="landing-section section-why-choose" id="why-choose" aria-labelledby="why-choose-title">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">WHY CHOOSE FINORA</span>
            <h2 className="section-title" id="why-choose-title">Everything You Need to Manage Your Money</h2>
            <p className="section-lead">
              Bring your everyday financial activities together with tools designed for clarity, planning, and progress.
            </p>
          </div>

          <div className="why-features-grid">
            {/* Card 1: Income & Expense Tracking */}
            <div className="why-feature-card">
              <div className="why-icon-box mint" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <h3 className="why-card-title">Income &amp; Expense Tracking</h3>
              <p className="why-card-desc">
                Record your income and expenses and review your financial activity in one place.
              </p>
            </div>

            {/* Card 2: Budget Planning */}
            <div className="why-feature-card">
              <div className="why-icon-box violet" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <h3 className="why-card-title">Budget Planning</h3>
              <p className="why-card-desc">
                Set category budgets, monitor spending, and see how much of your budget remains.
              </p>
            </div>

            {/* Card 3: Savings Goals */}
            <div className="why-feature-card">
              <div className="why-icon-box blue" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="why-card-title">Savings Goals</h3>
              <p className="why-card-desc">
                Create financial goals, record contributions, and track progress toward your targets.
              </p>
            </div>

            {/* Card 4: Financial Insights */}
            <div className="why-feature-card">
              <div className="why-icon-box cyan" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                  <line x1="2" y1="20" x2="22" y2="20" />
                </svg>
              </div>
              <h3 className="why-card-title">Financial Insights</h3>
              <p className="why-card-desc">
                Explore your spending trends and understand your financial patterns through reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. SECTION: FREQUENTLY ASKED QUESTIONS (Accordion)
          ====================================================================== */}
      <section className="landing-section section-faq" id="faq" aria-labelledby="faq-title">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">FAQS</span>
            <h2 className="section-title" id="faq-title">Frequently Asked Questions</h2>
            <p className="section-lead">
              Quick answers to common questions about Finora and how it helps you manage your finances.
            </p>
          </div>

          <div className="faq-accordion-container" id="faq-accordion">
            {[
              {
                q: 'What is Finora?',
                a: 'Finora is a comprehensive personal finance and expense-tracking web application. It brings your daily financial activity together, helping you monitor income and spending, maintain category budgets, and build long-term savings in a secure, intuitive workspace.'
              },
              {
                q: 'Can I track both income and expenses?',
                a: 'Yes! You can record multiple income streams (salary, freelance, investments) alongside day-to-day expenses, with customizable categories, payment methods, tags, and receipt notes.'
              },
              {
                q: 'Can I create and manage budgets?',
                a: 'Absolutely. You can set monthly spending limits for categories such as Housing, Groceries, Dining, and Entertainment, and receive clear alerts before exceeding your planned thresholds.'
              },
              {
                q: 'How do savings goals work?',
                a: 'You can create dedicated savings goals with target amounts and deadlines—such as an Emergency Fund or Vacation. As you log contributions, Finora automatically calculates your progress percentage and remaining targets.'
              },
              {
                q: 'How can I contact support?',
                a: 'You can send our team a message directly using the contact form below or email us at support@finora.app. We respond to technical inquiries and account assistance promptly.'
              }
            ].map((item, idx) => (
              <div key={idx} className={`faq-accordion-item ${openFaqIndex === idx ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <svg className="faq-icon-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="faq-answer-panel">
                  <p className="faq-answer-text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. SECTION: CONTACT US
          ====================================================================== */}
      <section className="landing-section section-contact" id="contact" aria-labelledby="contact-title">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow">CONTACT US</span>
            <h2 className="section-title" id="contact-title">We’re Here to Help</h2>
            <p className="section-lead">
              Have a question, need assistance, or want to share feedback? Send us a message and let us know how we can help.
            </p>
          </div>

          <div className="contact-two-col">
            {/* Left Column: Contact Information */}
            <div className="contact-info-col">
              <h3 className="contact-col-title">Let’s Talk</h3>
              <p className="contact-col-desc">
                Whether you have a question about Finora, need help using a feature, or want to share a suggestion, we welcome your message.
              </p>

              <div className="contact-cards-stack">
                <div className="contact-info-card">
                  <div className="contact-card-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="contact-card-text">
                    <h4>General Inquiries</h4>
                    <p>Questions about Finora and its features.</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                  </div>
                  <div className="contact-card-text">
                    <h4>Technical Support</h4>
                    <p>Need help with an issue or a page that isn't working?</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-card-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="contact-card-text">
                    <h4>Feedback &amp; Suggestions</h4>
                    <p>Share ideas that could improve your Finora experience.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-container">
              <h3 className="form-card-title">Send Us a Message</h3>

              {contactSuccess && (
                <div className="landing-form-alert success" role="status">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              {contactServerErr && (
                <div className="landing-form-alert error" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{contactServerErr}</span>
                </div>
              )}

              <form className="landing-contact-form" onSubmit={handleContactSubmit} noValidate>
                <div className="form-row-2col">
                  <div className="landing-field-group">
                    <label htmlFor="react-contact-name">Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      id="react-contact-name"
                      className={`landing-input ${contactErrors.name ? 'err' : ''}`}
                      placeholder="Enter your full name"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      required
                    />
                    {contactErrors.name && <span className="landing-err-msg">{contactErrors.name}</span>}
                  </div>

                  <div className="landing-field-group">
                    <label htmlFor="react-contact-email">Email Address <span className="req">*</span></label>
                    <input
                      type="email"
                      id="react-contact-email"
                      className={`landing-input ${contactErrors.email ? 'err' : ''}`}
                      placeholder="you@example.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      required
                    />
                    {contactErrors.email && <span className="landing-err-msg">{contactErrors.email}</span>}
                  </div>
                </div>

                <div className="landing-field-group">
                  <label htmlFor="react-contact-subject">Subject <span className="req">*</span></label>
                  <select
                    id="react-contact-subject"
                    className={`landing-select ${contactErrors.subject ? 'err' : ''}`}
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select a subject…</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feedback & Suggestions">Feedback &amp; Suggestions</option>
                    <option value="Account Assistance">Account Assistance</option>
                    <option value="Other">Other</option>
                  </select>
                  {contactErrors.subject && <span className="landing-err-msg">{contactErrors.subject}</span>}
                </div>

                <div className="landing-field-group">
                  <label htmlFor="react-contact-msg">Message <span className="req">*</span></label>
                  <textarea
                    id="react-contact-msg"
                    className={`landing-textarea ${contactErrors.message ? 'err' : ''}`}
                    placeholder="Tell us how we can help…"
                    rows={4}
                    maxLength={1000}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    required
                  />
                  <div className="textarea-footer-info">
                    {contactErrors.message ? (
                      <span className="landing-err-msg">{contactErrors.message}</span>
                    ) : <span />}
                    <span className="char-counter">{contactData.message.length} / 1000</span>
                  </div>
                </div>

                <label className="privacy-checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={contactData.privacy}
                    onChange={(e) => setContactData({ ...contactData, privacy: e.target.checked })}
                    required
                  />
                  <span>
                    I agree that my information may be used to respond to my inquiry.{' '}
                    <button
                      type="button"
                      className="footer-policy-link"
                      onClick={() => setPrivacyModalOpen(true)}
                      style={{ textDecoration: 'underline', color: 'var(--accent-violet)' }}
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {contactErrors.privacy && (
                  <span className="landing-err-msg" style={{ marginTop: '-10px' }}>{contactErrors.privacy}</span>
                )}

                <button
                  type="submit"
                  className={`btn-landing-submit ${contactSubmitting ? 'loading' : ''}`}
                  disabled={contactSubmitting}
                >
                  <span className="btn-spinner" aria-hidden="true" />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span className="btn-label">
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          6. SECTION: POLISHED FOOTER (Deep Navy #11183F)
          ====================================================================== */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <a href="#home" className="footer-brand-link" title="Finora Home">
              <div className="footer-brand-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                  <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                  <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                  <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19" cy="2" r="2" fill="#43D9A3" />
                </svg>
              </div>
              <span className="footer-brand-name">Finora</span>
            </a>
            <span className="footer-tagline">Track. Plan. Save. Grow.</span>
            <p className="footer-desc">
              Take control of your finances with a clearer view of your money.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul className="footer-links-list">
              <li><button type="button" onClick={openLogin}>Login</button></li>
              <li><button type="button" onClick={openSignUp}>Get Started</button></li>
              <li><a href="dashboard.html">Dashboard</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 Finora. All rights reserved.</span>
          <button type="button" className="footer-policy-link" onClick={() => setPrivacyModalOpen(true)}>
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="modal-backdrop open" onClick={() => setPrivacyModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Finora Privacy Policy</h3>
                <p className="modal-subtitle">Your personal and financial privacy is our highest priority.</p>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setPrivacyModalOpen(false)}>✕</button>
            </div>
            <div style={{ padding: '24px', fontSize: '14px', lineHeight: '1.65', color: '#475569', maxHeight: '420px', overflowY: 'auto' }}>
              <h4 style={{ color: '#11183F', marginBottom: '8px', fontSize: '15px' }}>Information We Collect</h4>
              <p style={{ marginBottom: '16px' }}>
                Finora collects information you provide directly to us when contacting support, creating an account, or managing financial records. We do not sell your personal data or transaction history to third parties.
              </p>
              <h4 style={{ color: '#11183F', marginBottom: '8px', fontSize: '15px' }}>How We Use Inquiries</h4>
              <p style={{ marginBottom: '16px' }}>
                Contact inquiries submitted through this form are used exclusively to address your questions, deliver technical assistance, or evaluate user feedback for service improvements.
              </p>
              <h4 style={{ color: '#11183F', marginBottom: '8px', fontSize: '15px' }}>Security &amp; Data Protection</h4>
              <p>
                All transmitted messages and financial records are protected by modern cryptographic standards and secured MongoDB database clusters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {demoModalOpen && (
        <div className="modal-backdrop open" onClick={() => setDemoModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-badge">Interactive Preview</span>
                <h3>Experience Finora in Action</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setDemoModalOpen(false)}>✕</button>
            </div>
            <div className="demo-screen-preview">
              <div className="demo-header-bar">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
                <span className="demo-url">finora.app/dashboard/preview</span>
              </div>
              <div className="demo-content-grid">
                <div className="demo-card">
                  <span className="d-label">Total Balance</span>
                  <span className="d-val">$24,892.40</span>
                  <span className="d-growth text-mint">↑ 8.3% this week</span>
                </div>
                <div className="demo-card">
                  <span className="d-label">Monthly Savings</span>
                  <span className="d-val">$3,450.00</span>
                  <span className="d-growth text-violet">Goal: $4,000 (86%)</span>
                </div>
                <div className="demo-card">
                  <span className="d-label">Recent Category</span>
                  <span className="d-val">Investments</span>
                  <span className="d-growth text-blue">Auto-allocated</span>
                </div>
              </div>
              <div className="demo-action-footer">
                <p>Ready to automate your wealth and stay in complete control?</p>
                <button
                  type="button"
                  className="btn-cta-primary"
                  onClick={() => {
                    setDemoModalOpen(false);
                    openSignUp();
                  }}
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <div className="modal-backdrop open" onClick={() => setAuthModalOpen(false)}>
          <div className="modal-dialog auth-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>{isSignUp ? 'Get Started with Finora' : 'Welcome Back to Finora'}</h3>
                <p className="modal-subtitle">
                  {isSignUp
                    ? 'Start taking control of your financial future today.'
                    : 'Sign in to access your financial dashboard.'}
                </p>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setAuthModalOpen(false)}>✕</button>
            </div>
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setAuthModalOpen(false); }}>
              {isSignUp && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Alex Morgan" required />
                </div>
              )}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="alex@finora.io" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••••••" required />
              </div>
              <button type="submit" className="btn-cta-primary full-width">
                {isSignUp ? 'Create Free Account' : 'Sign In'}
              </button>
              <p className="auth-toggle-note">
                <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
                <button
                  type="button"
                  className="btn-text-link"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
