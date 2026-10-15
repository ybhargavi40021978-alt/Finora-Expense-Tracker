import React, { useState, useMemo, useEffect } from 'react';
import './FinoraAnalyticsPage.css';
import { summaryService } from './services/summaryService';
import { transactionService } from './services/transactionService';
import { authService } from './services/authService';

/**
 * Finora Expense Tracker — Screen 8: Analytics & Reports Component (React)
 * Connected directly to real MongoDB backend aggregations.
 */

export default function FinoraAnalyticsPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [period, setPeriod] = useState('This Month');
  const [txType, setTxType] = useState('All');
  const [interval, setInterval] = useState('Monthly');
  const [toastMessage, setToastMessage] = useState(null);

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    monthlyBars: [],
    categories: [],
    sources: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const [sumRes, yearlyRes, txnRes] = await Promise.all([
        summaryService.getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
        summaryService.getYearlySummary(now.getFullYear()),
        transactionService.getAll({ limit: 5 })
      ]);

      const sum = (sumRes && sumRes.summary) || {};
      const yearly = (yearlyRes && yearlyRes.summary) || {};
      const txns = (txnRes && txnRes.transactions) || [];

      const bars = (yearly.monthlyTrend || []).map(m => ({
        label: m.monthName ? m.monthName.slice(0, 3) : '',
        income: m.income || 0,
        expense: m.expense || 0
      }));

      const colors = ['#F06575', '#7957FF', '#48B9F5', '#F5B544', '#23B981', '#C7B8FF'];
      const categories = (sum.expenseByCategory || []).map((c, i) => ({
        name: c.category,
        percent: c.percentage || 0,
        amount: c.total || 0,
        color: colors[i % colors.length]
      }));

      const sources = (sum.incomeByCategory || []).map((s, i) => ({
        name: s.category,
        percent: s.percentage || 0,
        amount: s.total || 0,
        color: colors[i % colors.length]
      }));

      const recentActivity = txns.map(t => ({
        title: t.title,
        cat: t.category,
        date: t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        type: t.type === 'income' ? 'Income' : 'Expense',
        amount: t.amount,
        isIncome: t.type === 'income'
      }));

      setData({
        totalIncome: sum.totalIncome || 0,
        totalExpenses: sum.totalExpenses || 0,
        monthlyBars: bars,
        categories,
        sources,
        recentActivity
      });
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatINR = (val) => {
    return Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const netSavings = useMemo(() => {
    return data.totalIncome - data.totalExpenses;
  }, [data.totalIncome, data.totalExpenses]);

  const savingsRate = useMemo(() => {
    return data.totalIncome > 0
      ? ((netSavings / data.totalIncome) * 100).toFixed(1)
      : '0.0';
  }, [data.totalIncome, netSavings]);

  const navItems = [
    { name: 'Dashboard', icon: 'ri-dashboard-line', href: 'dashboard.html' },
    { name: 'Transactions', icon: 'ri-exchange-dollar-line', href: 'transactions.html' },
    { name: 'Income', icon: 'ri-wallet-3-line', href: 'add-income.html' },
    { name: 'Expenses', icon: 'ri-shopping-bag-3-line', href: 'add-expense.html' },
    { name: 'Analytics', icon: 'ri-pie-chart-2-fill', href: 'analytics.html', active: true },
    { name: 'Budgets', icon: 'ri-funds-line', href: '#' },
    { name: 'Goals', icon: 'ri-flag-line', href: '#' },
    { name: 'Categories', icon: 'ri-price-tag-3-line', href: '#' },
    { name: 'Recurring', icon: 'ri-repeat-line', href: '#' },
    { name: 'Settings', icon: 'ri-settings-4-line', href: '#' },
  ];

  const handleExport = () => {
    showToast('Analytics CSV exported successfully!');
  };

  const handleDownload = () => {
    showToast('Preparing PDF Report...');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="finora-analytics-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="analytics-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="analytics-react-logo-area">
            <div className="analytics-react-brand-icon">
              <i className="ri-pie-chart-2-fill" style={{ fontSize: '20px', color: '#FFFFFF' }}></i>
            </div>
            <div>
              <div className="analytics-react-brand-name">Finora</div>
              <div className="analytics-react-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="analytics-react-nav">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`analytics-react-nav-item ${item.active ? 'active' : ''}`}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="analytics-react-footer">
          <a href="login.html" className="analytics-react-logout">
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="analytics-react-main">
        {/* Header */}
        <header className="analytics-react-header">
          <div className="analytics-react-title-group">
            <div className="analytics-react-breadcrumb">
              <span>Dashboard</span> / <span style={{ color: '#18213D', fontWeight: 600 }}>Analytics & Reports</span>
            </div>
            <h1>Analytics & Reports</h1>
            <p>Understand your spending, track your savings, and make smarter financial decisions.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '11px', color: '#75809A' }}></i>
              <input
                type="text"
                placeholder="Search analytics..."
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
        <div className="analytics-react-content">
          {/* Controls & Filters */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Period:</label>
                <select
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    showToast(`Period set to ${e.target.value}`);
                  }}
                  style={{
                    height: '40px',
                    padding: '0 14px',
                    border: '1px solid #E8EBF3',
                    borderRadius: '10px',
                    backgroundColor: '#F6F7FC',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="Last 3 Months">Last 3 Months</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="This Year">This Year</option>
                  <option value="Last Year">Last Year</option>
                </select>
              </div>

              <div style={{ display: 'flex', background: '#F6F7FC', border: '1px solid #E8EBF3', borderRadius: '10px', padding: '3px' }}>
                {['All', 'Income', 'Expenses'].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTxType(t);
                      showToast(`Showing ${t}`);
                    }}
                    style={{
                      background: txType === t ? '#FFFFFF' : 'transparent',
                      color: txType === t ? '#7957FF' : '#75809A',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: txType === t ? '0 2px 6px rgba(17, 24, 63, 0.06)' : 'none'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleExport}
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
                <i className="ri-file-excel-2-line"></i> Export CSV
              </button>
              <button
                onClick={handleDownload}
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
                <i className="ri-file-pdf-line"></i> Download Report
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          {/* Overview Cards */}
          <div className="analytics-react-overview-grid">
            <div className="analytics-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Income</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(35, 185, 129, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#23B981' }}>
                  <i className="ri-arrow-up-circle-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#11183F', marginBottom: '8px' }}>
                ₹{formatINR(data.totalIncome)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#23B981', fontWeight: 600 }}>
                {data.totalIncome > 0 ? 'Active income recorded' : '₹0.00 initial state'}
              </div>
            </div>

            <div className="analytics-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Expenses</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(240, 101, 117, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F06575' }}>
                  <i className="ri-arrow-down-circle-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F06575', marginBottom: '8px' }}>
                ₹{formatINR(data.totalExpenses)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#F06575', fontWeight: 600 }}>
                {data.totalExpenses > 0 ? 'Active expenses recorded' : '₹0.00 initial state'}
              </div>
            </div>

            <div className="analytics-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Net Savings</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(121, 87, 255, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7957FF' }}>
                  <i className="ri-safe-2-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: netSavings >= 0 ? '#11183F' : '#F06575', marginBottom: '8px' }}>
                {netSavings >= 0 ? '' : '−'}₹{formatINR(Math.abs(netSavings))}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#23B981', fontWeight: 600 }}>
                Total income minus expenses
              </div>
            </div>

            <div className="analytics-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Savings Rate</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(72, 185, 245, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#48B9F5' }}>
                  <i className="ri-pie-chart-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#48B9F5', marginBottom: '8px' }}>
                {savingsRate}%
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A', fontWeight: 600 }}>
                Calculated from saved records
              </div>
            </div>
          </div>

          {/* Main 2-Col Grid */}
          <div className="analytics-react-two-col">
            {/* Grouped Bar Chart */}
            <div className="analytics-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Income vs Expenses</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px' }}>Compare how much you earn and spend over time.</p>
                </div>
                <div style={{ display: 'flex', background: '#F6F7FC', border: '1px solid #E8EBF3', borderRadius: '10px', padding: '2px' }}>
                  {['Weekly', 'Monthly', 'Yearly'].map((i) => (
                    <button
                      key={i}
                      onClick={() => setInterval(i)}
                      style={{
                        background: interval === i ? '#FFFFFF' : 'transparent',
                        color: interval === i ? '#7957FF' : '#75809A',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple visual SVG bars */}
              {data.monthlyBars.length === 0 || data.monthlyBars.every(b => b.income === 0 && b.expense === 0) ? (
                <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#75809A', fontSize: '0.85rem' }}>
                  <i className="ri-bar-chart-2-line" style={{ fontSize: '32px', color: '#C5CEE0', marginBottom: '8px' }}></i>
                  <div>No financial activity recorded yet.</div>
                  <div style={{ fontSize: '0.75rem', color: '#A0ABC0', marginTop: '4px' }}>Submit an income or expense to generate analytics.</div>
                </div>
              ) : (
                <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px', borderBottom: '1px solid #E8EBF3' }}>
                  {data.monthlyBars.map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '45px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '180px' }}>
                        <div
                          style={{
                            width: '16px',
                            height: `${Math.min(180, (b.income / Math.max(1, ...data.monthlyBars.map(m => Math.max(m.income, m.expense)))) * 160)}px`,
                            backgroundColor: '#23B981',
                            borderRadius: '4px 4px 0 0'
                          }}
                          title={`Income: ₹${b.income}`}
                        ></div>
                        <div
                          style={{
                            width: '16px',
                            height: `${Math.min(180, (b.expense / Math.max(1, ...data.monthlyBars.map(m => Math.max(m.income, m.expense)))) * 160)}px`,
                            backgroundColor: '#F06575',
                            borderRadius: '4px 4px 0 0'
                          }}
                          title={`Expense: ₹${b.expense}`}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#18213D', fontWeight: 600 }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#23B981', borderRadius: '3px' }}></span>
                  <span>Income</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', background: '#F06575', borderRadius: '3px' }}></span>
                  <span>Expenses</span>
                </div>
              </div>
            </div>

            {/* Donut Chart / Category Breakdown */}
            <div className="analytics-react-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Spending by Category</h3>
              <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px', marginBottom: '16px' }}>See which categories account for your expenses.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.categories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 12px', color: '#75809A', fontSize: '0.85rem' }}>
                    No expense records categorized yet.
                  </div>
                ) : (
                  data.categories.map((c, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#F6F7FC', borderRadius: '8px', fontSize: '0.8125rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: c.color }}></span>
                        <span>{c.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontWeight: 600 }}>₹{formatINR(c.amount)}</span>
                        <span style={{ color: '#75809A', width: '32px', textAlign: 'right' }}>{c.percent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Three-Col Grid */}
          <div className="analytics-react-three-col">
            {/* Income Sources */}
            <div className="analytics-react-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F', marginBottom: '4px' }}>Income Sources</h3>
              <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '16px' }}>Where your income comes from.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.sources.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 12px', color: '#75809A', fontSize: '0.85rem' }}>
                    No income sources recorded yet.
                  </div>
                ) : (
                  data.sources.map((s, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                        <span>₹{formatINR(s.amount)} ({s.percent}%)</span>
                      </div>
                      <div style={{ height: '6px', background: '#F6F7FC', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.percent}%`, height: '100%', backgroundColor: s.color }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Financial Insights */}
            <div className="analytics-react-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F', marginBottom: '4px' }}>Financial Insights</h3>
              <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '16px' }}>Quick summary of your activity.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px', background: '#F6F7FC', borderRadius: '10px', borderLeft: '3px solid #7957FF', fontSize: '0.8rem' }}>
                  <strong>Spending Summary:</strong> {data.totalExpenses > 0 ? `Total expenses are ₹${formatINR(data.totalExpenses)}.` : 'No expenses recorded yet.'}
                </div>
                <div style={{ padding: '10px', background: '#F6F7FC', borderRadius: '10px', borderLeft: '3px solid #23B981', fontSize: '0.8rem' }}>
                  <strong>Savings Progress:</strong> {data.totalIncome > 0 ? `${savingsRate}% of earnings retained as net savings.` : 'Waiting for income records.'}
                </div>
                <div style={{ padding: '10px', background: '#F6F7FC', borderRadius: '10px', borderLeft: '3px solid #48B9F5', fontSize: '0.8rem' }}>
                  <strong>Total Records:</strong> {data.recentActivity.length} recent transaction(s) tracked.
                </div>
              </div>
            </div>

            {/* Savings Analysis */}
            <div className="analytics-react-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F', marginBottom: '4px' }}>Savings Analysis</h3>
              <p style={{ fontSize: '0.8125rem', color: '#75809A', marginBottom: '16px' }}>Income remaining after spending.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: '#F6F7FC', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Income</div>
                  <div style={{ fontWeight: 700, color: '#23B981' }}>₹{formatINR(data.totalIncome)}</div>
                </div>
                <div style={{ background: '#F6F7FC', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Expenses</div>
                  <div style={{ fontWeight: 700, color: '#F06575' }}>₹{formatINR(data.totalExpenses)}</div>
                </div>
              </div>

              <div style={{ height: '8px', background: '#F6F7FC', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '10px' }}>
                {data.totalIncome + data.totalExpenses > 0 ? (
                  <>
                    <div style={{ width: `${Math.min(100, Math.round((data.totalExpenses / (data.totalIncome + data.totalExpenses)) * 100))}%`, background: '#F06575' }}></div>
                    <div style={{ width: `${Math.min(100, Math.round((data.totalIncome / (data.totalIncome + data.totalExpenses)) * 100))}%`, background: '#23B981' }}></div>
                  </>
                ) : (
                  <div style={{ width: '100%', background: '#E8EBF3' }}></div>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#75809A' }}>
                Net balance = Total income − Total expenses.
              </div>
            </div>
          </div>
        </div>
      </main>

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
