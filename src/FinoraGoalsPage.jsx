import React, { useState, useMemo } from 'react';
import './FinoraGoalsPage.css';
import { authService } from './services/authService';

/**
 * Finora Expense Tracker — Screen 10: Goals & Savings Component (React)
 * Production-ready React implementation following the Finora brand identity and design system.
 */

export default function FinoraGoalsPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [goals, setGoals] = useState([
    {
      id: 'g-vacation',
      name: 'Dream Vacation',
      category: 'Travel',
      target: 100000,
      saved: 65000,
      deadline: '2027-03-31',
      icon: 'ri-plane-line',
      color: '#7957FF',
      priority: 'High',
      status: 'Active',
      description: 'Trip to Switzerland and Italy with family.',
      isFeatured: true
    },
    {
      id: 'g-laptop',
      name: 'New Laptop',
      category: 'Technology',
      target: 80000,
      saved: 48000,
      deadline: '2027-01-31',
      icon: 'ri-macbook-line',
      color: '#7957FF',
      priority: 'Medium',
      status: 'Active',
      description: 'Upgrade workstation for development.'
    },
    {
      id: 'g-emergency',
      name: 'Emergency Fund',
      category: 'Emergency Fund',
      target: 150000,
      saved: 75000,
      deadline: '2027-12-31',
      icon: 'ri-shield-check-line',
      color: '#48B9F5',
      priority: 'High',
      status: 'Active',
      description: '6 months of living expenses reserve.'
    },
    {
      id: 'g-phone',
      name: 'New Phone',
      category: 'Technology',
      target: 40000,
      saved: 40000,
      deadline: '2026-10-15',
      icon: 'ri-smartphone-line',
      color: '#23B981',
      priority: 'Low',
      status: 'Completed',
      description: 'Target reached and completed!'
    },
    {
      id: 'g-course',
      name: 'Course & Certification',
      category: 'Education',
      target: 25000,
      saved: 10000,
      deadline: '2027-06-30',
      icon: 'ri-graduation-cap-line',
      color: '#F5B544',
      priority: 'Medium',
      status: 'Active',
      description: 'Cloud Architecture Certification exam.'
    },
    {
      id: 'g-bike',
      name: 'New Bicycle',
      category: 'Vehicle',
      target: 20000,
      saved: 5000,
      deadline: '2027-04-30',
      icon: 'ri-riding-line',
      color: '#48B9F5',
      priority: 'Low',
      status: 'Active',
      description: 'Commuter cycle for morning workouts.'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('Recently Updated');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [activeGoalForContrib, setActiveGoalForContrib] = useState(null);
  const [contribAmount, setContribAmount] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Travel',
    target: '',
    initialSaved: '',
    deadline: '2027-03-31',
    priority: 'Medium',
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

  // Overview metrics
  const summaries = useMemo(() => {
    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
    const remaining = goals.reduce((acc, g) => acc + Math.max(0, g.target - g.saved), 0);
    const completed = goals.filter(g => g.status === 'Completed' || g.saved >= g.target).length;
    return { totalTarget, totalSaved, remaining, completed };
  }, [goals]);

  // Featured Goal
  const featured = useMemo(() => {
    return goals.find(g => g.isFeatured) || goals[0];
  }, [goals]);

  // Filtered Goals
  const filteredGoals = useMemo(() => {
    let list = goals.filter(g => {
      if (filterStatus !== 'All' && g.status !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!g.name.toLowerCase().includes(q) && !g.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortKey === 'Highest Progress') return (b.saved / b.target) - (a.saved / a.target);
      if (sortKey === 'Lowest Progress') return (a.saved / a.target) - (b.saved / b.target);
      if (sortKey === 'Target Amount') return b.target - a.target;
      return 0;
    });

    return list;
  }, [goals, filterStatus, searchQuery, sortKey]);

  // Create Goal
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const target = parseFloat(formData.target);
    const initSaved = parseFloat(formData.initialSaved) || 0;
    if (!formData.name.trim() || isNaN(target) || target <= 0) {
      alert('Please enter a goal name and valid positive target amount.');
      return;
    }

    const newG = {
      id: `g-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      target: target,
      saved: initSaved,
      deadline: formData.deadline || '2027-12-31',
      icon: 'ri-flag-line',
      color: '#7957FF',
      priority: formData.priority,
      status: initSaved >= target ? 'Completed' : 'Active',
      description: formData.description || 'Milestone savings.'
    };

    setGoals(prev => [newG, ...prev]);
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      category: 'Travel',
      target: '',
      initialSaved: '',
      deadline: '2027-03-31',
      priority: 'Medium',
      description: ''
    });
    showToast(`Goal "${newG.name}" created!`);
  };

  // Add Contribution
  const openContribModal = (goal) => {
    setActiveGoalForContrib(goal);
    setContribAmount('');
    setIsContribModalOpen(true);
  };

  const handleContribSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(contribAmount);
    if (isNaN(amt) || amt <= 0 || !activeGoalForContrib) {
      alert('Please enter a valid positive contribution amount.');
      return;
    }

    setGoals(prev => prev.map(g => {
      if (g.id === activeGoalForContrib.id) {
        const newSaved = g.saved + amt;
        const isComplete = newSaved >= g.target;
        return {
          ...g,
          saved: newSaved,
          status: isComplete ? 'Completed' : g.status
        };
      }
      return g;
    }));

    setIsContribModalOpen(false);
    showToast(`Added ₹${formatINR(amt)} to "${activeGoalForContrib.name}".`);
  };

  const navItems = [
    { name: 'Dashboard', icon: 'ri-dashboard-line', href: 'dashboard.html' },
    { name: 'Transactions', icon: 'ri-exchange-dollar-line', href: 'transactions.html' },
    { name: 'Income', icon: 'ri-wallet-3-line', href: 'add-income.html' },
    { name: 'Expenses', icon: 'ri-shopping-bag-3-line', href: 'add-expense.html' },
    { name: 'Analytics', icon: 'ri-pie-chart-line', href: 'analytics.html' },
    { name: 'Budgets', icon: 'ri-funds-line', href: 'budgets.html' },
    { name: 'Goals', icon: 'ri-flag-fill', href: 'goals.html', active: true },
    { name: 'Categories', icon: 'ri-price-tag-3-line', href: '#' },
    { name: 'Recurring', icon: 'ri-repeat-line', href: '#' },
    { name: 'Settings', icon: 'ri-settings-4-line', href: '#' },
  ];

  return (
    <div className="finora-goals-app">
      {/* 1. LEFT SIDEBAR */}
      <aside className="goals-react-sidebar" aria-label="Main Navigation">
        <div>
          <div className="goals-react-logo-area">
            <div className="goals-react-brand-icon">
              <i className="ri-flag-fill" style={{ fontSize: '20px', color: '#FFFFFF' }}></i>
            </div>
            <div>
              <div className="goals-react-brand-name">Finora</div>
              <div className="goals-react-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="goals-react-nav">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`goals-react-nav-item ${item.active ? 'active' : ''}`}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="goals-react-footer">
          <a href="login.html" className="goals-react-logout">
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="goals-react-main">
        {/* Header */}
        <header className="goals-react-header">
          <div className="goals-react-title-group">
            <div className="goals-react-breadcrumb">
              <span>Dashboard</span> / <span style={{ color: '#18213D', fontWeight: 600 }}>Goals</span>
            </div>
            <h1>Goals & Savings</h1>
            <p>Turn your financial plans into achievable milestones.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '11px', color: '#75809A' }}></i>
              <input
                type="text"
                placeholder="Search milestones..."
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
        <div className="goals-react-content">
          {/* Intro Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: '#FFFFFF',
            padding: '18px 24px',
            borderRadius: '16px',
            border: '1px solid #E8EBF3'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#11183F' }}>Your Financial Goals</h2>
              <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px' }}>
                Set a target, build your savings, and track every step toward your future.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="analytics.html"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '42px',
                  padding: '0 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8EBF3',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#18213D',
                  textDecoration: 'none'
                }}
              >
                <i className="ri-pie-chart-line"></i> Savings Insights
              </a>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '42px',
                  padding: '0 20px',
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
                <i className="ri-add-line"></i> Create Goal
              </button>
            </div>
          </div>

          {/* Overview Cards (4) */}
          <div className="goals-react-overview-grid">
            <div className="goals-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Goal Target</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(121, 87, 255, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7957FF' }}>
                  <i className="ri-focus-3-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#11183F', marginBottom: '4px' }}>
                ₹{formatINR(summaries.totalTarget)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Combined targets across active goals</div>
            </div>

            <div className="goals-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Total Saved</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(35, 185, 129, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#23B981' }}>
                  <i className="ri-wallet-3-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#23B981', marginBottom: '4px' }}>
                ₹{formatINR(summaries.totalSaved)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Allocated toward milestones</div>
            </div>

            <div className="goals-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Remaining to Save</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(72, 185, 245, 0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#48B9F5' }}>
                  <i className="ri-funds-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#48B9F5', marginBottom: '4px' }}>
                ₹{formatINR(summaries.remaining)}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Needed to achieve targets</div>
            </div>

            <div className="goals-react-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', color: '#75809A', fontWeight: 600 }}>Goals Completed</span>
                <div style={{ width: '40px', height: '40px', background: 'rgba(245, 181, 68, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <i className="ri-checkbox-circle-line" style={{ fontSize: '20px' }}></i>
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D97706', marginBottom: '4px' }}>
                {summaries.completed} of {goals.length}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#75809A' }}>Successfully achieved</div>
            </div>
          </div>

          {/* Featured Goal Card */}
          {featured && (
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8FF 100%)',
              border: '1px solid #E8EBF3',
              borderRadius: '16px',
              padding: '28px',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7957FF', textTransform: 'uppercase', marginBottom: '14px' }}>
                ★ Featured Goal
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F3EEFF', color: '#7957FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                    <i className={featured.icon}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#11183F' }}>{featured.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: '#75809A' }}>{featured.description}</p>
                    <div style={{ fontSize: '0.775rem', color: '#75809A', marginTop: '6px' }}>
                      Target Date: {featured.deadline}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                    <span>Saved: <strong>₹{formatINR(featured.saved)}</strong> of ₹{formatINR(featured.target)}</span>
                    <span style={{ fontWeight: 800, color: '#7957FF' }}>{Math.round((featured.saved / featured.target) * 100)}%</span>
                  </div>
                  <div style={{ height: '12px', background: '#E8EBF3', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (featured.saved / featured.target) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #7957FF, #48B9F5)' }}></div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Remaining</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#11183F', marginBottom: '10px' }}>
                    ₹{formatINR(Math.max(0, featured.target - featured.saved))}
                  </div>
                  <button
                    onClick={() => openContribModal(featured)}
                    style={{
                      padding: '8px 16px',
                      background: '#7957FF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Contribution
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Goals Collection */}
          <div className="goals-react-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#11183F' }}>My Savings Goals</h3>
                <p style={{ fontSize: '0.8125rem', color: '#75809A', marginTop: '2px' }}>Keep track of every financial milestone.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search goals..."
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
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
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
                  <option value="Recently Updated">Sort: Recently Updated</option>
                  <option value="Highest Progress">Highest Progress</option>
                  <option value="Lowest Progress">Lowest Progress</option>
                  <option value="Target Amount">Target Amount</option>
                </select>
              </div>
            </div>

            <div className="goals-react-grid-3col">
              {filteredGoals.map(g => {
                const isComplete = g.status === 'Completed' || g.saved >= g.target;
                const pct = Math.min(100, Math.round((g.saved / g.target) * 100));

                return (
                  <div key={g.id} className="goals-react-goal-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${g.color}15`, color: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                          <i className={g.icon}></i>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#11183F' }}>{g.name}</h4>
                          <span style={{ fontSize: '0.775rem', color: '#75809A' }}>{g.category}</span>
                        </div>
                      </div>

                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: isComplete ? 'rgba(35, 185, 129, 0.12)' : 'rgba(121, 87, 255, 0.1)',
                        color: isComplete ? '#23B981' : '#7957FF'
                      }}>
                        {isComplete ? 'Completed' : g.status}
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#11183F' }}>₹{formatINR(g.saved)}</span>
                        <span style={{ color: '#75809A' }}>Target: ₹{formatINR(g.target)}</span>
                      </div>
                      <div style={{ height: '8px', background: '#F6F7FC', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isComplete ? '#23B981' : g.color }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E8EBF3', paddingTop: '10px', fontSize: '0.775rem' }}>
                      <span style={{ color: '#75809A' }}>Target: {g.deadline}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#18213D' }}>{pct}%</span>
                        {!isComplete && (
                          <button
                            onClick={() => openContribModal(g)}
                            style={{ padding: '4px 8px', background: '#F6F7FC', border: '1px solid #E8EBF3', borderRadius: '6px', color: '#7957FF', fontWeight: 600, cursor: 'pointer' }}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 63, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Create a New Goal</h3>
                <p style={{ fontSize: '0.8rem', color: '#75809A' }}>Define your target and create a plan to achieve it.</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Electric Car"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Target (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100000"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Already Saved</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.initialSaved}
                    onChange={(e) => setFormData({ ...formData, initialSaved: e.target.value })}
                    style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ padding: '0 16px', height: '40px', background: '#FFFFFF', border: '1px solid #E8EBF3', borderRadius: '10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0 20px', height: '40px', background: '#7957FF', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {isContribModalOpen && activeGoalForContrib && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(17, 24, 63, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', width: '100%', maxWidth: '460px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EBF3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#11183F' }}>Add Contribution</h3>
                <p style={{ fontSize: '0.8rem', color: '#7957FF', fontWeight: 600 }}>{activeGoalForContrib.name}</p>
              </div>
              <button onClick={() => setIsContribModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleContribSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Contribution Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="5000"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid #E8EBF3', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsContribModalOpen(false)}
                  style={{ padding: '0 16px', height: '40px', background: '#FFFFFF', border: '1px solid #E8EBF3', borderRadius: '10px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0 20px', height: '40px', background: '#7957FF', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Record Contribution
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
