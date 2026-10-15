import React, { useState, useMemo } from 'react';
import './FinoraBudgetPage.css';
import { authService } from './services/authService';

/**
 * Finora Expense Tracker — Screen 9: Budget Management Component (React)
 * Production-ready React implementation following the Finora brand identity and design system.
 */

export default function FinoraBudgetPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [period, setPeriod] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortKey, setSortKey] = useState('Category Name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [budgets, setBudgets] = useState([
    {
      id: 'b-1',
      name: 'Food & Dining',
      category: 'Food & Dining',
      budget: 10000,
      spent: 6200,
      icon: 'ri-restaurant-line',
      color: '#7957FF',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-2',
      name: 'Transportation',
      category: 'Transportation',
      budget: 5000,
      spent: 3800,
      icon: 'ri-car-line',
      color: '#48B9F5',
      threshold: 75,
      period: 'Monthly'
    },
    {
      id: 'b-3',
      name: 'Shopping',
      category: 'Shopping',
      budget: 8000,
      spent: 7500,
      icon: 'ri-shopping-bag-3-line',
      color: '#F5B544',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-4',
      name: 'Bills & Utilities',
      category: 'Bills & Utilities',
      budget: 6000,
      spent: 4200,
      icon: 'ri-flashlight-line',
      color: '#23B981',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-5',
      name: 'Entertainment',
      category: 'Entertainment',
      budget: 3000,
      spent: 3400,
      icon: 'ri-gamepad-line',
      color: '#F06575',
      threshold: 90,
      period: 'Monthly'
    },
    {
      id: 'b-6',
      name: 'Healthcare',
      category: 'Healthcare',
      budget: 4000,
      spent: 1500,
      icon: 'ri-heart-pulse-line',
      color: '#23B981',
      threshold: 80,
      period: 'Monthly'
    },
    {
      id: 'b-7',
      name: 'Housing & Rent',
      category: 'Housing & Rent',
      budget: 10000,
      spent: 5000,
      icon: 'ri-home-4-line',
      color: '#7957FF',
      threshold: 90,
      period: 'Monthly'
    },
    {
      id: 'b-8',
      name: 'Subscriptions',
      category: 'Subscriptions',
      budget: 2000,
      spent: 1200,
      icon: 'ri-repeat-line',
      color: '#C7B8FF',
      threshold: 75,
      period: 'Monthly'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Food & Dining',
    budget: '',
    period: 'Monthly',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    threshold: 80,
    description: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const formatINR = (val) => {
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Summaries calculation
  const summaries = useMemo(() => {
    const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const usage = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0';
    return { totalBudget, totalSpent, remaining, usage };
  }, [budgets]);

  const getStatus = (spent, budget) => {
    const p = (spent / budget) * 100;
    if (spent > budget) return { label: 'Over Budget', color: '#F06575', bg: 'rgba(240, 101, 117, 0.12)' };
    if (p >= 75) return { label: 'Near Limit', color: '#D97706', bg: 'rgba(245, 181, 68, 0.15)' };
    return { label: 'Under Budget', color: '#23B981', bg: 'rgba(35, 185, 129, 0.12)' };
  };

  const filteredBudgets = useMemo(() => {
    let list = budgets.filter(b => {
      const status = getStatus(b.spent, b.budget);
      if (filterStatus !== 'All' && status.label !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortKey === 'Category Name') return a.name.localeCompare(b.name);
      if (sortKey === 'Highest Budget') return b.budget - a.budget;
      if (sortKey === 'Highest Spending') return b.spent - a.spent;
      if (sortKey === 'Remaining Budget') return (b.budget - b.spent) - (a.budget - a.spent);
      return 0;
    });

    return list;
  }, [budgets, filterStatus, searchQuery, sortKey]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(formData.budget);
    if (!formData.name.trim() || isNaN(amt) || amt <= 0) {
      alert('Please enter a valid budget name and positive amount.');
      return;
    }

    const newB = {
      id: `b-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      budget: amt,
      spent: 0,
      icon: 'ri-wallet-3-line',
      color: '#7957FF',
      threshold: parseInt(formData.threshold),
      period: formData.period
    };

    setBudgets(prev => [newB, ...prev]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      category: 'Food & Dining',
      budget: '',
      period: 'Monthly',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      threshold: 80,
      description: ''
    });
    showToast(`Budget "${newB.name}" created successfully.`);
  };

  const deleteBudget = (id, name) => {
    if (window.confirm(`Delete budget for "${name}"? Existing transactions will not be deleted.`)) {
      setBudgets(prev => prev.filter(b => b.id !== id));
      showToast(`Budget for "${name}" deleted.`);
    }
  };

  const adjustBudget = (id, name, currentLimit) => {
    const val = prompt(`Enter new limit for "${name}" (Current: ₹${formatINR(currentLimit)}):`, currentLimit);
    if (val !== null) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        setBudgets(prev => prev.map(b => b.id === id ? { ...b, budget: num } : b));
        showToast(`Budget for "${name}" adjusted to ₹${formatINR(num)}.`);
      }
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: 'ri-dashboard-line', href: 'dashboard.html' },
    { name: 'Transactions', icon: 'ri-exchange-dollar-line', href: 'transactions.html' },
    { name: 'Income', icon: 'ri-wallet-3-line', href: 'add-income.html' },
    { name: 'Expenses', icon: 'ri-shopping-bag-3-line', href: 'add-expense.html' },
    { name: 'Analytics', icon: 'ri-pie-chart-line', href: 'analytics.html' },
    { name: 'Budgets', icon: 'ri-funds-fill', href: 'budgets.html', active: true },
    { name: 'Goals', icon: 'ri-flag-line', href: '#' },
    { name: 'Categories', icon: 'ri-price-tag-3-line', href: '#' },
    { name: 'Recurring', icon: 'ri-repeat-line', href: '#' },
    { name: 'Settings', icon: 'ri-settings-4-line', href: '#' },
  ];

  return (
    <div className="finora-budgets-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="budgets-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="budgets-react-logo-area">
            <div className="budgets-react-brand-icon">
              <i className="ri-funds-fill" style={{ fontSize: '20px', color: '#FFFFFF' }}></i>
            </div>
            <div>
              <div className="budgets-react-brand-name">Finora</div>
              <div className="budgets-react-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="budgets-react-nav">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`budgets-react-nav-item ${item.active ? 'active' : ''}`}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="budgets-react-footer">
          <a href="login.html" className="budgets-react-logout">
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="budgets-react-main">
        {/* Header */}
        <header className="budgets-react-header">
          <div className="budgets-react-title-group">
            <div className="budgets-react-breadcrumb">
              <span>Dashboard</span> / <span style={{ color: '#18213D', fontWeight: 600 }}>Budgets</span>
            </div>
            <h1>Budget Management</h1>
            <p>Plan your spending, monitor limits, and stay on track with your financial goals.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '11px', color: '#75809A' }}></i>
              <input
                type="text"
                placeholder="Search budgets..."
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 12px 0 36px',
                  backgroundColor: '#F6F7FC',
                  border: '1px solid transparent',
                  borderRadius: '9999px',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #E8EBF3', paddingLeft: '16px' }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                alt={user?.name || "User avatar"}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#18213D' }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="budgets-react-content">
          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid #E8EBF3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  height: '40px',
                  padding: '0 14px',
                  border: '1px solid #E8EBF3',
                  borderRadius: '10px',
                  backgroundColor: '#F6F7FC',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}
              >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="Next Month">Next Month</option>
              </select>

              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#11183F', padding: '0 6px' }}>
                October 2026
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => showToast('Copied September 2026 budget allocations.')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  padding: '0 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8EBF3',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="ri-file-copy-line"></i> Copy Previous Budget
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  padding: '0 18px',
                  background: 'linear-gradient(135deg, #7957FF 0%, #6842FA 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(121, 87, 255, 0.35)'
                }}
              >
                <i className="ri-add-line"></i> Create Budget
              </button>
            </div>
          </div>

          {/* Overview Cards (4) */}
          <div className="budgets-react-overview-grid">
            <div className="budgets-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Budget</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(121, 87, 255, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7957FF' }}>
                  <i className="ri-calculator-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#11183F', marginBottom: '4px' }}>
                ₹{formatINR(summaries.totalBudget)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Total planned spending</div>
            </div>

            <div className="budgets-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Spent</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(240, 101, 117, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F06575' }}>
                  <i className="ri-receipt-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F06575', marginBottom: '4px' }}>
                ₹{formatINR(summaries.totalSpent)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Recorded expenses</div>
            </div>

            <div className="budgets-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Remaining Budget</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(35, 185, 129, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#23B981' }}>
                  <i className="ri-wallet-3-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: summaries.remaining >= 0 ? '#23B981' : '#F06575', marginBottom: '4px' }}>
                ₹{formatINR(summaries.remaining)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Unspent allocation</div>
            </div>

            <div className="budgets-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Budget Usage</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(72, 185, 245, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#48B9F5' }}>
                  <i className="ri-pie-chart-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#48B9F5', marginBottom: '4px' }}>
                {summaries.usage}%
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Overall budget utilized</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="budgets-react-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Overall Budget Progress</h3>
                <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px' }}>Actual spending compared with your planned envelope.</p>
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#7957FF' }}>{summaries.usage}% used</span>
            </div>

            <div style={{ height: '14px', background: '#F6F7FC', borderRadius: '7px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, summaries.usage)}%`,
                backgroundColor: summaries.usage >= 90 ? '#F06575' : summaries.usage >= 75 ? '#F5B544' : '#7957FF',
                transition: 'width 0.4s ease'
              }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#75809A' }}>
              <span>₹{formatINR(summaries.totalSpent)} spent</span>
              <span>₹{formatINR(summaries.remaining)} remaining of ₹{formatINR(summaries.totalBudget)}</span>
            </div>
          </div>

          {/* Category Budgets Grid */}
          <div className="budgets-react-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#11183F' }}>Category Budgets</h3>
                <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px' }}>Manage limits and monitor expenses category by category.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    backgroundColor: '#F6F7FC',
                    border: '1px solid #E8EBF3',
                    borderRadius: '10px',
                    fontSize: '0.8125rem'
                  }}
                />

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    backgroundColor: '#F6F7FC',
                    border: '1px solid #E8EBF3',
                    borderRadius: '10px',
                    fontSize: '0.8125rem'
                  }}
                >
                  <option value="All">Filter: All</option>
                  <option value="Under Budget">Under Budget</option>
                  <option value="Near Limit">Near Limit</option>
                  <option value="Over Budget">Over Budget</option>
                </select>

                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    backgroundColor: '#F6F7FC',
                    border: '1px solid #E8EBF3',
                    borderRadius: '10px',
                    fontSize: '0.8125rem'
                  }}
                >
                  <option value="Category Name">Sort: Category Name</option>
                  <option value="Highest Budget">Highest Budget</option>
                  <option value="Highest Spending">Highest Spending</option>
                </select>
              </div>
            </div>

            <div className="budgets-react-categories-grid">
              {filteredBudgets.map(b => {
                const status = getStatus(b.spent, b.budget);
                const remaining = b.budget - b.spent;
                const percent = ((b.spent / b.budget) * 100).toFixed(1);

                return (
                  <div key={b.id} className="budgets-react-cat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${b.color}18`, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                          <i className={b.icon}></i>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#11183F' }}>{b.name}</h4>
                          <span style={{ fontSize: '0.775rem', color: '#75809A' }}>{b.period}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          backgroundColor: status.bg,
                          color: status.color
                        }}>
                          {status.label}
                        </span>

                        <button
                          onClick={() => adjustBudget(b.id, b.name, b.budget)}
                          style={{ background: 'none', border: 'none', color: '#7957FF', cursor: 'pointer', padding: '4px' }}
                          title="Adjust Limit"
                        >
                          <i className="ri-equalizer-line"></i>
                        </button>

                        <button
                          onClick={() => deleteBudget(b.id, b.name)}
                          style={{ background: 'none', border: 'none', color: '#F06575', cursor: 'pointer', padding: '4px' }}
                          title="Delete Budget"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: '#75809A', fontSize: '0.75rem' }}>Limit</span>
                        <div style={{ fontWeight: 700, color: '#11183F', fontSize: '1.05rem' }}>₹{formatINR(b.budget)}</div>
                      </div>
                      <div>
                        <span style={{ color: '#75809A', fontSize: '0.75rem' }}>Spent</span>
                        <div style={{ fontWeight: 700, color: b.spent > b.budget ? '#F06575' : '#11183F', fontSize: '1.05rem' }}>₹{formatINR(b.spent)}</div>
                      </div>
                      <div>
                        <span style={{ color: '#75809A', fontSize: '0.75rem' }}>Remaining</span>
                        <div style={{ fontWeight: 700, color: remaining >= 0 ? '#23B981' : '#F06575', fontSize: '1.05rem' }}>
                          {remaining >= 0 ? `₹${formatINR(remaining)}` : `-₹${formatINR(Math.abs(remaining))}`}
                        </div>
                      </div>
                    </div>

                    <div style={{ height: '8px', background: '#F6F7FC', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(0, (b.spent / b.budget) * 100))}%`,
                        backgroundColor: status.color
                      }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: '#75809A' }}>
                      <span>{percent}% used</span>
                      <span>Alert at {b.threshold}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(17, 24, 63, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '520px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Create New Budget</h3>
                <p style={{ fontSize: '0.8rem', color: '#75809A' }}>Set a spending limit for this period.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Budget Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Grocery Budget"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Subscriptions">Subscriptions</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Limit (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Period</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0 16px', height: '40px', background: '#FFFFFF', border: '1px solid #E8EBF3', borderRadius: '10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0 20px',
                    height: '40px',
                    background: '#7957FF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#11183F',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(17, 24, 63, 0.25)',
          fontSize: '0.875rem',
          fontWeight: 500,
          zIndex: 1000
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
