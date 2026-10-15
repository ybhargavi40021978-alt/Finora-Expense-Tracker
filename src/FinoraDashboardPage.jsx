import React, { useState, useMemo, useEffect } from 'react';
import './FinoraDashboardPage.css';
import { summaryService } from './services/summaryService';
import { transactionService } from './services/transactionService';
import { incomeService } from './services/incomeService';
import { expenseService } from './services/expenseService';
import { authService } from './services/authService';
import { formatINR } from './utils/currency';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', pct: 0, color: '#7957FF', amount: '₹0' },
  { name: 'Transport', pct: 0, color: '#48B9F5', amount: '₹0' },
  { name: 'Shopping', pct: 0, color: '#F06575', amount: '₹0' },
  { name: 'Bills & Utilities', pct: 0, color: '#F5B544', amount: '₹0' },
  { name: 'Others', pct: 0, color: '#C7B8FF', amount: '₹0' }
];

const PERIOD_OPTIONS = ['This Month', 'Last Month', 'This Quarter', 'This Year'];

/**
 * Finora Expense Tracker — Screen 4: Dashboard Component (React)
 * Connected directly to real MongoDB backend aggregations and transactions.
 */

export default function FinoraDashboardPage({ onLogout }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
    else if (hour >= 17) timeGreeting = 'Good Evening';
    const u = authService.getCurrentUser();
    const name = u ? (u.name || u.displayName || 'User').split(' ')[0] : 'User';
    return `${timeGreeting}, ${name}! 👋`;
  });
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metrics, setMetrics] = useState({
    balance: 0,
    balanceDiff: '0%',
    income: 0,
    incomeDiff: '0%',
    expenses: 0,
    expensesDiff: '0%',
    savings: 0,
    savingsDiff: '0%'
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Food');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Donut hover highlight
  const [activeCategory, setActiveCategory] = useState(null);

  // Load real data from backend
  const loadDashboardData = async () => {
    try {
      const now = new Date();
      const [sumRes, txnRes, userRes] = await Promise.all([
        summaryService.getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
        transactionService.getTransactions({ limit: 10 }),
        authService.getMe().catch(() => null)
      ]);

      if (userRes && (userRes.user || userRes.data)) {
        const u = userRes.user || userRes.data;
        setUser(u);
        const hour = new Date().getHours();
        let timeGreeting = 'Good Morning';
        if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
        else if (hour >= 17) timeGreeting = 'Good Evening';
        const name = (u.name || u.displayName || 'User').split(' ')[0];
        setGreeting(`${timeGreeting}, ${name}! 👋`);
      }

      const sum = (sumRes && sumRes.summary) || {};
      const inc = sum.totalIncome || 0;
      const exp = sum.totalExpenses || 0;
      const bal = inc - exp;

      setMetrics({
        balance: bal,
        balanceDiff: '0%',
        income: inc,
        incomeDiff: '0%',
        expenses: exp,
        expensesDiff: '0%',
        savings: bal,
        savingsDiff: '0%'
      });

      setCategories((sum.expenseByCategory || []).map(c => ({
        name: c.category,
        pct: c.percentage,
        color: c.color || '#7957FF',
        amount: formatINR(c.total)
      })));

      setTransactions((txnRes && txnRes.transactions || []).map(t => ({
        id: t._id,
        title: t.title,
        meta: t.type === 'expense' ? (t.merchant || t.paidFrom || 'Expense') : (t.depositAccount || 'Income'),
        category: t.category,
        date: t.date ? new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        amount: t.amount,
        type: t.type,
        status: 'Completed'
      })));
    } catch (e) {
      console.warn('Dashboard data fetch failed:', e);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(tx => 
      tx.title.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q) ||
      (tx.meta && tx.meta.toLowerCase().includes(q))
    );
  }, [transactions, searchQuery]);

  const handleOpenAddModal = (type = 'expense') => {
    setModalType(type);
    setFormCategory(type === 'income' ? 'Salary' : 'Food');
    setModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (!formTitle.trim() || isNaN(amt) || amt <= 0) return;

    try {
      if (modalType === 'income') {
        await incomeService.createIncome({
          title: formTitle.trim(),
          amount: amt,
          category: formCategory,
          incomeDate: formDate
        });
      } else {
        await expenseService.createExpense({
          title: formTitle.trim(),
          amount: amt,
          category: formCategory,
          expenseDate: formDate
        });
      }

      setModalOpen(false);
      setFormTitle('');
      setFormAmount('');
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to save record to database');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ===================================================================
          1. LEFT SIDEBAR NAVIGATION (~220 px width, Dark Indigo)
          =================================================================== */}
      <aside className="sidebar" aria-label="Main Navigation">
        <div>
          {/* Logo Section */}
          <div className="sidebar-logo-area">
            <a href="index.html" className="sidebar-brand-link">
              <div className="sidebar-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                  <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                  <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                  <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="19" cy="2" r="2" fill="#43D9A3" />
                </svg>
              </div>
              <span className="sidebar-brand-name">Finora</span>
            </a>
          </div>

          {/* 10 Navigation Items Vertically in Exact Required Order */}
          <nav className="sidebar-nav" aria-label="Sidebar Menu">
            <a href="#dashboard" className="nav-item-link active">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </span>
              <span>Dashboard</span>
            </a>

            <a href="#transactions" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              <span>Transactions</span>
            </a>

            <a href="#income" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <span>Income</span>
            </a>

            <a href="#expenses" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </span>
              <span>Expenses</span>
            </a>

            <a href="#analytics" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </span>
              <span>Analytics</span>
            </a>

            <a href="#budgets" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </span>
              <span>Budgets</span>
            </a>

            <a href="#goals" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span>Goals</span>
            </a>

            <a href="#categories" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <span>Categories</span>
            </a>

            <a href="#recurring" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </span>
              <span>Recurring</span>
            </a>

            <a href="#settings" className="nav-item-link">
              <span className="nav-icon">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </span>
              <span>Settings</span>
            </a>
          </nav>
        </div>

        {/* Bottom Sidebar Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="nav-item-logout"
            onClick={() => {
              if (onLogout) onLogout();
              else window.location.href = 'login.html';
            }}
          >
            <span className="nav-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================
          2. MAIN WORKSPACE (Light #F6F7FC)
          =================================================================== */}
      <main className="main-workspace">
        {/* Workspace Top Header Bar */}
        <header className="workspace-header">
          <div className="header-title-group">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Here's your financial overview.</p>
          </div>

          <div className="header-actions-group">
            {/* Search Box */}
            <div className="header-search-box">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="btn-notification"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18213D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-dot" />
            </button>

            {/* Notifications Popover */}
            {notifOpen && (
              <div className="notifications-popover open">
                <div className="notif-header">Notifications (3)</div>
                <div className="notif-list">
                  <div className="notif-item">
                    <strong>Budget Alert</strong>
                    Shopping budget is at 82% of monthly threshold.
                  </div>
                  <div className="notif-item">
                    <strong>Salary Credited</strong>
                    ₹45,000 deposited by TechCorp India.
                  </div>
                  <div className="notif-item">
                    <strong>Goal Progress</strong>
                    Emergency Fund is now at 84% completion!
                  </div>
                </div>
              </div>
            )}

            <div className="header-divider" />

            {/* User Profile */}
            <div
              className="user-profile-menu"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#7957FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8125rem', overflow: 'hidden' }}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="user-avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{(user?.name || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="chevron-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>

              {profileOpen && (
                <div className="profile-dropdown-popover open">
                  <button className="dropdown-item" onClick={() => window.location.href = 'settings.html'}>My Profile</button>
                  <button className="dropdown-item" onClick={() => window.location.href = 'settings.html'}>Account Settings</button>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      if (onLogout) onLogout();
                      else authService.logout();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="workspace-content">
          {/* Welcome & Date Row */}
          <section className="welcome-date-row">
            <div className="welcome-title-group">
              <h2 className="welcome-heading">{greeting}</h2>
              <p className="welcome-subtext">Here's how your money is looking this month.</p>
            </div>

            <div className="date-selector-wrapper">
              <button
                type="button"
                className="btn-date-selector"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              >
                <span className="date-calendar-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span>{selectedPeriod}</span>
                <span className="chevron-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {dateDropdownOpen && (
                <div className="date-dropdown-menu open">
                  {PERIOD_OPTIONS.map((period) => (
                    <button
                      key={period}
                      className={`date-option-btn ${selectedPeriod === period ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setDateDropdownOpen(false);
                      }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 4 Summary Cards */}
          <section className="summary-cards-grid">
            {/* Card 1: Balance */}
            <div className="summary-card">
              <div className="card-top-row">
                <span className="card-label">Total Balance</span>
                <div className="card-icon-bubble bubble-violet">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                    <circle cx="18" cy="14" r="1" />
                  </svg>
                </div>
              </div>
              <div className="card-main-amount">₹{metrics.balance.toLocaleString('en-IN')}</div>
              <div className="card-indicator-row">
                <span className="trend-badge positive">{metrics.balanceDiff}</span>
                <span>vs last month</span>
              </div>
            </div>

            {/* Card 2: Income */}
            <div className="summary-card">
              <div className="card-top-row">
                <span className="card-label">Total Income</span>
                <div className="card-icon-bubble bubble-mint">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
              </div>
              <div className="card-main-amount">₹{metrics.income.toLocaleString('en-IN')}</div>
              <div className="card-indicator-row">
                <span className="trend-badge positive">{metrics.incomeDiff}</span>
                <span>vs last month</span>
              </div>
            </div>

            {/* Card 3: Expenses */}
            <div className="summary-card">
              <div className="card-top-row">
                <span className="card-label">Total Expenses</span>
                <div className="card-icon-bubble bubble-coral">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                  </svg>
                </div>
              </div>
              <div className="card-main-amount">₹{metrics.expenses.toLocaleString('en-IN')}</div>
              <div className="card-indicator-row">
                <span className="trend-badge negative">{metrics.expensesDiff}</span>
                <span>vs last month</span>
              </div>
            </div>

            {/* Card 4: Net Savings */}
            <div className="summary-card">
              <div className="card-top-row">
                <span className="card-label">Net Savings</span>
                <div className="card-icon-bubble bubble-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-2.5 1-3.5-.5-6-1-6" />
                    <circle cx="15" cy="9" r="1" />
                  </svg>
                </div>
              </div>
              <div className="card-main-amount">₹{metrics.savings.toLocaleString('en-IN')}</div>
              <div className="card-indicator-row">
                <span className="trend-badge positive">{metrics.savingsDiff}</span>
                <span>vs last month</span>
              </div>
            </div>
          </section>

          {/* Main Analytics Section */}
          <section className="analytics-section-grid">
            {/* Chart A: Income vs Expenses */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-title-area">
                  <h3 className="chart-title">Income vs Expenses</h3>
                  <span className="chart-subtitle">Track your cash flow over time.</span>
                </div>
                <div className="period-toggle-pill">
                  <button
                    className={`btn-period-tab ${chartPeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setChartPeriod('monthly')}
                  >
                    Monthly
                  </button>
                  <button
                    className={`btn-period-tab ${chartPeriod === 'yearly' ? 'active' : ''}`}
                    onClick={() => setChartPeriod('yearly')}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="chart-content-area">
                <div className="chart-legend-row">
                  <span className="legend-item">
                    <span className="legend-dot income" />
                    Income
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot expense" />
                    Expenses
                  </span>
                </div>

                <div className="bar-chart-stage">
                  <svg viewBox="0 0 540 180" preserveAspectRatio="none">
                    <line x1="40" y1="20" x2="520" y2="20" className="chart-grid-line" />
                    <text x="32" y="24" textAnchor="end" className="axis-text">₹80k</text>
                    <line x1="40" y1="60" x2="520" y2="60" className="chart-grid-line" />
                    <text x="32" y="64" textAnchor="end" className="axis-text">₹60k</text>
                    <line x1="40" y1="100" x2="520" y2="100" className="chart-grid-line" />
                    <text x="32" y="104" textAnchor="end" className="axis-text">₹40k</text>
                    <line x1="40" y1="140" x2="520" y2="140" className="chart-grid-line" />
                    <text x="32" y="144" textAnchor="end" className="axis-text">₹20k</text>
                    <line x1="40" y1="160" x2="520" y2="160" stroke="#CBD5E1" strokeWidth="1.2" />

                    {/* Jan-Jun Bars */}
                    {[
                      { m: 'Jan', ix: 62, iy: 55, ih: 105, ex: 82, ey: 112, eh: 48, tx: 80 },
                      { m: 'Feb', ix: 142, iy: 48, ih: 112, ex: 162, ey: 104, eh: 56, tx: 160 },
                      { m: 'Mar', ix: 222, iy: 62, ih: 98, ex: 242, ey: 94, eh: 66, tx: 240 },
                      { m: 'Apr', ix: 302, iy: 32, ih: 128, ex: 322, ey: 102, eh: 58, tx: 320 },
                      { m: 'May', ix: 382, iy: 45, ih: 115, ex: 402, ey: 108, eh: 52, tx: 400 },
                      { m: 'Jun', ix: 462, iy: 38, ih: 122, ex: 482, ey: 110, eh: 50, tx: 480 }
                    ].map((b) => (
                      <g key={b.m} className="bar-group">
                        <rect x={b.ix} y={b.iy} width="16" height={b.ih} className="bar-income" />
                        <rect x={b.ex} y={b.ey} width="16" height={b.eh} className="bar-expense" />
                        <text x={b.tx} y="174" textAnchor="middle" className="axis-text">{b.m}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Chart B: Category Donut Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-title-area">
                  <h3 className="chart-title">Spending by Category</h3>
                  <span className="chart-subtitle">Where your money goes.</span>
                </div>
              </div>

              <div className="donut-chart-container">
                <div className="donut-visual-box">
                  <svg viewBox="0 0 100 100" className="donut-svg">
                    <circle cx="50" cy="50" r="38" className="donut-segment" stroke="#7957FF" strokeDasharray="34 66" strokeDashoffset="0" onMouseEnter={() => setActiveCategory((categories.length > 0 ? categories : DEFAULT_CATEGORIES)[0])} onMouseLeave={() => setActiveCategory(null)} />
                    <circle cx="50" cy="50" r="38" className="donut-segment" stroke="#48B9F5" strokeDasharray="22 78" strokeDashoffset="-34" onMouseEnter={() => setActiveCategory((categories.length > 0 ? categories : DEFAULT_CATEGORIES)[1])} onMouseLeave={() => setActiveCategory(null)} />
                    <circle cx="50" cy="50" r="38" className="donut-segment" stroke="#F06575" strokeDasharray="15 85" strokeDashoffset="-56" onMouseEnter={() => setActiveCategory((categories.length > 0 ? categories : DEFAULT_CATEGORIES)[2])} onMouseLeave={() => setActiveCategory(null)} />
                    <circle cx="50" cy="50" r="38" className="donut-segment" stroke="#F5B544" strokeDasharray="12 88" strokeDashoffset="-71" onMouseEnter={() => setActiveCategory((categories.length > 0 ? categories : DEFAULT_CATEGORIES)[3])} onMouseLeave={() => setActiveCategory(null)} />
                    <circle cx="50" cy="50" r="38" className="donut-segment" stroke="#C7B8FF" strokeDasharray="17 83" strokeDashoffset="-83" onMouseEnter={() => setActiveCategory((categories.length > 0 ? categories : DEFAULT_CATEGORIES)[4])} onMouseLeave={() => setActiveCategory(null)} />
                  </svg>

                  <div className="donut-center-info">
                    <span className="donut-center-amount">
                      {activeCategory ? activeCategory.amount : `₹${metrics.expenses.toLocaleString('en-IN')}`}
                    </span>
                    <span className="donut-center-label">
                      {activeCategory ? activeCategory.name : 'Total expenses'}
                    </span>
                  </div>
                </div>

                {/* Category Legend */}
                <div className="category-legend-list">
                  {(categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((cat) => (
                    <div
                      key={cat.name}
                      className="category-legend-item"
                      onMouseEnter={() => setActiveCategory(cat)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <span className="cat-dot-name">
                        <span className="cat-dot" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="cat-pct">{cat.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Transactions & Quick Actions */}
          <section className="transactions-actions-row">
            <div className="transactions-card">
              <div className="transactions-header">
                <div className="tx-title-area">
                  <h3 className="tx-title">Recent Transactions</h3>
                  <span className="tx-subtitle">A quick look at your latest activity.</span>
                </div>
                <div className="tx-header-actions">
                  <a href="#view-all" className="link-view-all">View All</a>
                  <button type="button" className="btn-add-transaction" onClick={() => handleOpenAddModal('expense')}>
                    + Add Transaction
                  </button>
                </div>
              </div>

              <div className="transactions-table-wrapper">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <div className="tx-entity-cell">
                            <div className={`tx-icon-bubble ${tx.type === 'income' ? 'bubble-mint' : 'bubble-violet'}`}>
                              {tx.type === 'income' ? '₹' : '•'}
                            </div>
                            <div className="tx-info">
                              <span className="tx-name">{tx.title}</span>
                              <span className="tx-meta">{tx.meta}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`category-pill pill-${tx.category.toLowerCase()}`}>
                            {tx.category}
                          </span>
                        </td>
                        <td>{tx.date}</td>
                        <td className={`amount-cell ${tx.type}`}>
                          {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className="status-badge">
                            <span className="status-dot" />
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="btn-row-action" title="More options">
                            •••
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="quick-actions-card">
              <h3 className="quick-actions-title">Quick Actions</h3>
              <div className="quick-actions-grid">
                <button type="button" className="quick-action-tile" onClick={() => handleOpenAddModal('income')}>
                  <div className="tile-icon-bubble bubble-mint">+</div>
                  <span className="tile-label">Add Income</span>
                </button>
                <button type="button" className="quick-action-tile" onClick={() => handleOpenAddModal('expense')}>
                  <div className="tile-icon-bubble bubble-coral">−</div>
                  <span className="tile-label">Add Expense</span>
                </button>
                <button type="button" className="quick-action-tile" onClick={() => alert('Opening budget modal...')}>
                  <div className="tile-icon-bubble bubble-violet">📊</div>
                  <span className="tile-label">Set Budget</span>
                </button>
                <button type="button" className="quick-action-tile" onClick={() => alert('Opening goals modal...')}>
                  <div className="tile-icon-bubble bubble-blue">🎯</div>
                  <span className="tile-label">Create Goal</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Add Transaction Modal */}
      {modalOpen && (
        <div className="modal-backdrop open" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Transaction</h3>
              <button type="button" className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="modal-type-toggle">
              <button
                type="button"
                className={`btn-type-tab ${modalType === 'expense' ? 'active expense' : ''}`}
                onClick={() => setModalType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`btn-type-tab ${modalType === 'income' ? 'active income' : ''}`}
                onClick={() => setModalType('income')}
              >
                Income
              </button>
            </div>

            <form className="modal-form" onSubmit={handleAddSubmit}>
              <div className="form-field-group">
                <label>Description / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy, Netflix, Freelance"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group">
                <label>Category</label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Income">Salary / Income</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-field-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  min="1"
                  step="1"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit-tx">Save Transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
