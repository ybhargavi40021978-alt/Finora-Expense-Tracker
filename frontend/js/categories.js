/**
 * ==============================================================================
 * FINORA EXPENSE TRACKER — SCREEN 11: CATEGORIES MANAGEMENT JS
 * Brand: Finora | "Track. Plan. Save. Grow."
 * ==============================================================================
 */

(function () {
  'use strict';

  // --- Initial Categories Dataset ---
  const INITIAL_CATEGORIES = [
    // 12 Default Expense Categories
    {
      id: 'cat-exp-1',
      name: 'Food & Dining',
      type: 'expense',
      source: 'default',
      icon: 'ri-restaurant-line',
      color: '#F06575',
      txnCount: 32,
      currentMonthAmount: 6450,
      description: 'Restaurants, cafés, takeout, and dining out with friends or family.',
      budgetLinked: 'Food & Dining (₹10,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-2',
      name: 'Groceries',
      type: 'expense',
      source: 'default',
      icon: 'ri-shopping-basket-line',
      color: '#F5B544',
      txnCount: 24,
      currentMonthAmount: 8200,
      description: 'Supermarket shopping, fresh produce, household provisions, and dairy.',
      budgetLinked: 'Groceries & Kitchen (₹9,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-3',
      name: 'Transportation',
      type: 'expense',
      source: 'default',
      icon: 'ri-car-line',
      color: '#48B9F5',
      txnCount: 18,
      currentMonthAmount: 3800,
      description: 'Fuel, metro tickets, rideshare, toll charges, and vehicle maintenance.',
      budgetLinked: 'Transportation (₹5,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-4',
      name: 'Shopping',
      type: 'expense',
      source: 'default',
      icon: 'ri-shopping-bag-3-line',
      color: '#7957FF',
      txnCount: 15,
      currentMonthAmount: 7500,
      description: 'Apparel, footwear, accessories, electronics, and personal lifestyle purchases.',
      budgetLinked: 'Shopping & Retail (₹8,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-5',
      name: 'Bills & Utilities',
      type: 'expense',
      source: 'default',
      icon: 'ri-file-text-line',
      color: '#20275D',
      txnCount: 8,
      currentMonthAmount: 5400,
      description: 'Electricity, water, cooking gas, broadband internet, and mobile recharges.',
      budgetLinked: 'Bills & Utilities (₹6,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-6',
      name: 'Housing',
      type: 'expense',
      source: 'default',
      icon: 'ri-home-4-line',
      color: '#0EA5E9',
      txnCount: 4,
      currentMonthAmount: 18000,
      description: 'Apartment rent, society maintenance fees, property taxes, and home repairs.',
      budgetLinked: 'Housing & Rent (₹20,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-7',
      name: 'Healthcare',
      type: 'expense',
      source: 'default',
      icon: 'ri-heart-pulse-line',
      color: '#E11D48',
      txnCount: 6,
      currentMonthAmount: 2300,
      description: 'Doctor consultations, medicines, diagnostic tests, and health insurance.',
      budgetLinked: 'Healthcare (₹4,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-8',
      name: 'Education',
      type: 'expense',
      source: 'default',
      icon: 'ri-book-open-line',
      color: '#6366F1',
      txnCount: 3,
      currentMonthAmount: 4500,
      description: 'Online learning platforms, technical certifications, books, and courses.',
      budgetLinked: 'Education & Learning (₹5,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-9',
      name: 'Entertainment',
      type: 'expense',
      source: 'default',
      icon: 'ri-film-line',
      color: '#A855F7',
      txnCount: 12,
      currentMonthAmount: 3400,
      description: 'Cinema tickets, gaming subscriptions, live events, concerts, and streaming.',
      budgetLinked: 'Entertainment (₹3,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-10',
      name: 'Travel',
      type: 'expense',
      source: 'default',
      icon: 'ri-plane-line',
      color: '#38BDF8',
      txnCount: 5,
      currentMonthAmount: 12000,
      description: 'Flight tickets, train bookings, holiday accommodation, and tour packages.',
      budgetLinked: 'Travel & Vacations (₹15,000)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-11',
      name: 'Subscriptions',
      type: 'expense',
      source: 'default',
      icon: 'ri-repeat-line',
      color: '#FB923C',
      txnCount: 9,
      currentMonthAmount: 1850,
      description: 'Monthly SaaS tools, cloud storage, music streaming, and news periodicals.',
      budgetLinked: 'Subscriptions (₹2,500)',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-exp-12',
      name: 'Other Expenses',
      type: 'expense',
      source: 'default',
      icon: 'ri-more-line',
      color: '#64748B',
      txnCount: 7,
      currentMonthAmount: 1420,
      description: 'Uncategorized personal disbursements, tips, donations, and miscellaneous items.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },

    // 8 Default Income Categories
    {
      id: 'cat-inc-1',
      name: 'Salary',
      type: 'income',
      source: 'default',
      icon: 'ri-wallet-3-line',
      color: '#23B981',
      txnCount: 2,
      currentMonthAmount: 65000,
      description: 'Primary employment monthly paycheck and direct employer credits.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-2',
      name: 'Freelance',
      type: 'income',
      source: 'default',
      icon: 'ri-macbook-line',
      color: '#48B9F5',
      txnCount: 6,
      currentMonthAmount: 22500,
      description: 'Independent client projects, consultancy retainers, and freelance design work.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-3',
      name: 'Business',
      type: 'income',
      source: 'default',
      icon: 'ri-briefcase-line',
      color: '#7957FF',
      txnCount: 4,
      currentMonthAmount: 34000,
      description: 'Commercial sales revenue, service contracts, and proprietary agency earnings.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-4',
      name: 'Investments',
      type: 'income',
      source: 'default',
      icon: 'ri-line-chart-line',
      color: '#10B981',
      txnCount: 8,
      currentMonthAmount: 8750,
      description: 'Stock dividends, mutual fund distributions, fixed deposit interest, and capital gains.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-5',
      name: 'Rental Income',
      type: 'income',
      source: 'default',
      icon: 'ri-home-2-line',
      color: '#14B8A6',
      txnCount: 2,
      currentMonthAmount: 16000,
      description: 'Monthly residential lease collections from tenant occupied property.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-6',
      name: 'Bonus',
      type: 'income',
      source: 'default',
      icon: 'ri-gift-line',
      color: '#F5B544',
      txnCount: 1,
      currentMonthAmount: 10000,
      description: 'Performance incentives, festival bonuses, and annual company gratuity.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-7',
      name: 'Gifts Received',
      type: 'income',
      source: 'default',
      icon: 'ri-hand-heart-line',
      color: '#F43F5E',
      txnCount: 3,
      currentMonthAmount: 3500,
      description: 'Monetary gifts from relatives, wedding envelopes, and festive contributions.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },
    {
      id: 'cat-inc-8',
      name: 'Other Income',
      type: 'income',
      source: 'default',
      icon: 'ri-money-dollar-circle-line',
      color: '#06B6D4',
      txnCount: 2,
      currentMonthAmount: 2100,
      description: 'Credit card reward cashbacks, asset liquidation, and miscellaneous refunds.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-01-01'
    },

    // 5 Realistic Custom Categories Created by Authenticated User
    {
      id: 'cat-cust-1',
      name: 'Pet Care',
      type: 'expense',
      source: 'custom',
      icon: 'ri-footprint-line',
      color: '#EC4899',
      txnCount: 14,
      currentMonthAmount: 4200,
      description: 'Veterinary visits, organic pet food, grooming supplies, and accessories.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-02-15'
    },
    {
      id: 'cat-cust-2',
      name: 'Fitness & Gym',
      type: 'expense',
      source: 'custom',
      icon: 'ri-riding-line',
      color: '#8B5CF6',
      txnCount: 8,
      currentMonthAmount: 2800,
      description: 'Gym membership, protein supplements, workout apparel, and yoga passes.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-03-01'
    },
    {
      id: 'cat-cust-3',
      name: 'Photography',
      type: 'expense',
      source: 'custom',
      icon: 'ri-camera-3-line',
      color: '#3B82F6',
      txnCount: 6,
      currentMonthAmount: 3500,
      description: 'Lens filters, SD cards, tripod maintenance, and studio equipment rentals.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-03-10'
    },
    {
      id: 'cat-cust-4',
      name: 'YouTube AdSense',
      type: 'income',
      source: 'custom',
      icon: 'ri-youtube-line',
      color: '#EF4444',
      txnCount: 4,
      currentMonthAmount: 12400,
      description: 'Ad revenue and channel sponsorship payouts from personal tech channel.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-03-18'
    },
    {
      id: 'cat-cust-5',
      name: 'Crypto Staking',
      type: 'income',
      source: 'custom',
      icon: 'ri-copper-coin-line',
      color: '#F59E0B',
      txnCount: 9,
      currentMonthAmount: 6800,
      description: 'Decentralized protocol staking rewards and yield aggregation distributions.',
      budgetLinked: 'No budget linked',
      archived: false,
      createdAt: '2026-03-25'
    }
  ];

  // --- State ---
  let categories = [...INITIAL_CATEGORIES];
  let currentSegment = 'all'; // 'all' | 'income' | 'expense'
  let searchQuery = '';
  let filterType = 'all'; // 'all' | 'income' | 'expense'
  let filterSource = 'all'; // 'all' | 'default' | 'custom'
  let sortBy = 'name-asc'; // 'name-asc' | 'name-desc' | 'most-used' | 'highest-amount'
  let viewMode = 'grid'; // 'grid' | 'list'
  let showArchived = false;
  let activeDemoState = 'standard';

  // Modal Editing State
  let editingCategoryId = null;
  let selectedIcon = 'ri-restaurant-line';
  let selectedColor = '#F06575';
  let selectedType = 'expense';

  // Details Drawer State
  let activeDetailsCategory = null;

  // --- Utility: Indian Currency Formatting ---
  function formatINR(val) {
    if (isNaN(val)) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  // --- DOM Elements ---
  const categoriesGrid = document.getElementById('categories-grid');
  const countIncomeEl = document.getElementById('count-income');
  const countExpenseEl = document.getElementById('count-expense');
  const countCustomEl = document.getElementById('count-custom');
  
  const segmentAllBtn = document.getElementById('segment-all');
  const segmentIncomeBtn = document.getElementById('segment-income');
  const segmentExpenseBtn = document.getElementById('segment-expense');
  const segmentAllCount = document.getElementById('segment-all-count');
  const segmentIncomeCount = document.getElementById('segment-income-count');
  const segmentExpenseCount = document.getElementById('segment-expense-count');
  const activeStatsCount = document.getElementById('active-stats-count');

  const searchInput = document.getElementById('search-categories');
  const filterTypeSelect = document.getElementById('filter-type');
  const filterSourceSelect = document.getElementById('filter-source');
  const sortSelect = document.getElementById('sort-categories');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const toggleGridBtn = document.getElementById('view-grid');
  const toggleListBtn = document.getElementById('view-list');

  // Modals
  const categoryModalOverlay = document.getElementById('category-modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const categoryForm = document.getElementById('category-form');
  const catNameInput = document.getElementById('cat-name');
  const catDescInput = document.getElementById('cat-desc');
  const catBudgetSelect = document.getElementById('cat-budget');
  const nameError = document.getElementById('name-error');
  const typeRadioCards = document.querySelectorAll('.type-radio-card');
  const iconChoiceBtns = document.querySelectorAll('.icon-choice-btn');
  const colorSwatchBtns = document.querySelectorAll('.color-swatch-btn');

  // Details Drawer
  const detailsDrawerBackdrop = document.getElementById('drawer-backdrop');
  const detailsDrawer = document.getElementById('details-drawer');
  const drawerIcon = document.getElementById('drawer-icon');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerBadges = document.getElementById('drawer-badges');
  const drawerDescription = document.getElementById('drawer-desc');
  const drawerAmountLabel = document.getElementById('drawer-amt-label');
  const drawerAmount = document.getElementById('drawer-amt');
  const drawerTxnCount = document.getElementById('drawer-txn-count');
  const drawerAvgAmount = document.getElementById('drawer-avg-amt');
  const drawerTxnList = document.getElementById('drawer-txns-list');
  const drawerEditBtn = document.getElementById('drawer-edit-btn');
  const drawerTransactionsBtn = document.getElementById('drawer-txns-btn');
  const drawerArchiveBtn = document.getElementById('drawer-archive-btn');

  // Manage Defaults Modal
  const defaultsModalOverlay = document.getElementById('defaults-modal-overlay');
  const defaultsListContainer = document.getElementById('defaults-list-container');
  const restoreDefaultsBtn = document.getElementById('restore-defaults-btn');

  // Confirmation Modal
  const confirmModalOverlay = document.getElementById('confirm-modal-overlay');
  const confirmTitle = document.getElementById('confirm-title');
  const confirmDesc = document.getElementById('confirm-desc');
  const confirmActionBtn = document.getElementById('confirm-action-btn');
  let confirmCallback = null;

  // Demo Switcher
  const demoButtons = document.querySelectorAll('.demo-btn');
  const apiErrorBanner = document.getElementById('api-error-banner');
  const retryBtn = document.getElementById('retry-btn');

  // Mobile Menu
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // Toast container
  const toastContainer = document.getElementById('toast-container');

  // --- Show Toast Notification ---
  function showToast(msg, icon = 'ri-checkbox-circle-fill') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}" style="color: #23B981; font-size: 1.15rem;"></i><span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Calculate and Update Summaries ---
  function updateSummaries() {
    const active = categories.filter(c => !c.archived);
    const incomeCats = active.filter(c => c.type === 'income');
    const expenseCats = active.filter(c => c.type === 'expense');
    const customCats = active.filter(c => c.source === 'custom');

    if (countIncomeEl) countIncomeEl.textContent = incomeCats.length;
    if (countExpenseEl) countExpenseEl.textContent = expenseCats.length;
    if (countCustomEl) countCustomEl.textContent = customCats.length;

    if (segmentAllCount) segmentAllCount.textContent = active.length;
    if (segmentIncomeCount) segmentIncomeCount.textContent = incomeCats.length;
    if (segmentExpenseCount) segmentExpenseCount.textContent = expenseCats.length;
  }

  // --- Render Categories Grid ---
  function renderCategories() {
    if (activeDemoState === 'api-error') {
      categoriesGrid.innerHTML = '';
      if (apiErrorBanner) apiErrorBanner.style.display = 'block';
      return;
    }
    if (apiErrorBanner) apiErrorBanner.style.display = 'none';

    // Filter categories
    let list = categories.filter(cat => {
      // Archived filter
      if (!showArchived && cat.archived) return false;
      if (showArchived && !cat.archived) return false;

      // Type switcher segment
      if (currentSegment === 'income' && cat.type !== 'income') return false;
      if (currentSegment === 'expense' && cat.type !== 'expense') return false;

      // Filter Toolbar dropdowns
      if (filterType !== 'all' && cat.type !== filterType) return false;
      if (filterSource !== 'all' && cat.source !== filterSource) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchDesc = cat.description ? cat.description.toLowerCase().includes(q) : false;
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });

    // Update active stats
    if (activeStatsCount) {
      activeStatsCount.textContent = list.length;
    }

    // Sort categories
    list.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'most-used') return b.txnCount - a.txnCount;
      if (sortBy === 'highest-amount') return b.currentMonthAmount - a.currentMonthAmount;
      return 0;
    });

    // Check empty states
    if (list.length === 0) {
      if (searchQuery.trim() !== '' || filterType !== 'all' || filterSource !== 'all') {
        categoriesGrid.innerHTML = `
          <div class="state-container" style="grid-column: 1 / -1;">
            <div class="state-icon"><i class="ri-search-eye-line"></i></div>
            <h3 class="state-title">No categories found</h3>
            <p class="state-desc">We couldn't find any categories matching "${searchQuery}". Try another keyword or clear your filters.</p>
            <button class="btn-secondary" id="empty-clear-btn" style="margin-top: 8px;">
              <i class="ri-refresh-line"></i> Clear Filters
            </button>
          </div>
        `;
        document.getElementById('empty-clear-btn')?.addEventListener('click', clearAllFilters);
      } else if (showArchived) {
        categoriesGrid.innerHTML = `
          <div class="state-container" style="grid-column: 1 / -1;">
            <div class="state-icon"><i class="ri-archive-line"></i></div>
            <h3 class="state-title">No archived categories</h3>
            <p class="state-desc">You haven't archived any categories. Active categories remain available for transaction logging.</p>
          </div>
        `;
      } else {
        categoriesGrid.innerHTML = `
          <div class="state-container" style="grid-column: 1 / -1;">
            <div class="state-icon"><i class="ri-folder-add-line"></i></div>
            <h3 class="state-title">Your categories start here</h3>
            <p class="state-desc">Create categories to organize your income and expenses your way, or restore system defaults.</p>
            <button class="btn-primary" id="empty-create-btn" style="margin-top: 8px;">
              <i class="ri-add-line"></i> Create Your First Category
            </button>
          </div>
        `;
        document.getElementById('empty-create-btn')?.addEventListener('click', () => openCategoryModal());
      }
      return;
    }

    // Build Cards HTML
    categoriesGrid.className = `categories-grid ${viewMode === 'list' ? 'list-view' : ''}`;
    categoriesGrid.innerHTML = list.map(cat => {
      const isIncome = cat.type === 'income';
      const typeLabel = isIncome ? 'Income' : 'Expense';
      const typeClass = isIncome ? 'type-income' : 'type-expense';
      const sourceClass = cat.source === 'default' ? 'source-default' : 'source-custom';
      const amountValClass = isIncome ? 'income-amt' : 'expense-amt';
      const amountLabel = isIncome ? 'Earned this month' : 'Spent this month';
      const archivedBadge = cat.archived ? `<span class="badge-pill status-archived"><i class="ri-archive-line"></i> Archived</span>` : '';

      return `
        <article class="category-card ${cat.archived ? 'archived' : ''}" data-id="${cat.id}">
          <div class="category-card-top">
            <div class="card-icon-title-group">
              <div class="category-icon-tile" style="background: ${cat.color}15; color: ${cat.color};">
                <i class="${cat.icon}"></i>
              </div>
              <div class="category-name-badges">
                <h4 class="category-title">${cat.name}</h4>
                <div class="category-badges-row">
                  <span class="badge-pill ${typeClass}">${typeLabel}</span>
                  <span class="badge-pill ${sourceClass}">${cat.source === 'default' ? 'Default' : 'Custom'}</span>
                  ${archivedBadge}
                </div>
              </div>
            </div>

            <!-- Card Action Dropdown Menu -->
            <div style="position: relative;">
              <button class="card-menu-btn" data-id="${cat.id}" aria-label="Category options for ${cat.name}">
                <i class="ri-more-2-fill"></i>
              </button>
              <div class="card-menu-dropdown" id="dropdown-${cat.id}">
                <button class="menu-item menu-action-txns" data-name="${encodeURIComponent(cat.name)}">
                  <i class="ri-exchange-dollar-line"></i> View Transactions
                </button>
                <button class="menu-item menu-action-edit" data-id="${cat.id}">
                  <i class="ri-edit-line"></i> Edit Category
                </button>
                ${cat.archived ? `
                  <button class="menu-item menu-action-restore" data-id="${cat.id}">
                    <i class="ri-inbox-unarchive-line"></i> Restore Category
                  </button>
                ` : `
                  <button class="menu-item menu-action-archive" data-id="${cat.id}">
                    <i class="ri-archive-line"></i> Archive Category
                  </button>
                `}
                <button class="menu-item danger menu-action-delete ${cat.source === 'default' ? 'disabled' : ''}" data-id="${cat.id}" ${cat.source === 'default' ? 'title="Default categories are protected and cannot be deleted"' : ''}>
                  <i class="ri-delete-bin-line"></i> Delete Category
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Stats -->
          <div class="category-card-stats">
            <span class="txn-count-text">
              <i class="ri-file-list-3-line"></i> ${cat.txnCount} transaction${cat.txnCount === 1 ? '' : 's'}
            </span>
            <div class="txn-amount-group">
              <div class="amount-label">${amountLabel}</div>
              <div class="amount-val ${amountValClass}">${formatINR(cat.currentMonthAmount)}</div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachCardEventListeners();
  }

  // --- Attach Event Listeners to Category Cards ---
  function attachCardEventListeners() {
    // Card Clicks (Open Details Drawer, unless clicking menu)
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-menu-btn') || e.target.closest('.card-menu-dropdown')) {
          return;
        }
        const id = card.getAttribute('data-id');
        openDetailsDrawer(id);
      });
    });

    // Menu Toggle Buttons
    document.querySelectorAll('.card-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const dropdown = document.getElementById(`dropdown-${id}`);
        // Close others
        document.querySelectorAll('.card-menu-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('show');
        });
        dropdown.classList.toggle('show');
      });
    });

    // Menu Actions: View Transactions
    document.querySelectorAll('.menu-action-txns').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const catName = btn.getAttribute('data-name');
        window.location.href = `transactions.html?category=${catName}`;
      });
    });

    // Menu Actions: Edit
    document.querySelectorAll('.menu-action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openCategoryModal(id);
      });
    });

    // Menu Actions: Archive
    document.querySelectorAll('.menu-action-archive').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        openConfirmModal(
          `Archive "${cat.name}"?`,
          `Archiving this category will hide it from future transaction dropdowns. All ${cat.txnCount} past transactions and reporting records will remain intact. You can restore this category at any time.`,
          'Archive Category',
          () => {
            cat.archived = true;
            updateSummaries();
            renderCategories();
            showToast(`"${cat.name}" has been archived.`);
          }
        );
      });
    });

    // Menu Actions: Restore
    document.querySelectorAll('.menu-action-restore').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        cat.archived = false;
        updateSummaries();
        renderCategories();
        showToast(`"${cat.name}" restored to active categories.`);
      });
    });

    // Menu Actions: Delete
    document.querySelectorAll('.menu-action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const cat = categories.find(c => c.id === id);
        if (!cat) return;

        if (cat.source === 'default') {
          showToast('Default system categories cannot be deleted.', 'ri-error-warning-fill');
          return;
        }

        openConfirmModal(
          `Delete "${cat.name}"?`,
          `Are you sure you want to delete this custom category? If there are ${cat.txnCount} linked transactions, they will be safely preserved and moved to "Other ${cat.type === 'income' ? 'Income' : 'Expenses'}".`,
          'Delete Category',
          () => {
            categories = categories.filter(c => c.id !== id);
            updateSummaries();
            renderCategories();
            showToast(`Custom category "${cat.name}" deleted.`);
          }
        );
      });
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.card-menu-dropdown').forEach(d => d.classList.remove('show'));
  });

  // --- Category Details Drawer ---
  function openDetailsDrawer(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    activeDetailsCategory = cat;

    drawerIcon.className = cat.icon;
    drawerIcon.parentElement.style.background = `${cat.color}18`;
    drawerIcon.parentElement.style.color = cat.color;

    drawerTitle.textContent = cat.name;
    drawerDescription.textContent = cat.description || 'No description provided.';
    drawerAmountLabel.textContent = cat.type === 'income' ? 'Total Income This Month' : 'Total Spent This Month';
    drawerAmount.textContent = formatINR(cat.currentMonthAmount);
    drawerAmount.className = `val ${cat.type === 'income' ? 'income-amt' : 'expense-amt'}`;
    drawerTxnCount.textContent = `${cat.txnCount} recorded`;

    const avg = cat.txnCount > 0 ? Math.round(cat.currentMonthAmount / cat.txnCount) : 0;
    drawerAvgAmount.textContent = formatINR(avg);

    // Badges
    drawerBadges.innerHTML = `
      <span class="badge-pill ${cat.type === 'income' ? 'type-income' : 'type-expense'}">${cat.type === 'income' ? 'Income' : 'Expense'}</span>
      <span class="badge-pill ${cat.source === 'default' ? 'source-default' : 'source-custom'}">${cat.source === 'default' ? 'Default' : 'Custom'}</span>
      ${cat.archived ? '<span class="badge-pill status-archived">Archived</span>' : ''}
    `;

    // Simulated Recent Category Transactions
    const sampleTxns = [
      { note: `${cat.name} Payment`, date: '14 Oct 2026', amt: Math.round(cat.currentMonthAmount * 0.45) },
      { note: `Regular ${cat.name}`, date: '08 Oct 2026', amt: Math.round(cat.currentMonthAmount * 0.35) },
      { note: `Initial ${cat.name}`, date: '02 Oct 2026', amt: Math.round(cat.currentMonthAmount * 0.20) }
    ];

    drawerTxnList.innerHTML = sampleTxns.map(t => `
      <div class="mini-txn-item">
        <div>
          <div style="font-weight: 600; color: #18213D;">${t.note}</div>
          <div class="mini-txn-date">${t.date}</div>
        </div>
        <div style="font-weight: 700; color: ${cat.type === 'income' ? '#23B981' : '#F06575'};">
          ${cat.type === 'income' ? '+' : '-'}${formatINR(t.amt)}
        </div>
      </div>
    `).join('');

    // Configure Drawer Actions
    drawerEditBtn.onclick = () => {
      closeDetailsDrawer();
      openCategoryModal(cat.id);
    };

    drawerTransactionsBtn.onclick = () => {
      window.location.href = `transactions.html?category=${encodeURIComponent(cat.name)}`;
    };

    drawerArchiveBtn.innerHTML = cat.archived
      ? '<i class="ri-inbox-unarchive-line"></i> Restore Category'
      : '<i class="ri-archive-line"></i> Archive Category';

    drawerArchiveBtn.onclick = () => {
      cat.archived = !cat.archived;
      updateSummaries();
      renderCategories();
      closeDetailsDrawer();
      showToast(cat.archived ? `"${cat.name}" has been archived.` : `"${cat.name}" has been restored.`);
    };

    detailsDrawerBackdrop.classList.add('active');
    detailsDrawer.classList.add('open');
  }

  function closeDetailsDrawer() {
    detailsDrawerBackdrop.classList.remove('active');
    detailsDrawer.classList.remove('open');
    activeDetailsCategory = null;
  }

  // --- Create / Edit Category Modal ---
  function openCategoryModal(id = null) {
    editingCategoryId = id;
    nameError.style.display = 'none';

    if (id) {
      const cat = categories.find(c => c.id === id);
      if (!cat) return;
      modalTitle.textContent = 'Edit Category';
      modalSubtitle.textContent = 'Modify category details and preferences.';
      modalSubmitBtn.innerHTML = '<i class="ri-check-line"></i> Save Changes';
      catNameInput.value = cat.name;
      catDescInput.value = cat.description || '';
      selectedType = cat.type;
      selectedIcon = cat.icon;
      selectedColor = cat.color;
    } else {
      modalTitle.textContent = 'Create New Category';
      modalSubtitle.textContent = 'Personalize how you organize your money.';
      modalSubmitBtn.innerHTML = '<i class="ri-add-line"></i> Create Category';
      categoryForm.reset();
      selectedType = currentSegment === 'income' ? 'income' : 'expense';
      selectedIcon = selectedType === 'income' ? 'ri-wallet-3-line' : 'ri-restaurant-line';
      selectedColor = selectedType === 'income' ? '#23B981' : '#F06575';
    }

    // Update Type Radio Cards
    typeRadioCards.forEach(card => {
      const t = card.getAttribute('data-type');
      card.classList.toggle('selected', t === selectedType);
    });

    // Update Icon selection
    iconChoiceBtns.forEach(btn => {
      const icon = btn.getAttribute('data-icon');
      btn.classList.toggle('selected', icon === selectedIcon);
    });

    // Update Color selection
    colorSwatchBtns.forEach(btn => {
      const color = btn.getAttribute('data-color');
      btn.classList.toggle('selected', color.toLowerCase() === selectedColor.toLowerCase());
    });

    categoryModalOverlay.classList.add('active');
    catNameInput.focus();
  }

  function closeCategoryModal() {
    categoryModalOverlay.classList.remove('active');
    editingCategoryId = null;
  }

  // Form Submit Handler
  categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawName = catNameInput.value.trim();

    if (!rawName) {
      nameError.textContent = 'Please enter a category name.';
      nameError.style.display = 'block';
      catNameInput.focus();
      return;
    }

    // Duplicate check
    const isDup = categories.some(c => 
      c.id !== editingCategoryId &&
      c.name.toLowerCase() === rawName.toLowerCase() &&
      c.type === selectedType
    );

    if (isDup) {
      nameError.textContent = `A ${selectedType} category named "${rawName}" already exists.`;
      nameError.style.display = 'block';
      catNameInput.focus();
      return;
    }

    nameError.style.display = 'none';

    if (editingCategoryId) {
      // Edit existing
      const cat = categories.find(c => c.id === editingCategoryId);
      if (cat) {
        cat.name = rawName;
        cat.icon = selectedIcon;
        cat.color = selectedColor;
        cat.description = catDescInput.value.trim();
        cat.budgetLinked = catBudgetSelect.value;
        showToast(`Category "${cat.name}" updated successfully.`);
      }
    } else {
      // Create new custom category
      const newCat = {
        id: 'cat-custom-' + Date.now(),
        name: rawName,
        type: selectedType,
        source: 'custom',
        icon: selectedIcon,
        color: selectedColor,
        txnCount: 0,
        currentMonthAmount: 0,
        description: catDescInput.value.trim(),
        budgetLinked: catBudgetSelect.value,
        archived: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      categories.unshift(newCat);
      showToast(`Category "${newCat.name}" created!`);
    }

    closeCategoryModal();
    updateSummaries();
    renderCategories();
  });

  // Type Radio selection
  typeRadioCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedType = card.getAttribute('data-type');
      typeRadioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Auto update default icon/color if creating new
      if (!editingCategoryId) {
        selectedColor = selectedType === 'income' ? '#23B981' : '#F06575';
        colorSwatchBtns.forEach(btn => {
          btn.classList.toggle('selected', btn.getAttribute('data-color') === selectedColor);
        });
      }
    });
  });

  // Icon Choice Selection
  iconChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedIcon = btn.getAttribute('data-icon');
      iconChoiceBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Color Swatch Selection
  colorSwatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.getAttribute('data-color');
      colorSwatchBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // --- Confirmation Modal ---
  function openConfirmModal(title, desc, actionLabel, onConfirm) {
    confirmTitle.textContent = title;
    confirmDesc.textContent = desc;
    confirmActionBtn.textContent = actionLabel;
    confirmCallback = onConfirm;
    confirmModalOverlay.classList.add('active');
  }

  function closeConfirmModal() {
    confirmModalOverlay.classList.remove('active');
    confirmCallback = null;
  }

  confirmActionBtn.addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    closeConfirmModal();
  });

  // --- Manage Defaults Modal ---
  function openDefaultsModal() {
    const defaults = categories.filter(c => c.source === 'default');
    defaultsListContainer.innerHTML = defaults.map(cat => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #F8F9FD; border: 1px solid #E8EBF3; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 32px; height: 32px; border-radius: 6px; background: ${cat.color}15; color: ${cat.color}; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
            <i class="${cat.icon}"></i>
          </div>
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; color: #18213D;">${cat.name}</div>
            <div style="font-size: 0.72rem; color: #75809A;">${cat.type === 'income' ? 'Income' : 'Expense'} Category</div>
          </div>
        </div>
        <span class="badge-pill source-default"><i class="ri-lock-line"></i> Protected Default</span>
      </div>
    `).join('');

    defaultsModalOverlay.classList.add('active');
  }

  function closeDefaultsModal() {
    defaultsModalOverlay.classList.remove('active');
  }

  restoreDefaultsBtn?.addEventListener('click', () => {
    // Restore any archived default categories
    let restored = 0;
    categories.forEach(c => {
      if (c.source === 'default' && c.archived) {
        c.archived = false;
        restored++;
      }
    });
    updateSummaries();
    renderCategories();
    closeDefaultsModal();
    showToast(restored > 0 ? `Restored ${restored} system default categories.` : 'All system defaults are already active.');
  });

  // --- Segment Switcher (All / Income / Expenses) ---
  function setSegment(seg) {
    currentSegment = seg;
    [segmentAllBtn, segmentIncomeBtn, segmentExpenseBtn].forEach(b => b.classList.remove('active', 'income-active', 'expense-active'));

    if (seg === 'all') segmentAllBtn.classList.add('active');
    if (seg === 'income') segmentIncomeBtn.classList.add('active', 'income-active');
    if (seg === 'expense') segmentExpenseBtn.classList.add('active', 'expense-active');

    renderCategories();
  }

  segmentAllBtn.addEventListener('click', () => setSegment('all'));
  segmentIncomeBtn.addEventListener('click', () => setSegment('income'));
  segmentExpenseBtn.addEventListener('click', () => setSegment('expense'));

  // --- Search & Filter Controls ---
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCategories();
  });

  filterTypeSelect.addEventListener('change', (e) => {
    filterType = e.target.value;
    renderCategories();
  });

  filterSourceSelect.addEventListener('change', (e) => {
    filterSource = e.target.value;
    renderCategories();
  });

  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderCategories();
  });

  function clearAllFilters() {
    searchQuery = '';
    searchInput.value = '';
    filterType = 'all';
    filterTypeSelect.value = 'all';
    filterSource = 'all';
    filterSourceSelect.value = 'all';
    sortBy = 'name-asc';
    sortSelect.value = 'name-asc';
    setSegment('all');
  }

  clearFiltersBtn.addEventListener('click', clearAllFilters);

  // View Switcher (Grid / List)
  toggleGridBtn.addEventListener('click', () => {
    viewMode = 'grid';
    toggleGridBtn.classList.add('active');
    toggleListBtn.classList.remove('active');
    renderCategories();
  });

  toggleListBtn.addEventListener('click', () => {
    viewMode = 'list';
    toggleListBtn.classList.add('active');
    toggleGridBtn.classList.remove('active');
    renderCategories();
  });

  // --- Demo State Switcher ---
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDemoState = btn.getAttribute('data-state');

      showArchived = false;

      if (activeDemoState === 'standard') {
        categories = [...INITIAL_CATEGORIES];
        clearAllFilters();
      } else if (activeDemoState === 'income-only') {
        setSegment('income');
      } else if (activeDemoState === 'expenses-only') {
        setSegment('expense');
      } else if (activeDemoState === 'custom-only') {
        filterSource = 'custom';
        filterSourceSelect.value = 'custom';
        setSegment('all');
      } else if (activeDemoState === 'archived-only') {
        showArchived = true;
        setSegment('all');
      } else if (activeDemoState === 'empty') {
        categories = [];
        updateSummaries();
        renderCategories();
        return;
      } else if (activeDemoState === 'api-error') {
        renderCategories();
        return;
      }

      updateSummaries();
      renderCategories();
    });
  });

  retryBtn?.addEventListener('click', () => {
    activeDemoState = 'standard';
    demoButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-state') === 'standard'));
    categories = [...INITIAL_CATEGORIES];
    updateSummaries();
    renderCategories();
    showToast('Categories reloaded successfully from /api/categories');
  });

  // --- Header & Global Actions ---
  document.getElementById('create-category-btn')?.addEventListener('click', () => openCategoryModal());
  document.getElementById('manage-defaults-btn')?.addEventListener('click', openDefaultsModal);
  document.getElementById('modal-close-btn')?.addEventListener('click', closeCategoryModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeCategoryModal);
  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDetailsDrawer);
  detailsDrawerBackdrop?.addEventListener('click', closeDetailsDrawer);
  document.getElementById('defaults-close-btn')?.addEventListener('click', closeDefaultsModal);
  document.getElementById('confirm-cancel-btn')?.addEventListener('click', closeConfirmModal);

  // Mobile Menu Toggle
  mobileToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    sidebarBackdrop.classList.toggle('active');
  });

  sidebarBackdrop?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    sidebarBackdrop.classList.remove('active');
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCategoryModal();
      closeDetailsDrawer();
      closeDefaultsModal();
      closeConfirmModal();
    }
  });

  // Initial load
  updateSummaries();
  renderCategories();

})();
