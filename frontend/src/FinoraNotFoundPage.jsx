import React, { useState } from 'react';
import './FinoraNotFoundPage.css';

/**
 * Screen 17 — Finora 404 Error Page Component
 * With Additional About & Contact Sections
 * Full-Stack Personal Finance & Expense Tracker: Finora
 * Brand Tagline: "Track. Plan. Save. Grow."
 */

export default function FinoraNotFoundPage({ navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  // Contact form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleNavigate = (path) => {
    if (typeof navigate === 'function') {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handleHistoryBack = () => {
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      handleNavigate('/dashboard');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const APP_ROUTES = [
    { title: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-line', desc: 'Financial health overview & metrics' },
    { title: 'Transactions', path: '/transactions', icon: 'ri-exchange-dollar-line', desc: 'Income & expense logs' },
    { title: 'Add Income', path: '/add-income', icon: 'ri-arrow-down-circle-line', desc: 'Log earnings & deposits' },
    { title: 'Add Expense', path: '/add-expense', icon: 'ri-arrow-up-circle-line', desc: 'Track spending & receipts' },
    { title: 'Analytics', path: '/analytics', icon: 'ri-pie-chart-line', desc: 'Breakdowns & spending trends' },
    { title: 'Budgets', path: '/budgets', icon: 'ri-wallet-3-line', desc: 'Category caps & alerts' },
    { title: 'Goals & Savings', path: '/goals', icon: 'ri-funds-line', desc: 'Target milestones & progress' },
    { title: 'Categories', path: '/categories', icon: 'ri-apps-2-line', desc: 'Manage expense & income groups' },
    { title: 'Recurring', path: '/recurring', icon: 'ri-repeat-2-line', desc: 'Subscriptions & scheduled bills' },
    { title: 'Settings', path: '/settings', icon: 'ri-settings-4-line', desc: 'Account profile & preferences' }
  ];

  const filteredRoutes = searchQuery.trim()
    ? APP_ROUTES.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitFeedback(null);

    // Validation
    const errors = {};
    if (!contactData.name.trim() || contactData.name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactData.email.trim() || !emailPattern.test(contactData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!contactData.subject.trim() || contactData.subject.trim().length < 3) {
      errors.subject = 'Please specify a subject.';
    }
    if (!contactData.message.trim() || contactData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitFeedback({ type: 'success', text: data.message });
        setContactData({ name: '', email: '', subject: '', message: '' });
        setFieldErrors({});
      } else {
        setSubmitFeedback({ type: 'error', text: data.message || 'Failed to send message.' });
        if (data.errors) setFieldErrors(data.errors);
      }
    } catch (err) {
      setSubmitFeedback({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const MODAL_DATA = {
    help: {
      title: 'Finora Help Center',
      content: 'Need assistance navigating your Finora workspace? If a bookmarked link failed, routes may have been updated. Use "Back to Dashboard" anytime to regain your primary financial overview.'
    },
    support: {
      title: 'Contact Finora Support',
      content: 'We are here to help! Reach our financial engineering support team at support@finora.app. Live support is active Monday to Friday from 9 AM to 6 PM EST.'
    },
    privacy: {
      title: 'Finora Privacy & Security',
      content: 'Your financial confidentiality is protected with bank-grade AES-256 encryption. Finora never sells or shares your personal expenditure records.'
    }
  };

  return (
    <div className="finora-404-container">
      {/* Background Ambient Glow */}
      <div className="finora-ambient-glow" aria-hidden="true">
        <div className="glow-lavender"></div>
        <div className="glow-blue"></div>
      </div>

      {/* 1. Header with Home, About, Contact & Back to Dashboard */}
      <header className="finora-404-header">
        <div className="header-container-react">
          <div 
            className="finora-brand-link" 
            onClick={() => handleNavigate('/')} 
            role="button" 
            tabIndex={0}
          >
            <div className="finora-brand-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <div className="finora-brand-text">
              <span className="brand-title">Finora</span>
              <span className="brand-tag">Track. Plan. Save. Grow.</span>
            </div>
          </div>

          <div className="header-nav-bundle">
            <nav className="header-links-react">
              <button className="nav-btn-link" onClick={() => handleNavigate('/')}>Home</button>
              <button className="nav-btn-link" onClick={() => scrollToSection('about-section')}>About</button>
              <button className="nav-btn-link" onClick={() => scrollToSection('contact-section')}>Contact</button>
            </nav>
            <button 
              className="finora-header-btn" 
              onClick={() => handleNavigate('/dashboard')}
            >
              <i className="ri-home-4-line"></i>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main 404 Visual Content */}
      <main className="finora-404-main">
        <div className="finora-illustration-box">
          <svg className="finora-404-svg" viewBox="0 0 540 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="reactNumeralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#11183F"/>
                <stop offset="65%" stopColor="#7957FF"/>
                <stop offset="100%" stopColor="#48B9F5"/>
              </linearGradient>
              <linearGradient id="reactCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7957FF"/>
                <stop offset="100%" stopColor="#48B9F5"/>
              </linearGradient>
            </defs>

            <path d="M 60 190 C 130 110, 200 230, 310 130 C 370 70, 440 100, 470 75" 
                  stroke="#C7B8FF" strokeWidth="2.5" strokeDasharray="6 6" fill="none"/>
            <circle cx="470" cy="75" r="9" fill="#7957FF"/>
            <circle cx="470" cy="75" r="3.5" fill="#FFFFFF"/>

            <text x="135" y="155" className="react-numeral-text" fill="url(#reactNumeralGrad)">4</text>
            <text x="270" y="155" className="react-numeral-text" fill="url(#reactNumeralGrad)">0</text>
            <text x="405" y="155" className="react-numeral-text" fill="url(#reactNumeralGrad)">4</text>

            <g className="react-floating-browser" transform="translate(230, 85)">
              <rect x="0" y="0" width="80" height="60" rx="8" fill="#FFFFFF" stroke="#E8EBF3" strokeWidth="1.5"/>
              <path d="M 0 8 Q 0 0 8 0 L 72 0 Q 80 0 80 8 L 80 16 L 0 16 Z" fill="#F6F7FC"/>
              <circle cx="10" cy="8" r="2.2" fill="#EF4444"/>
              <circle cx="17" cy="8" r="2.2" fill="#F59E0B"/>
              <circle cx="24" cy="8" r="2.2" fill="#23B981"/>
              <circle cx="40" cy="38" r="11" fill="rgba(121, 87, 255, 0.1)"/>
              <path d="M 36 34 L 44 42 M 44 34 L 36 42" stroke="#7957FF" strokeWidth="2" strokeLinecap="round"/>
            </g>

            <g className="react-floating-card" transform="translate(55, 60) rotate(-8)">
              <rect x="0" y="0" width="68" height="42" rx="6" fill="url(#reactCardGrad)"/>
              <rect x="8" y="10" width="12" height="9" rx="2" fill="#FFDF00" opacity="0.9"/>
              <rect x="8" y="27" width="30" height="3" rx="1.5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="8" y="33" width="18" height="2.5" rx="1.2" fill="#FFFFFF" opacity="0.6"/>
              <circle cx="56" cy="14" r="5" fill="#FFFFFF" opacity="0.4"/>
              <circle cx="50" cy="14" r="5" fill="#FFFFFF" opacity="0.4"/>
            </g>

            <rect x="450" y="150" width="16" height="16" rx="3" fill="#C7B8FF" opacity="0.75" transform="rotate(45 458 158)"/>
            <circle cx="180" cy="45" r="5" fill="#48B9F5" opacity="0.85"/>
            <circle cx="365" cy="195" r="7" fill="#C7B8FF" opacity="0.6"/>
          </svg>
        </div>

        <h1 className="finora-404-title">Oops! Page not found.</h1>
        <p className="finora-404-desc">
          The page you’re looking for may have moved, been removed, or the link may be incorrect.
        </p>
        <div className="finora-404-helper">
          <i className="ri-compass-3-line"></i>
          <span>Let’s get you back on track with your finances.</span>
        </div>

        <div className="finora-btn-row">
          <button 
            className="finora-btn-primary" 
            onClick={() => handleNavigate('/dashboard')}
          >
            <i className="ri-home-5-line"></i>
            <span>Back to Dashboard</span>
          </button>
          <button 
            className="finora-btn-secondary" 
            onClick={() => handleNavigate('/transactions')}
          >
            <i className="ri-file-list-3-line"></i>
            <span>View Transactions</span>
          </button>
        </div>

        <button className="finora-back-link" onClick={handleHistoryBack}>
          <i className="ri-arrow-left-line"></i>
          <span>Go back to the previous page</span>
        </button>

        <div className="finora-quick-nav">
          <span className="quick-nav-header">Or explore these pages</span>
          <div className="quick-nav-badges">
            <button className="badge-item" onClick={() => handleNavigate('/dashboard')}>
              <i className="ri-dashboard-line"></i> Dashboard
            </button>
            <button className="badge-item" onClick={() => handleNavigate('/transactions')}>
              <i className="ri-exchange-dollar-line"></i> Transactions
            </button>
            <button className="badge-item" onClick={() => handleNavigate('/analytics')}>
              <i className="ri-pie-chart-line"></i> Analytics
            </button>
          </div>
        </div>

        <div className="finora-search-widget">
          <div className="search-bar">
            <i className="ri-search-line search-icon"></i>
            <input 
              type="text" 
              placeholder="Search transactions or pages…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                <i className="ri-close-circle-fill"></i>
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="search-results-popup">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <div 
                    key={route.path} 
                    className="route-result-item" 
                    onClick={() => handleNavigate(route.path)}
                  >
                    <i className={route.icon}></i>
                    <div>
                      <div className="route-name">{route.title}</div>
                      <div className="route-desc">{route.desc}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-none">
                  No matching pages found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 3. About Finora Section */}
      <section className="about-finora-container" id="about-section">
        <div className="pill-badge">About Finora</div>
        <h2 className="section-title-text">About Finora</h2>
        <p className="about-text-content">
          Finora is a personal finance management application designed to help you track income, manage expenses, monitor budgets, and build better saving habits. Our goal is to make managing your money simpler, clearer, and more organized.
        </p>

        <div className="about-cards-row">
          <div className="feature-block">
            <div className="icon-circ mint"><i className="ri-exchange-dollar-line"></i></div>
            <h3>Track Your Money</h3>
            <p>Manage income and expenses in one place. Keep an accurate, real-time log of every transaction.</p>
          </div>
          <div className="feature-block">
            <div className="icon-circ violet"><i className="ri-pie-chart-2-line"></i></div>
            <h3>Plan Your Budget</h3>
            <p>Monitor spending and stay within your limits. Receive clear thresholds before overspending.</p>
          </div>
          <div className="feature-block">
            <div className="icon-circ blue"><i className="ri-funds-line"></i></div>
            <h3>Grow Your Savings</h3>
            <p>Set financial goals and follow your progress. Build financial resilience step by step.</p>
          </div>
        </div>
      </section>

      {/* 4. Contact Section */}
      <section className="contact-support-container" id="contact-section">
        <div className="pill-badge">Support Assistance</div>
        <h2 className="section-title-text">Need a little help?</h2>
        <p className="contact-sub-text">
          Having trouble finding a page or using Finora? Get in touch with our support team.
        </p>
        <a href="mailto:support@finora.app" className="email-link-chip">
          <i className="ri-mail-line"></i> support@finora.app
        </a>

        <div className="contact-form-box">
          {submitFeedback && (
            <div className={`alert-box ${submitFeedback.type}`}>
              <i className={submitFeedback.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}></i>
              <span>{submitFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit}>
            <div className="form-grid-react">
              <div className="form-item">
                <label>Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={contactData.name} 
                  onChange={handleContactChange} 
                  className={fieldErrors.name ? 'err' : ''}
                  placeholder="Alex Morgan"
                />
                {fieldErrors.name && <span className="err-msg">{fieldErrors.name}</span>}
              </div>

              <div className="form-item">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={contactData.email} 
                  onChange={handleContactChange} 
                  className={fieldErrors.email ? 'err' : ''}
                  placeholder="alex@domain.com"
                />
                {fieldErrors.email && <span className="err-msg">{fieldErrors.email}</span>}
              </div>

              <div className="form-item full">
                <label>Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={contactData.subject} 
                  onChange={handleContactChange} 
                  className={fieldErrors.subject ? 'err' : ''}
                  placeholder="Subject of inquiry…"
                />
                {fieldErrors.subject && <span className="err-msg">{fieldErrors.subject}</span>}
              </div>

              <div className="form-item full">
                <label>Message *</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={contactData.message} 
                  onChange={handleContactChange} 
                  className={fieldErrors.message ? 'err' : ''}
                  placeholder="How can we assist you with Finora…"
                ></textarea>
                {fieldErrors.message && <span className="err-msg">{fieldErrors.message}</span>}
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <i className="ri-send-plane-fill"></i>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="finora-404-footer">
        <span>© 2026 Finora. Track. Plan. Save. Grow.</span>
        <div className="footer-links">
          <button onClick={() => setActiveModal('help')}>Help Center</button>
          <button onClick={() => setActiveModal('support')}>Contact Support</button>
          <button onClick={() => setActiveModal('privacy')}>Privacy Policy</button>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>{MODAL_DATA[activeModal]?.title}</h3>
              <button onClick={() => setActiveModal(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <p className="modal-text">{MODAL_DATA[activeModal]?.content}</p>
            <div className="modal-bottom">
              <button className="modal-dismiss" onClick={() => setActiveModal(null)}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
