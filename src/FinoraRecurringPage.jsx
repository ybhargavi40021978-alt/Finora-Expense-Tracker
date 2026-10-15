import React, { useState, useMemo } from 'react';
import './FinoraRecurringPage.css';
import { authService } from './services/authService';

/**
 * Finora Expense Tracker — Screen 12: Recurring Transactions Component (React)
 * Production-ready React implementation following the Finora brand identity and design system.
 */

export default function FinoraRecurringPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [schedules, setSchedules] = useState([
    {
      id: 'rec-1',
      title: 'Rent Payment',
      type: 'expense',
      category: 'Housing',
      amount: 12000,
      frequency: 'Monthly',
      nextDate: '2026-10-18',
      reminder: '2 days before',
      status: 'Active',
      account: 'Primary Bank Account'
    },
    {
      id: 'rec-2',
      title: 'Internet Broadband',
      type: 'expense',
      category: 'Bills & Utilities',
      amount: 999,
      frequency: 'Monthly',
      nextDate: '2026-10-20',
      reminder: '1 day before',
      status: 'Active',
      account: 'Debit Card'
    },
    {
      id: 'rec-3',
      title: 'Primary Salary',
      type: 'income',
      category: 'Salary',
      amount: 65000,
      frequency: 'Monthly',
      nextDate: '2026-10-25',
      reminder: 'On due date',
      status: 'Active',
      account: 'Primary Bank Account'
    },
    {
      id: 'rec-4',
      title: 'Electricity Bill',
      type: 'expense',
      category: 'Bills & Utilities',
      amount: 2450,
      frequency: 'Monthly',
      nextDate: '2026-10-22',
      reminder: '3 days before',
      status: 'Active',
      account: 'UPI / Net Banking'
    },
    {
      id: 'rec-5',
      title: 'Netflix 4K UHD',
      type: 'expense',
      category: 'Subscriptions',
      amount: 649,
      frequency: 'Monthly',
      nextDate: '2026-10-28',
      reminder: '1 day before',
      status: 'Active',
      account: 'Credit Card'
    },
    {
      id: 'rec-6',
      title: 'Gym Membership',
      type: 'expense',
      category: 'Subscriptions',
      amount: 1500,
      frequency: 'Monthly',
      nextDate: null,
      reminder: 'Disabled',
      status: 'Paused',
      account: 'Debit Card'
    },
    {
      id: 'rec-7',
      title: 'Freelance Retainer',
      type: 'income',
      category: 'Freelance',
      amount: 25000,
      frequency: 'Monthly',
      nextDate: '2026-11-01',
      reminder: '2 days before',
      status: 'Active',
      account: 'Savings Account'
    },
    {
      id: 'rec-8',
      title: 'Health Insurance EMI',
      type: 'expense',
      category: 'Healthcare',
      amount: 2200,
      frequency: 'Monthly',
      nextDate: '2026-10-16',
      reminder: '1 day before',
      status: 'Active',
      account: 'Primary Bank Account'
    }
  ]);

  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formCategory, setFormCategory] = useState('Housing');
  const [formFreq, setFormFreq] = useState('Monthly');
  const [formDate, setFormDate] = useState('2026-10-18');

  // Overview metrics
  const activeCount = useMemo(() => schedules.filter(s => s.status === 'Active').length, [schedules]);
  const upcomingExpenses = useMemo(() => {
    return schedules
      .filter(s => s.status === 'Active' && s.type === 'expense' && s.nextDate)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [schedules]);
  const expectedIncome = useMemo(() => {
    return schedules
      .filter(s => s.status === 'Active' && s.type === 'income' && s.nextDate)
      .reduce((sum, s) => sum + s.amount, 0);
  }, [schedules]);

  // Filtered schedules
  const displayedSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (currentTab === 'expense' && s.type !== 'expense') return false;
      if (currentTab === 'income' && s.type !== 'income') return false;
      if (currentTab === 'paused' && s.status !== 'Paused') return false;
      if (filterFrequency !== 'all' && s.frequency !== filterFrequency) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [schedules, currentTab, filterFrequency, searchQuery]);

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAmount) return;

    const newSched = {
      id: 'rec-' + Date.now(),
      title: formTitle.trim(),
      amount: parseFloat(formAmount),
      type: formType,
      category: formCategory,
      frequency: formFreq,
      nextDate: formDate,
      reminder: '1 day before',
      status: 'Active',
      account: 'Primary Bank Account'
    };

    setSchedules(prev => [newSched, ...prev]);
    setIsModalOpen(false);
  };

  const handleRecordOccurrence = (id) => {
    setSchedules(prev => prev.map(s => {
      if (s.id !== id || !s.nextDate) return s;
      const cur = new Date(s.nextDate);
      cur.setMonth(cur.getMonth() + 1);
      return {
        ...s,
        nextDate: cur.toISOString().split('T')[0]
      };
    }));
  };

  return (
    <div className="finora-recurring-app">
      {/* Sidebar */}
      <aside className="fr-sidebar">
        <div>
          <div className="fr-brand">
            <div className="fr-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <div>
              <div className="fr-brand-name">Finora</div>
              <div className="fr-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="fr-nav">
            <a href="dashboard.html" className="fr-nav-item"><i className="ri-dashboard-line"></i> Dashboard</a>
            <a href="transactions.html" className="fr-nav-item"><i className="ri-exchange-dollar-line"></i> Transactions</a>
            <a href="add-income.html" className="fr-nav-item"><i className="ri-wallet-3-line"></i> Income</a>
            <a href="add-expense.html" className="fr-nav-item"><i className="ri-shopping-bag-3-line"></i> Expenses</a>
            <a href="analytics.html" className="fr-nav-item"><i className="ri-pie-chart-line"></i> Analytics</a>
            <a href="budgets.html" className="fr-nav-item"><i className="ri-funds-line"></i> Budgets</a>
            <a href="goals.html" className="fr-nav-item"><i className="ri-flag-line"></i> Goals</a>
            <a href="categories.html" className="fr-nav-item"><i className="ri-price-tag-3-line"></i> Categories</a>
            <a href="recurring.html" className="fr-nav-item active"><i className="ri-repeat-fill"></i> Recurring</a>
            <a href="#settings" className="fr-nav-item"><i className="ri-settings-4-line"></i> Settings</a>
          </nav>
        </div>

        <a href="login.html" className="fr-logout">
          <i className="ri-logout-box-r-line"></i> Logout
        </a>
      </aside>

      {/* Main Workspace */}
      <main className="fr-workspace">
        <header className="fr-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#75809A', marginBottom: 2 }}>Dashboard / Recurring</div>
            <h1>Recurring Transactions</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} 
                alt={user?.name || "User avatar"}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #E8EBF3' }}
              />
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="fr-content">
          {/* Header Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.35rem', fontWeight: 700 }}>Your Repeating Cash Flow</h2>
              <p style={{ color: '#75809A', fontSize: '0.875rem' }}>Automate your financial routine and stay ahead of every payment.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{ background: '#7957FF', color: '#FFF', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
            >
              <i className="ri-add-line"></i> + Create Schedule
            </button>
          </div>

          {/* Overview Cards */}
          <div className="fr-overview-grid">
            <div className="fr-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#F2EFFF', color: '#7957FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-repeat-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Active Schedules</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{activeCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#75809A' }}>Currently active</div>
              </div>
            </div>

            <div className="fr-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#FEEFF1', color: '#F06575', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-calendar-event-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Upcoming Expenses</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{upcomingExpenses.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.72rem', color: '#75809A' }}>Next 30 days estimate</div>
              </div>
            </div>

            <div className="fr-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#E8F8F2', color: '#23B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-line-chart-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Expected Income</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{expectedIncome.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.72rem', color: '#75809A' }}>Next 30 days estimate</div>
              </div>
            </div>

            <div className="fr-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#FEF8ED', color: '#F5B544', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-alarm-warning-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Payments Due Soon</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>3</div>
                <div style={{ fontSize: '0.72rem', color: '#75809A' }}>Within next 7 days</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, background: '#EBF0F8', padding: 4, borderRadius: 10, alignSelf: 'flex-start' }}>
            <button 
              onClick={() => setCurrentTab('all')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentTab === 'all' ? '#FFF' : 'transparent', fontWeight: 600 }}
            >
              All Schedules ({schedules.length})
            </button>
            <button 
              onClick={() => setCurrentTab('expense')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentTab === 'expense' ? '#FFF' : 'transparent', color: currentTab === 'expense' ? '#F06575' : '#75809A', fontWeight: 600 }}
            >
              Expenses
            </button>
            <button 
              onClick={() => setCurrentTab('income')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentTab === 'income' ? '#FFF' : 'transparent', color: currentTab === 'income' ? '#23B981' : '#75809A', fontWeight: 600 }}
            >
              Income
            </button>
            <button 
              onClick={() => setCurrentTab('paused')}
              style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentTab === 'paused' ? '#FFF' : 'transparent', fontWeight: 600 }}
            >
              Paused
            </button>
          </div>

          {/* Table */}
          <div className="fr-table-card">
            <table className="fr-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Next Occurrence</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedSchedules.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.title}</td>
                    <td>{s.category}</td>
                    <td style={{ fontWeight: 700, color: s.type === 'expense' ? '#F06575' : '#23B981' }}>
                      {s.type === 'expense' ? '-' : '+'}₹{s.amount.toLocaleString('en-IN')}
                    </td>
                    <td>{s.frequency}</td>
                    <td style={{ fontWeight: 600 }}>{s.nextDate || 'Paused'}</td>
                    <td>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 99, background: s.status === 'Active' ? '#E8F8F2' : '#FFF3DD', color: s.status === 'Active' ? '#23B981' : '#B46A00' }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {s.status === 'Active' && s.nextDate && (
                        <button 
                          onClick={() => handleRecordOccurrence(s.id)}
                          style={{ background: '#7957FF', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: '0.77rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
