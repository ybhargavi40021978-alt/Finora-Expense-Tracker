import React, { useState, useMemo, useEffect } from 'react';
import './FinoraAddIncomePage.css';
import { incomeService } from './services/incomeService';
import { summaryService } from './services/summaryService';
import { authService } from './services/authService';
import { formatINR } from './utils/currency';

/**
 * Finora Expense Tracker — Screen 6: Add Income Component (React)
 * Connected directly to real MongoDB backend APIs.
 */

export default function FinoraAddIncomePage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0],
    payment: 'Bank Transfer',
    account: 'Primary Bank Account',
    description: '',
    tags: ['Monthly', 'Work'],
    isRecurring: false,
    recurringFrequency: 'Monthly',
    recurringStartDate: new Date().toISOString().split('T')[0],
    recurringEndDate: '',
    includeInReports: true
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [snapshot, setSnapshot] = useState({
    totalIncome: 0,
    count: 0,
    largest: 'None'
  });

  const loadSnapshot = async () => {
    try {
      const now = new Date();
      const res = await summaryService.getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
      const sum = (res && res.summary) || {};
      const byCat = sum.incomeByCategory || [];
      const largestCat = byCat.length ? byCat.reduce((max, c) => c.total > max.total ? c : max, byCat[0]) : null;
      setSnapshot({
        totalIncome: sum.totalIncome || 0,
        count: sum.incomeCount || 0,
        largest: largestCat ? `${largestCat.category} (${formatINR(largestCat.total)})` : 'None'
      });
    } catch (e) {
      console.warn('Snapshot fetch failed:', e);
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addTag = (tagToAdd) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const isFormValid = useMemo(() => {
    return formData.title.trim() !== '' &&
           parseFloat(formData.amount) > 0 &&
           formData.date !== '';
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than zero';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors in the form before saving.');
      return;
    }

    try {
      setIsSubmitting(true);
      await incomeService.create({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.source,
        date: formData.date,
        paymentMethod: formData.payment,
        depositAccount: formData.account,
        notes: formData.description,
        tags: formData.tags,
        isRecurring: formData.isRecurring
      });
      showToast(`Income "${formData.title}" saved successfully to database!`);
      setFormData(prev => ({
        ...prev,
        title: '',
        amount: '',
        description: ''
      }));
      await loadSnapshot();
    } catch (err) {
      console.error('Save income failed:', err);
      showToast(err.message || 'Failed to save income record to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="finora-income-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="income-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="income-react-logo-area">
            <div className="income-react-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <div>
              <div className="income-react-brand-name">Finora</div>
              <div className="income-react-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="income-react-nav">
            <a href="dashboard.html" className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
              <span>Dashboard</span>
            </a>
            <a href="transactions.html" className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>Transactions</span>
            </a>
            <button className="income-react-nav-item active">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Income</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Expenses</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Analytics</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              <span>Budgets</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <span>Goals</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span>Categories</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              <span>Recurring</span>
            </button>
            <button className="income-react-nav-item">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="income-react-footer">
          <a href="login.html" className="income-react-logout">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="income-react-main">
        {/* Header */}
        <header className="income-react-header">
          <div className="income-react-title-group">
            <div className="income-react-breadcrumb">
              <a href="dashboard.html" style={{ color: '#75809A', textDecoration: 'none' }}>Dashboard</a> / 
              <a href="transactions.html" style={{ color: '#75809A', textDecoration: 'none' }}>Income</a> / 
              <span style={{ color: '#7957FF', fontWeight: 600 }}>Add Income</span>
            </div>
            <h1>Add Income</h1>
            <p>Record your earnings and keep your finances up to date.</p>
          </div>

          <div className="income-react-header-actions">
            <div className="income-react-search">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="income-react-user" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} alt={user?.name || "User"} style={{ width: 34, height: 34, borderRadius: 9999, border: '1.5px solid #C7B8FF' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="income-react-content">
          <div className="income-react-intro-row">
            <div>
              <h2>Add New Income</h2>
              <p>Add a new income record with its source, amount, and payment details.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="transactions.html" className="income-react-btn-cancel">Cancel</a>
              <button className="income-react-btn-save" onClick={handleSubmit} disabled={isSubmitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Save Income</span>
              </button>
            </div>
          </div>

          <div className="income-react-grid">
            {/* Form */}
            <div className="income-react-card">
              <h3>Income Details</h3>
              <p className="subtitle">Enter the basic information for this income record.</p>

              <form onSubmit={handleSubmit} className="income-react-form-stack">
                <div className="income-react-field">
                  <label>Income Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    className="income-react-input" 
                    placeholder="e.g. Monthly Salary" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                  />
                  {errors.title && <span style={{ color: '#F06575', fontSize: '0.75rem' }}>{errors.title}</span>}
                </div>

                <div className="income-react-field">
                  <label>Amount *</label>
                  <div className="income-react-amount-box">
                    <span>₹</span>
                    <input 
                      type="number" 
                      name="amount" 
                      className="income-react-input" 
                      placeholder="0.00" 
                      value={formData.amount} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  {errors.amount && <span style={{ color: '#F06575', fontSize: '0.75rem' }}>{errors.amount}</span>}
                </div>

                <div className="income-react-row-2col">
                  <div className="income-react-field">
                    <label>Income Source *</label>
                    <select name="source" className="income-react-input" value={formData.source} onChange={handleInputChange}>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Business">Business</option>
                      <option value="Investments">Investments</option>
                      <option value="Rental Income">Rental Income</option>
                      <option value="Bonus">Bonus</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="income-react-field">
                    <label>Date Received *</label>
                    <input 
                      type="date" 
                      name="date" 
                      className="income-react-input" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="income-react-row-2col">
                  <div className="income-react-field">
                    <label>Payment Method *</label>
                    <select name="payment" className="income-react-input" value={formData.payment} onChange={handleInputChange}>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="income-react-field">
                    <label>Deposit Account</label>
                    <select name="account" className="income-react-input" value={formData.account} onChange={handleInputChange}>
                      <option value="Primary Bank Account">Primary Bank Account (HDFC ••4021)</option>
                      <option value="Savings Account">Savings Account (ICICI ••8829)</option>
                      <option value="Cash Wallet">Cash Wallet</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="income-react-field">
                  <label>Description (Optional)</label>
                  <textarea 
                    name="description" 
                    rows="2" 
                    className="income-react-input" 
                    style={{ height: 'auto', padding: '10px 14px' }}
                    placeholder="Add notes about this income…" 
                    value={formData.description} 
                    onChange={handleInputChange}
                  />
                </div>

                {/* Tags */}
                <div className="income-react-field">
                  <label>Tags</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {formData.tags.map(tag => (
                      <span key={tag} style={{ background: '#F0EDFF', color: '#7957FF', padding: '3px 10px', borderRadius: 9999, fontSize: '0.775rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} style={{ border: 'none', background: 'transparent', color: '#7957FF', cursor: 'pointer' }}>✕</button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    className="income-react-input" 
                    placeholder="Add tag and press Enter..." 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                  />
                </div>

                {/* Recurring */}
                <div style={{ borderTop: '1px solid #E8EBF3', paddingTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="isRecurring" 
                      checked={formData.isRecurring} 
                      onChange={handleInputChange} 
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>This is recurring income</span>
                  </label>
                </div>
              </form>
            </div>

            {/* Right Column: Preview & Snapshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Preview Card */}
              <div className="income-react-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Income Preview</h3>
                  <span style={{ 
                    padding: '3px 8px', 
                    borderRadius: 9999, 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    background: isFormValid ? 'rgba(35, 185, 129, 0.12)' : 'rgba(245, 181, 68, 0.14)', 
                    color: isFormValid ? '#138E61' : '#C48512' 
                  }}>
                    {isFormValid ? 'Ready to save' : 'Drafting'}
                  </span>
                </div>

                <div className="income-react-preview-amount">
                  <div>
                    <h4>Income Amount</h4>
                    <div className="val">
                      {parseFloat(formData.amount) > 0 ? `+₹${parseFloat(formData.amount).toLocaleString('en-IN')}` : '₹0.00'}
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(35, 185, 129, 0.12)', color: '#23B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="16" cy="14" r="1.5"/></svg>
                  </div>
                </div>

                <div className="income-react-preview-list">
                  <div className="income-react-preview-row">
                    <span style={{ color: '#75809A' }}>Title</span>
                    <span style={{ fontWeight: 600 }}>{formData.title || 'Monthly Salary'}</span>
                  </div>
                  <div className="income-react-preview-row">
                    <span style={{ color: '#75809A' }}>Source</span>
                    <span style={{ fontWeight: 600 }}>{formData.source}</span>
                  </div>
                  <div className="income-react-preview-row">
                    <span style={{ color: '#75809A' }}>Date</span>
                    <span style={{ fontWeight: 600 }}>{formData.date}</span>
                  </div>
                  <div className="income-react-preview-row">
                    <span style={{ color: '#75809A' }}>Payment</span>
                    <span style={{ fontWeight: 600 }}>{formData.payment}</span>
                  </div>
                </div>
              </div>

              {/* Snapshot Card */}
              <div className="income-react-card">
                <h3>Monthly Income Snapshot</h3>
                <p className="subtitle">October 2026 performance</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F6F7FC', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#75809A' }}>Total Income This Month</span>
                    <span style={{ fontWeight: 700, color: '#138E61' }}>₹{snapshot.totalIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F6F7FC', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#75809A' }}>Number of Records</span>
                    <span style={{ fontWeight: 700 }}>{snapshot.count}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F6F7FC', borderRadius: 8 }}>
                    <span style={{ fontSize: '0.8125rem', color: '#75809A' }}>Largest Source</span>
                    <span style={{ fontWeight: 700 }}>{snapshot.largest}</span>
                  </div>
                </div>
              </div>

              {/* Tip Card */}
              <div className="income-react-tip">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7957FF" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#11183F', marginBottom: 2 }}>Smart Tip</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#4A5578', lineHeight: 1.4 }}>
                    Record income when you receive it to keep your balance and financial reports accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#171D4C',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          fontSize: '0.875rem',
          fontWeight: 500,
          borderLeft: '4px solid #23B981',
          zIndex: 300
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
