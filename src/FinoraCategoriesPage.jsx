import React, { useState, useMemo } from 'react';
import './FinoraCategoriesPage.css';
import { authService } from './services/authService';

/**
 * Finora Expense Tracker — Screen 11: Categories Management Component (React)
 * Production-ready React implementation following the Finora brand identity and design system.
 */

export default function FinoraCategoriesPage() {
  const [user] = useState(() => authService.getCurrentUser());
  const [categories, setCategories] = useState([
    // 12 Default Expense Categories
    { id: 'cat-1', name: 'Food & Dining', type: 'expense', source: 'default', icon: 'ri-restaurant-line', color: '#F06575', txnCount: 32, currentMonthAmount: 6450, description: 'Restaurants, cafés, takeout, and dining out.', archived: false },
    { id: 'cat-2', name: 'Groceries', type: 'expense', source: 'default', icon: 'ri-shopping-basket-line', color: '#F5B544', txnCount: 24, currentMonthAmount: 8200, description: 'Supermarket and daily household provisions.', archived: false },
    { id: 'cat-3', name: 'Transportation', type: 'expense', source: 'default', icon: 'ri-car-line', color: '#48B9F5', txnCount: 18, currentMonthAmount: 3800, description: 'Fuel, metro, cabs, and transit fares.', archived: false },
    { id: 'cat-4', name: 'Shopping', type: 'expense', source: 'default', icon: 'ri-shopping-bag-3-line', color: '#7957FF', txnCount: 15, currentMonthAmount: 7500, description: 'Clothing, personal purchases, and gadgets.', archived: false },
    { id: 'cat-5', name: 'Bills & Utilities', type: 'expense', source: 'default', icon: 'ri-file-text-line', color: '#20275D', txnCount: 8, currentMonthAmount: 5400, description: 'Electricity, water, Wi-Fi, and gas bills.', archived: false },
    { id: 'cat-6', name: 'Housing', type: 'expense', source: 'default', icon: 'ri-home-4-line', color: '#0EA5E9', txnCount: 4, currentMonthAmount: 18000, description: 'Rent, maintenance, and home repairs.', archived: false },
    { id: 'cat-7', name: 'Healthcare', type: 'expense', source: 'default', icon: 'ri-heart-pulse-line', color: '#E11D48', txnCount: 6, currentMonthAmount: 2300, description: 'Doctor visits, pharmacy, and wellness.', archived: false },
    { id: 'cat-8', name: 'Education', type: 'expense', source: 'default', icon: 'ri-book-open-line', color: '#6366F1', txnCount: 3, currentMonthAmount: 4500, description: 'Courses, textbooks, and certifications.', archived: false },
    { id: 'cat-9', name: 'Entertainment', type: 'expense', source: 'default', icon: 'ri-film-line', color: '#A855F7', txnCount: 12, currentMonthAmount: 3400, description: 'Movies, streaming, games, and events.', archived: false },
    { id: 'cat-10', name: 'Travel', type: 'expense', source: 'default', icon: 'ri-plane-line', color: '#38BDF8', txnCount: 5, currentMonthAmount: 12000, description: 'Flights, hotels, and vacation bookings.', archived: false },
    { id: 'cat-11', name: 'Subscriptions', type: 'expense', source: 'default', icon: 'ri-repeat-line', color: '#FB923C', txnCount: 9, currentMonthAmount: 1850, description: 'Monthly software and recurring digital media.', archived: false },
    { id: 'cat-12', name: 'Other Expenses', type: 'expense', source: 'default', icon: 'ri-more-line', color: '#64748B', txnCount: 7, currentMonthAmount: 1420, description: 'Miscellaneous unassigned expenses.', archived: false },

    // 8 Default Income Categories
    { id: 'cat-13', name: 'Salary', type: 'income', source: 'default', icon: 'ri-wallet-3-line', color: '#23B981', txnCount: 2, currentMonthAmount: 65000, description: 'Primary monthly employment paycheck.', archived: false },
    { id: 'cat-14', name: 'Freelance', type: 'income', source: 'default', icon: 'ri-macbook-line', color: '#48B9F5', txnCount: 6, currentMonthAmount: 22500, description: 'Client contracts and consulting retainers.', archived: false },
    { id: 'cat-15', name: 'Business', type: 'income', source: 'default', icon: 'ri-briefcase-line', color: '#7957FF', txnCount: 4, currentMonthAmount: 34000, description: 'Product sales and agency earnings.', archived: false },
    { id: 'cat-16', name: 'Investments', type: 'income', source: 'default', icon: 'ri-line-chart-line', color: '#10B981', txnCount: 8, currentMonthAmount: 8750, description: 'Dividends, mutual funds, and interest.', archived: false },
    { id: 'cat-17', name: 'Rental Income', type: 'income', source: 'default', icon: 'ri-home-2-line', color: '#14B8A6', txnCount: 2, currentMonthAmount: 16000, description: 'Residential property lease revenue.', archived: false },
    { id: 'cat-18', name: 'Bonus', type: 'income', source: 'default', icon: 'ri-gift-line', color: '#F5B544', txnCount: 1, currentMonthAmount: 10000, description: 'Performance incentives and awards.', archived: false },
    { id: 'cat-19', name: 'Gifts Received', type: 'income', source: 'default', icon: 'ri-hand-heart-line', color: '#F43F5E', txnCount: 3, currentMonthAmount: 3500, description: 'Monetary gifts and envelopes.', archived: false },
    { id: 'cat-20', name: 'Other Income', type: 'income', source: 'default', icon: 'ri-money-dollar-circle-line', color: '#06B6D4', txnCount: 2, currentMonthAmount: 2100, description: 'Cashbacks, refunds, and interest.', archived: false },

    // 5 Custom Categories
    { id: 'cat-21', name: 'Pet Care', type: 'expense', source: 'custom', icon: 'ri-footprint-line', color: '#EC4899', txnCount: 14, currentMonthAmount: 4200, description: 'Veterinary visits and pet food.', archived: false },
    { id: 'cat-22', name: 'Fitness & Gym', type: 'expense', source: 'custom', icon: 'ri-riding-line', color: '#8B5CF6', txnCount: 8, currentMonthAmount: 2800, description: 'Gym memberships and health shakes.', archived: false },
    { id: 'cat-23', name: 'Photography', type: 'expense', source: 'custom', icon: 'ri-camera-3-line', color: '#3B82F6', txnCount: 6, currentMonthAmount: 3500, description: 'Studio equipment and memory cards.', archived: false },
    { id: 'cat-24', name: 'YouTube AdSense', type: 'income', source: 'custom', icon: 'ri-youtube-line', color: '#EF4444', txnCount: 4, currentMonthAmount: 12400, description: 'YouTube creator monetization payout.', archived: false },
    { id: 'cat-25', name: 'Crypto Staking', type: 'income', source: 'custom', icon: 'ri-copper-coin-line', color: '#F59E0B', txnCount: 9, currentMonthAmount: 6800, description: 'DeFi protocol yield distribution.', archived: false }
  ]);

  const [currentSegment, setCurrentSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedDetailsCategory, setSelectedDetailsCategory] = useState(null);
  const [isDefaultsOpen, setIsDefaultsOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formIcon, setFormIcon] = useState('ri-restaurant-line');
  const [formColor, setFormColor] = useState('#F06575');
  const [formDesc, setFormDesc] = useState('');
  const [formError, setFormError] = useState('');

  // Calculations
  const activeCategories = useMemo(() => categories.filter(c => !c.archived), [categories]);
  const incomeCount = useMemo(() => activeCategories.filter(c => c.type === 'income').length, [activeCategories]);
  const expenseCount = useMemo(() => activeCategories.filter(c => c.type === 'expense').length, [activeCategories]);
  const customCount = useMemo(() => activeCategories.filter(c => c.source === 'custom').length, [activeCategories]);

  // Filter & Sort
  const displayedCategories = useMemo(() => {
    return categories.filter(c => {
      if (c.archived) return false;
      if (currentSegment === 'income' && c.type !== 'income') return false;
      if (currentSegment === 'expense' && c.type !== 'expense') return false;
      if (filterType !== 'all' && c.type !== filterType) return false;
      if (filterSource !== 'all' && c.source !== filterSource) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !(c.description && c.description.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'most-used') return b.txnCount - a.txnCount;
      if (sortBy === 'highest-amount') return b.currentMonthAmount - a.currentMonthAmount;
      return 0;
    });
  }, [categories, currentSegment, filterType, filterSource, searchQuery, sortBy]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormType('expense');
    setFormIcon('ri-restaurant-line');
    setFormColor('#F06575');
    setFormDesc('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: formName.trim(),
        type: formType,
        icon: formIcon,
        color: formColor,
        description: formDesc.trim()
      } : c));
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: formName.trim(),
        type: formType,
        source: 'custom',
        icon: formIcon,
        color: formColor,
        txnCount: 0,
        currentMonthAmount: 0,
        description: formDesc.trim(),
        archived: false
      };
      setCategories(prev => [newCat, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleArchiveToggle = (id) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c));
  };

  return (
    <div className="finora-categories-app">
      {/* Sidebar */}
      <aside className="fc-sidebar">
        <div>
          <div className="fc-brand">
            <div className="fc-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="4" height="9" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
                <rect x="17" y="4" width="4" height="16" rx="1.5" fill="white" />
                <path d="M5 8L12 4L19 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="2" r="2" fill="#23B981"/>
              </svg>
            </div>
            <div>
              <div className="fc-brand-name">Finora</div>
              <div className="fc-brand-tagline">Track. Plan. Save. Grow.</div>
            </div>
          </div>

          <nav className="fc-nav">
            <a href="dashboard.html" className="fc-nav-item"><i className="ri-dashboard-line"></i> Dashboard</a>
            <a href="transactions.html" className="fc-nav-item"><i className="ri-exchange-dollar-line"></i> Transactions</a>
            <a href="add-income.html" className="fc-nav-item"><i className="ri-wallet-3-line"></i> Income</a>
            <a href="add-expense.html" className="fc-nav-item"><i className="ri-shopping-bag-3-line"></i> Expenses</a>
            <a href="analytics.html" className="fc-nav-item"><i className="ri-pie-chart-line"></i> Analytics</a>
            <a href="budgets.html" className="fc-nav-item"><i className="ri-funds-line"></i> Budgets</a>
            <a href="goals.html" className="fc-nav-item"><i className="ri-flag-line"></i> Goals</a>
            <a href="categories.html" className="fc-nav-item active"><i className="ri-price-tag-3-fill"></i> Categories</a>
            <a href="#recurring" className="fc-nav-item"><i className="ri-repeat-line"></i> Recurring</a>
            <a href="#settings" className="fc-nav-item"><i className="ri-settings-4-line"></i> Settings</a>
          </nav>
        </div>

        <a href="login.html" className="fc-logout">
          <i className="ri-logout-box-r-line"></i> Logout
        </a>
      </aside>

      {/* Main Workspace */}
      <main className="fc-workspace">
        <header className="fc-header">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#75809A', marginBottom: 2 }}>Dashboard / Categories</div>
            <h1>Categories Management</h1>
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

        <div className="fc-content">
          {/* Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.35rem', fontWeight: 700 }}>Your Financial Categories</h2>
              <p style={{ color: '#75809A', fontSize: '0.875rem' }}>Organize your income and expenses your way.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setIsDefaultsOpen(true)}
                style={{ background: '#FFF', border: '1px solid #E8EBF3', borderRadius: 10, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="ri-settings-3-line"></i> Manage Defaults
              </button>
              <button 
                onClick={handleOpenCreateModal}
                style={{ background: '#7957FF', color: '#FFF', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="ri-add-line"></i> + Create Category
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="fc-overview-grid">
            <div className="fc-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#E8F8F2', color: '#23B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-arrow-up-circle-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Income Categories</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{incomeCount}</div>
                <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Available income types</div>
              </div>
            </div>

            <div className="fc-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#FEEFF1', color: '#F06575', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-arrow-down-circle-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Expense Categories</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{expenseCount}</div>
                <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Available expense types</div>
              </div>
            </div>

            <div className="fc-summary-card">
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#F2EFFF', color: '#7957FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                <i className="ri-folder-add-line"></i>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#75809A', fontWeight: 600, textTransform: 'uppercase' }}>Custom Categories</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{customCount}</div>
                <div style={{ fontSize: '0.75rem', color: '#75809A' }}>Created by you</div>
              </div>
            </div>
          </div>

          {/* Type Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: '#EBF0F8', padding: 4, borderRadius: 10, display: 'inline-flex', gap: 4 }}>
              <button 
                onClick={() => setCurrentSegment('all')}
                style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentSegment === 'all' ? '#FFF' : 'transparent', fontWeight: 600 }}
              >
                All Categories ({activeCategories.length})
              </button>
              <button 
                onClick={() => setCurrentSegment('income')}
                style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentSegment === 'income' ? '#FFF' : 'transparent', color: currentSegment === 'income' ? '#23B981' : '#75809A', fontWeight: 600 }}
              >
                Income ({incomeCount})
              </button>
              <button 
                onClick={() => setCurrentSegment('expense')}
                style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: currentSegment === 'expense' ? '#FFF' : 'transparent', color: currentSegment === 'expense' ? '#F06575' : '#75809A', fontWeight: 600 }}
              >
                Expenses ({expenseCount})
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="fc-categories-grid">
            {displayedCategories.map(cat => (
              <div key={cat.id} className="fc-category-card" onClick={() => setSelectedDetailsCategory(cat)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }}>
                    <i className={cat.icon}></i>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1.05rem' }}>{cat.name}</h4>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: cat.type === 'income' ? '#E8F8F2' : '#FEEFF1', color: cat.type === 'income' ? '#23B981' : '#F06575' }}>
                        {cat.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: '#F1F4F9', color: '#6C7793' }}>
                        {cat.source === 'default' ? 'Default' : 'Custom'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E8EBF3', marginTop: 16, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#75809A' }}>{cat.txnCount} transactions</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: cat.type === 'income' ? '#23B981' : '#F06575' }}>
                    ₹{cat.currentMonthAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
