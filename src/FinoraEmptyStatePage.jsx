import React, { useState } from 'react';
import './FinoraEmptyStatePage.css';
import { authService } from './services/authService';

/**
 * Screen 15 — Empty State Page React Component
 * Full-stack personal finance application: Finora
 * Tagline: "Track. Plan. Save. Grow."
 */
export default function FinoraEmptyStatePage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [scenario, setScenario] = useState('transactions');

  const scenarioData = {
    transactions: {
      nav: 'Transactions',
      breadcrumb: 'Dashboard / Transactions',
      title: 'Your financial journey starts here.',
      subtitle: "You haven't added any transactions yet. Start recording your income and expenses to see where your money goes and build better financial habits.",
      primaryText: '+ Add Your First Transaction',
      primaryHref: 'transactions.html',
      secondaryText: 'Explore Dashboard',
      secondaryHref: 'dashboard.html',
      hint: 'Tip: Start with your latest income and a few everyday expenses to get a clearer picture of your finances.'
    },
    income: {
      nav: 'Income',
      breadcrumb: 'Dashboard / Income',
      title: 'Your income story starts here.',
      subtitle: 'Record your salary, freelance earnings, or other income sources to understand how much money you receive.',
      primaryText: '+ Add Income',
      primaryHref: 'add-income.html',
      secondaryText: 'View Transactions',
      secondaryHref: 'transactions.html',
      hint: 'Tip: Log recurring salary and client retainers as soon as they reach your bank.'
    },
    expenses: {
      nav: 'Expenses',
      breadcrumb: 'Dashboard / Expenses',
      title: 'No expenses recorded yet.',
      subtitle: 'Add your everyday spending to understand your habits, monitor your budgets, and identify opportunities to save.',
      primaryText: '+ Add Expense',
      primaryHref: 'add-expense.html',
      secondaryText: 'Explore Budgets',
      secondaryHref: 'budgets.html',
      hint: 'Tip: Categorizing purchases right away keeps your budget alert thresholds accurate.'
    },
    budgets: {
      nav: 'Budgets',
      breadcrumb: 'Dashboard / Budgets',
      title: 'Give your money a plan.',
      subtitle: "You haven't created any budgets yet. Set spending limits for categories that matter to you and track your progress throughout the month.",
      primaryText: 'Create Your First Budget',
      primaryHref: 'budgets.html',
      secondaryText: 'View Expenses',
      secondaryHref: 'add-expense.html',
      hint: null
    },
    goals: {
      nav: 'Goals',
      breadcrumb: 'Dashboard / Goals',
      title: 'Turn your plans into savings goals.',
      subtitle: 'Create a goal for something important to you, set a target amount, and track your progress as you save.',
      primaryText: 'Create Your First Goal',
      primaryHref: 'goals.html',
      secondaryText: 'View Dashboard',
      secondaryHref: 'dashboard.html',
      hint: 'Tip: Small regular contributions make even ambitious milestones feel achievable.'
    }
  };

  const current = scenarioData[scenario] || scenarioData.transactions;

  return (
    <div className="finora-empty-container">
      {/* 1. Sidebar Navigation (220px) */}
      <aside className="finora-empty-sidebar">
        <div>
          <div style={{ padding: '0 20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Finora</h2>
            <span style={{ fontSize: '0.625rem', color: '#C7B8FF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Track. Plan. Save. Grow.
            </span>
          </div>

          <nav className="finora-empty-nav">
            <a href="dashboard.html" className={`finora-empty-nav-item ${current.nav === 'Dashboard' ? 'active' : ''}`}>Dashboard</a>
            <a href="transactions.html" className={`finora-empty-nav-item ${current.nav === 'Transactions' ? 'active' : ''}`}>Transactions</a>
            <a href="add-income.html" className={`finora-empty-nav-item ${current.nav === 'Income' ? 'active' : ''}`}>Income</a>
            <a href="add-expense.html" className={`finora-empty-nav-item ${current.nav === 'Expenses' ? 'active' : ''}`}>Expenses</a>
            <a href="analytics.html" className={`finora-empty-nav-item ${current.nav === 'Analytics' ? 'active' : ''}`}>Analytics</a>
            <a href="budgets.html" className={`finora-empty-nav-item ${current.nav === 'Budgets' ? 'active' : ''}`}>Budgets</a>
            <a href="goals.html" className={`finora-empty-nav-item ${current.nav === 'Goals' ? 'active' : ''}`}>Goals</a>
            <a href="categories.html" className={`finora-empty-nav-item ${current.nav === 'Categories' ? 'active' : ''}`}>Categories</a>
            <a href="recurring.html" className={`finora-empty-nav-item ${current.nav === 'Recurring' ? 'active' : ''}`}>Recurring</a>
            <a href="settings.html" className={`finora-empty-nav-item ${current.nav === 'Settings' ? 'active' : ''}`}>Settings</a>
          </nav>
        </div>

        <div style={{ padding: '0 16px' }}>
          <a href="login.html" style={{ color: '#FF8F9C', textDecoration: 'none', fontSize: '0.875rem' }}>Logout</a>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="finora-empty-main">
        <header className="finora-empty-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#75809A' }}>{current.breadcrumb}</div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '2px 0 0 0' }}>{current.nav}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"} 
              alt={user?.name || "Avatar"} 
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            />
          </div>
        </header>

        <div className="finora-empty-content">
          
          {/* Switcher Bar */}
          <div style={{ background: '#171D4C', padding: '12px 16px', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, marginRight: '8px' }}>Preview Scenario:</span>
            {['transactions', 'income', 'expenses', 'budgets', 'goals'].map(key => (
              <button 
                key={key}
                onClick={() => setScenario(key)}
                style={{
                  background: scenario === key ? '#7957FF' : 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* Centered Empty State Card */}
          <div className="finora-empty-card">
            <div style={{ width: '120px', height: '120px', background: '#F2EEFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#7957FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>

            <h2 className="finora-empty-card-title">{current.title}</h2>
            <p className="finora-empty-card-subtitle">{current.subtitle}</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={current.primaryHref} className="finora-empty-btn-primary">
                {current.primaryText}
              </a>
              <a href={current.secondaryHref} className="finora-empty-btn-secondary">
                {current.secondaryText}
              </a>
            </div>

            {current.hint && (
              <div className="finora-empty-hint">
                💡 {current.hint}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
