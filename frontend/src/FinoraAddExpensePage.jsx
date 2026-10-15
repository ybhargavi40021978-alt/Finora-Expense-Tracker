import React, { useState, useMemo, useEffect } from 'react';
import './FinoraAddExpensePage.css';
import { expenseService } from './services/expenseService';
import { summaryService } from './services/summaryService';
import { authService } from './services/authService';
import { formatINR } from './utils/currency';

/**
 * Finora Expense Tracker — Screen 7: Add Expense Component (React)
 * Connected directly to real MongoDB backend APIs.
 */

export default function FinoraAddExpensePage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    paidFrom: 'Primary Bank Account',
    merchant: '',
    description: '',
    tags: ['Dining', 'Personal'],
    receiptName: null,
    isRecurring: false,
    recurringFrequency: 'Monthly',
    recurringStartDate: new Date().toISOString().split('T')[0],
    recurringEndDate: '',
    includeInReports: true,
    isEssential: false
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const [snapshot, setSnapshot] = useState({
    totalExpenses: 0,
    count: 0,
    highestCategory: 'None'
  });

  const [categoryExpenses, setCategoryExpenses] = useState({});

  const loadSnapshot = async () => {
    try {
      const now = new Date();
      const res = await summaryService.getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
      const sum = (res && res.summary) || {};
      const byCat = sum.expenseByCategory || [];
      const highest = byCat.length ? byCat.reduce((max, c) => c.total > max.total ? c : max, byCat[0]) : null;
      setSnapshot({
        totalExpenses: sum.totalExpenses || 0,
        count: sum.expenseCount || 0,
        highestCategory: highest ? `${highest.category} (${formatINR(highest.total)})` : 'None'
      });

      const catMap = {};
      byCat.forEach(c => {
        catMap[c.category] = c.total;
      });
      setCategoryExpenses(catMap);
    } catch (e) {
      console.warn('Expense snapshot fetch failed:', e);
    }
  };

  useEffect(() => {
    loadSnapshot();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be under 5MB', 'error');
        return;
      }
      setFormData(prev => ({ ...prev, receiptName: file.name }));
      showToast(`Receipt "${file.name}" attached.`);
    }
  };

  const removeReceipt = () => {
    setFormData(prev => ({ ...prev, receiptName: null }));
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
           formData.category !== '' &&
           formData.date !== '' &&
           formData.paymentMethod !== '';
  }, [formData]);

  // Real-time category impact calculation based on real saved spending
  const budgetInfo = useMemo(() => {
    const expenseAmt = parseFloat(formData.amount) || 0;
    const currentSpent = categoryExpenses[formData.category] || 0;
    const newSpent = currentSpent + expenseAmt;
    const defaultBudget = 15000;
    return {
      budget: defaultBudget,
      currentSpent,
      newSpent,
      remaining: Math.max(0, defaultBudget - newSpent),
      percent: Math.min(100, Math.round((newSpent / defaultBudget) * 100)),
      isExceeded: newSpent > defaultBudget,
      isWarning: newSpent > defaultBudget * 0.8 && newSpent <= defaultBudget
    };
  }, [formData.category, formData.amount, categoryExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Expense Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount greater than ₹0 is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Expense Date is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment Method is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please correct the highlighted fields before saving.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await expenseService.create({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        paidFrom: formData.paidFrom,
        merchant: formData.merchant,
        notes: formData.description,
        tags: formData.tags,
        isRecurring: formData.isRecurring,
        isEssential: formData.isEssential
      });
      showToast(`Expense of ${formatINR(formData.amount)} for "${formData.title}" saved successfully to database!`);
      setFormData(prev => ({
        ...prev,
        title: '',
        amount: '',
        merchant: '',
        description: ''
      }));
      await loadSnapshot();
    } catch (err) {
      console.error('Save expense failed:', err);
      showToast(err.message || 'Failed to save expense record to database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (val) => {
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const navItems = [
    { name: 'Dashboard', icon: 'ri-dashboard-line', href: 'dashboard.html' },
    { name: 'Transactions', icon: 'ri-exchange-dollar-line', href: 'transactions.html' },
    { name: 'Income', icon: 'ri-wallet-3-line', href: 'add-income.html' },
    { name: 'Expenses', icon: 'ri-shopping-bag-3-line', href: 'add-expense.html', active: true },
    { name: 'Analytics', icon: 'ri-pie-chart-line', href: '#' },
    { name: 'Budgets', icon: 'ri-funds-line', href: '#' },
    { name: 'Goals', icon: 'ri-flag-line', href: '#' },
    { name: 'Categories', icon: 'ri-price-tag-3-line', href: '#' },
    { name: 'Recurring', icon: 'ri-repeat-line', href: '#' },
    { name: 'Settings', icon: 'ri-settings-4-line', href: '#' },
  ];

  return (
    <div className="finora-expense-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="expense-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="expense-react-logo-area">
            <div className="expense-react-brand-icon">
              <i className="ri-donut-chart-fill" style={{ fontSize: '20px', color: '#FFFFFF' }}></i>
            </div>
            <div>
              <div className="expense-react-brand-name">Finora</div>
              <div className="expense-react-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="expense-react-nav">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`expense-react-nav-item ${item.active ? 'active' : ''}`}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="expense-react-footer">
          <a href="login.html" className="expense-react-logout">
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="expense-react-main">
        {/* Top Header */}
        <header className="expense-react-header">
          <div className="expense-react-title-group">
            <div className="expense-react-breadcrumb">
              <span>Dashboard</span> / <span>Expenses</span> / <span style={{ color: '#18213D', fontWeight: 600 }}>Add Expense</span>
            </div>
            <h1>Add Expense</h1>
            <p>Record your spending and stay in control of your money.</p>
          </div>

          <div className="expense-react-header-actions">
            <div className="expense-react-search">
              <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '11px', color: '#75809A' }}></i>
              <input type="text" placeholder="Search transactions..." aria-label="Search transactions" />
            </div>

            <button style={{ position: 'relative', background: '#F6F7FC', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }} aria-label="Notifications">
              <i className="ri-notification-3-line" style={{ color: '#18213D', fontSize: '18px' }}></i>
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#7957FF', borderRadius: '50%' }}></span>
            </button>

            <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', gap: '10px', borderLeft: '1px solid #E8EBF3', paddingLeft: '16px' }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                alt={user?.name || "User avatar"}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#18213D' }}>{user?.name || 'User'}</span>
              <i className="ri-arrow-down-s-line" style={{ color: '#75809A' }}></i>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="expense-react-content">
          {/* Page Intro Row */}
          <div className="expense-react-intro-row">
            <div>
              <h2>Add New Expense</h2>
              <p>Enter your expense details to keep your financial records accurate.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="transactions.html" className="expense-react-btn-cancel">
                Cancel
              </a>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="expense-react-btn-save"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line ri-spin"></i> Saving...
                  </>
                ) : (
                  <>
                    <i className="ri-checkbox-circle-line"></i> Save Expense
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="expense-react-grid">
            {/* LEFT COLUMN: FORM */}
            <form onSubmit={handleSubmit} className="expense-react-card" noValidate>
              <h3>Expense Details</h3>
              <p className="subtitle">Provide the information for this expense.</p>

              <div className="expense-react-form-stack">
                {/* Title */}
                <div className="expense-react-field">
                  <label htmlFor="react-expense-title">Expense Title *</label>
                  <input
                    id="react-expense-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Grocery Shopping"
                    className="expense-react-input"
                    style={errors.title ? { borderColor: '#F06575' } : {}}
                  />
                  {errors.title && <span style={{ fontSize: '0.75rem', color: '#F06575' }}>{errors.title}</span>}
                </div>

                {/* Amount */}
                <div className="expense-react-field">
                  <label htmlFor="react-expense-amount">Amount *</label>
                  <div className="expense-react-amount-box">
                    <span>₹</span>
                    <input
                      id="react-expense-amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="expense-react-input"
                      style={errors.amount ? { borderColor: '#F06575' } : {}}
                    />
                  </div>
                  {errors.amount && <span style={{ fontSize: '0.75rem', color: '#F06575' }}>{errors.amount}</span>}
                </div>

                {/* Category & Date */}
                <div className="expense-react-row-2col">
                  <div className="expense-react-field">
                    <label htmlFor="react-expense-category">Category *</label>
                    <select
                      id="react-expense-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="expense-react-input"
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills & Utilities">Bills & Utilities</option>
                      <option value="Housing & Rent">Housing & Rent</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Travel">Travel</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="expense-react-field">
                    <label htmlFor="react-expense-date">Expense Date *</label>
                    <input
                      id="react-expense-date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="expense-react-input"
                    />
                  </div>
                </div>

                {/* Payment Method & Paid From */}
                <div className="expense-react-row-2col">
                  <div className="expense-react-field">
                    <label htmlFor="react-expense-payment">Payment Method *</label>
                    <select
                      id="react-expense-payment"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="expense-react-input"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="expense-react-field">
                    <label htmlFor="react-expense-account">Paid From</label>
                    <select
                      id="react-expense-account"
                      name="paidFrom"
                      value={formData.paidFrom}
                      onChange={handleInputChange}
                      className="expense-react-input"
                    >
                      <option value="Primary Bank Account">Primary Bank Account (HDFC ····4829)</option>
                      <option value="Savings Account">Savings Account (ICICI ····9123)</option>
                      <option value="Cash Wallet">Cash Wallet</option>
                      <option value="Credit Card">Credit Card (Axis Bank ····6782)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Merchant / Recipient */}
                <div className="expense-react-field">
                  <label htmlFor="react-expense-merchant">Merchant / Recipient (Optional)</label>
                  <input
                    id="react-expense-merchant"
                    name="merchant"
                    type="text"
                    value={formData.merchant}
                    onChange={handleInputChange}
                    placeholder="e.g. Amazon, local grocery store"
                    className="expense-react-input"
                  />
                </div>

                {/* Description */}
                <div className="expense-react-field">
                  <label htmlFor="react-expense-desc">Description (Optional)</label>
                  <textarea
                    id="react-expense-desc"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add a note about this expense…"
                    className="expense-react-input"
                    style={{ height: 'auto', padding: '10px 14px' }}
                  ></textarea>
                </div>

                {/* Tags */}
                <div className="expense-react-field">
                  <label htmlFor="react-expense-tag-input">Tags (Optional)</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      id="react-expense-tag-input"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Add tag and press Enter"
                      className="expense-react-input"
                      style={{ height: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      style={{
                        padding: '0 14px',
                        background: '#F6F7FC',
                        border: '1px solid #E8EBF3',
                        borderRadius: '8px',
                        color: '#7957FF',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#F3EEFF',
                          color: '#7957FF',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                        <i
                          className="ri-close-line"
                          style={{ cursor: 'pointer' }}
                          onClick={() => removeTag(tag)}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Receipt Attachment */}
                <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #E8EBF3' }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#11183F', marginBottom: '4px' }}>Receipt & Attachments</h4>
                  <p style={{ fontSize: '0.8rem', color: '#75809A', marginBottom: '12px' }}>Attach a receipt to keep proof of your purchase.</p>

                  <div style={{
                    border: '2px dashed #E8EBF3',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#FAFAFD',
                    position: 'relative'
                  }}>
                    <i className="ri-upload-cloud-2-line" style={{ fontSize: '32px', color: '#7957FF', marginBottom: '8px', display: 'inline-block' }}></i>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#18213D' }}>Upload a receipt or invoice</div>
                    <div style={{ fontSize: '0.75rem', color: '#75809A', marginTop: '2px', marginBottom: '12px' }}>PNG, JPG, or PDF up to 5MB</div>

                    {formData.receiptName ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        background: '#FFFFFF',
                        border: '1px solid #7957FF',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#18213D'
                      }}>
                        <i className="ri-file-text-line" style={{ color: '#7957FF' }}></i>
                        <span>{formData.receiptName}</span>
                        <i className="ri-delete-bin-line" style={{ color: '#F06575', cursor: 'pointer', marginLeft: '6px' }} onClick={removeReceipt}></i>
                      </div>
                    ) : (
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 16px',
                        background: '#FFFFFF',
                        border: '1px solid #E8EBF3',
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#7957FF',
                        cursor: 'pointer'
                      }}>
                        <i className="ri-attachment-2"></i> Choose File
                        <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Additional Options */}
                <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #E8EBF3' }}>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#11183F', marginBottom: '4px' }}>Additional Options</h4>

                  {/* Recurring Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#18213D' }}>This is a recurring expense</div>
                      <div style={{ fontSize: '0.78rem', color: '#75809A' }}>Track regular payments such as rent, subscriptions, or utility bills.</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: formData.isRecurring ? '#7957FF' : '#E8EBF3',
                        borderRadius: '24px',
                        transition: '0.2s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '18px',
                          width: '18px',
                          left: formData.isRecurring ? '23px' : '3px',
                          bottom: '3px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '50%',
                          transition: '0.2s'
                        }}></span>
                      </span>
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <div style={{ background: '#F8F9FE', border: '1px solid #E8EBF3', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                      <div className="expense-react-row-2col">
                        <div className="expense-react-field">
                          <label>Frequency</label>
                          <select
                            name="recurringFrequency"
                            value={formData.recurringFrequency}
                            onChange={handleInputChange}
                            className="expense-react-input"
                          >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                          </select>
                        </div>
                        <div className="expense-react-field">
                          <label>Start Date</label>
                          <input
                            type="date"
                            name="recurringStartDate"
                            value={formData.recurringStartDate}
                            onChange={handleInputChange}
                            className="expense-react-input"
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#7957FF', marginTop: '8px' }}>
                        <i className="ri-information-line"></i> Next expected payment: 15 Nov 2026
                      </div>
                    </div>
                  )}

                  {/* Checkbox: Include in reports */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', cursor: 'pointer', fontSize: '0.84rem', color: '#18213D' }}>
                    <input
                      type="checkbox"
                      name="includeInReports"
                      checked={formData.includeInReports}
                      onChange={handleInputChange}
                      style={{ accentColor: '#7957FF' }}
                    />
                    <span>Include this expense in financial reports and analytics.</span>
                  </label>

                  {/* Checkbox: Essential expense */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer', fontSize: '0.84rem', color: '#18213D' }}>
                    <input
                      type="checkbox"
                      name="isEssential"
                      checked={formData.isEssential}
                      onChange={handleInputChange}
                      style={{ accentColor: '#7957FF' }}
                    />
                    <span>Mark this as an essential expense.</span>
                  </label>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E8EBF3' }}>
                  <a href="transactions.html" className="expense-react-btn-cancel">
                    Cancel
                  </a>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="expense-react-btn-save"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line ri-spin"></i> Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-checkbox-circle-line"></i> Save Expense
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* RIGHT COLUMN: PREVIEWS & CONTEXT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. Live Expense Preview */}
              <div className="expense-react-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3>Expense Preview</h3>
                    <p className="subtitle" style={{ marginBottom: 0 }}>Review the details before saving.</p>
                  </div>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: isFormValid ? '#EAF8F1' : '#F6F7FC',
                    color: isFormValid ? '#23B981' : '#75809A'
                  }}>
                    {isFormValid ? 'Ready to save' : 'Complete required fields'}
                  </span>
                </div>

                {/* Amount Callout */}
                <div className="expense-react-preview-amount">
                  <div>
                    <h4>Expense Amount</h4>
                    <div className="val">
                      -₹{formData.amount && parseFloat(formData.amount) > 0 ? formatINR(formData.amount) : '0.00'}
                    </div>
                  </div>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'rgba(240, 101, 117, 0.12)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F06575'
                  }}>
                    <i className="ri-shopping-bag-3-line" style={{ fontSize: '20px' }}></i>
                  </div>
                </div>

                <div className="expense-react-preview-list">
                  <div className="expense-react-preview-row">
                    <span style={{ color: '#75809A' }}>Title</span>
                    <span style={{ fontWeight: 600, color: '#18213D' }}>{formData.title || 'Untitled Expense'}</span>
                  </div>
                  <div className="expense-react-preview-row">
                    <span style={{ color: '#75809A' }}>Category</span>
                    <span style={{ fontWeight: 600, color: '#7957FF' }}>{formData.category}</span>
                  </div>
                  <div className="expense-react-preview-row">
                    <span style={{ color: '#75809A' }}>Date</span>
                    <span style={{ fontWeight: 500 }}>{formData.date || 'Not selected'}</span>
                  </div>
                  <div className="expense-react-preview-row">
                    <span style={{ color: '#75809A' }}>Payment Method</span>
                    <span style={{ fontWeight: 500 }}>{formData.paymentMethod}</span>
                  </div>
                  <div className="expense-react-preview-row">
                    <span style={{ color: '#75809A' }}>Paid From</span>
                    <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>{formData.paidFrom}</span>
                  </div>
                  {formData.merchant && (
                    <div className="expense-react-preview-row">
                      <span style={{ color: '#75809A' }}>Merchant</span>
                      <span style={{ fontWeight: 500 }}>{formData.merchant}</span>
                    </div>
                  )}
                  {formData.description && (
                    <div className="expense-react-preview-row">
                      <span style={{ color: '#75809A' }}>Description</span>
                      <span style={{ fontWeight: 500, fontStyle: 'italic', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formData.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Monthly Spending Snapshot */}
              <div className="expense-react-card">
                <h3>Monthly Spending Snapshot</h3>
                <p className="subtitle">October 2026</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'rgba(240, 101, 117, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F06575' }}>
                        <i className="ri-funds-line"></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#75809A' }}>Total Expenses This Month</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18213D' }}>₹{formatINR(snapshot.totalExpenses)}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8EBF3', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.84rem', color: '#75809A' }}>Number of Records</span>
                    <span style={{ fontWeight: 600, color: '#18213D' }}>{snapshot.count}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', color: '#75809A' }}>Highest Spending</span>
                    <span style={{ fontWeight: 600, color: '#7957FF' }}>{snapshot.highestCategory}</span>
                  </div>

                  {/* Distribution bar */}
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#75809A', marginBottom: '6px' }}>
                      <span>Current Total Expenses</span>
                      <span style={{ fontWeight: 600, color: '#18213D' }}>₹{formatINR(snapshot.totalExpenses)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Budget Impact */}
              <div className="expense-react-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Budget Impact</h3>
                  <span style={{ fontSize: '0.78rem', color: '#7957FF', fontWeight: 600 }}>{formData.category}</span>
                </div>
                <p className="subtitle">Real-time category budget allocation.</p>

                {budgetInfo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: '#75809A' }}>Category Budget</span>
                      <span style={{ fontWeight: 600 }}>₹{formatINR(budgetInfo.budget)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: '#75809A' }}>Amount Spent</span>
                      <span style={{ fontWeight: 600, color: budgetInfo.isExceeded ? '#F06575' : '#18213D' }}>
                        ₹{formatINR(budgetInfo.newSpent)} {parseFloat(formData.amount) > 0 && <span style={{ fontSize: '0.75rem', color: '#75809A' }}>(+₹{formatINR(formData.amount)})</span>}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: '#75809A' }}>Remaining Budget</span>
                      <span style={{ fontWeight: 600, color: budgetInfo.isExceeded ? '#F06575' : '#23B981' }}>
                        ₹{formatINR(budgetInfo.remaining)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', background: '#F1F3F9', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${budgetInfo.percent}%`,
                          backgroundColor: budgetInfo.isExceeded ? '#F06575' : budgetInfo.isWarning ? '#F5B544' : '#7957FF',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      ></div>
                    </div>

                    {budgetInfo.isExceeded && (
                      <div style={{ fontSize: '0.75rem', color: '#F06575', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <i className="ri-error-warning-line"></i> This expense exceeds your monthly budget for {formData.category}!
                      </div>
                    )}
                    {budgetInfo.isWarning && (
                      <div style={{ fontSize: '0.75rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <i className="ri-alert-line"></i> You have used {budgetInfo.percent}% of your {formData.category} budget.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: '#75809A', fontSize: '0.84rem' }}>
                    <i className="ri-information-line" style={{ fontSize: '20px', color: '#7957FF' }}></i>
                    <p style={{ marginTop: '4px' }}>No budget set for this category</p>
                    <a href="#" style={{ color: '#7957FF', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>Set Budget</a>
                  </div>
                )}
              </div>

              {/* 4. Smart Spending Tip */}
              <div className="expense-react-tip">
                <div style={{ width: '36px', height: '36px', background: '#FFFFFF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7957FF', flexShrink: 0, boxShadow: '0 2px 8px rgba(121, 87, 255, 0.15)' }}>
                  <i className="ri-lightbulb-line" style={{ fontSize: '20px' }}></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#11183F', marginBottom: '4px' }}>Smart Tip</h4>
                  <p style={{ fontSize: '0.8rem', color: '#75809A', lineHeight: 1.5 }}>
                    Categorizing expenses consistently helps you identify spending patterns and make better budget decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toastMessage.type === 'error' ? '#F06575' : '#11183F',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(17, 24, 63, 0.25)',
          fontSize: '0.875rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000
        }}>
          <i className={toastMessage.type === 'error' ? 'ri-error-warning-line' : 'ri-checkbox-circle-fill'} style={{ color: toastMessage.type === 'error' ? '#FFFFFF' : '#23B981' }}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
