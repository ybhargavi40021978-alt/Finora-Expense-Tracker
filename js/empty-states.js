/**
 * Finora Expense Tracker — Screen 15: Empty States JavaScript
 * Interactive scenario switcher dynamically rendering empty state variants
 * for Transactions, Income, Expenses, Budgets, Goals, Categories, Recurring,
 * Search, and API Error states.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. SVG Illustrations Store (Polished, Modern, Minimal Fintech)
  // ========================================================================
  const illustrations = {
    transactions: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#F2EEFF"/>
        <rect x="52" y="38" width="80" height="104" rx="10" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <line x1="68" y1="58" x2="116" y2="58" stroke="#7957FF" stroke-width="3" stroke-linecap="round"/>
        <line x1="68" y1="72" x2="100" y2="72" stroke="#E8EBF3" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="68" y1="84" x2="112" y2="84" stroke="#E8EBF3" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="68" y1="96" x2="92" y2="96" stroke="#E8EBF3" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="68" y1="108" x2="116" y2="108" stroke="#E8EBF3" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Coin stack with green accent -->
        <rect x="115" y="95" width="34" height="10" rx="5" fill="#23B981"/>
        <rect x="115" y="108" width="34" height="10" rx="5" fill="#1EA06F"/>
        <rect x="115" y="121" width="34" height="10" rx="5" fill="#18835B"/>
        <!-- Floating Violet Plus Bubble -->
        <circle cx="138" cy="48" r="18" fill="#7957FF" filter="drop-shadow(0 4px 10px rgba(121, 87, 255, 0.4))"/>
        <path d="M138 42V54M132 48H144" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Small Electric Blue Sparkle -->
        <circle cx="48" cy="70" r="4" fill="#48B9F5"/>
        <circle cx="158" cy="85" r="3" fill="#C7B8FF"/>
      </svg>
    `,
    income: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#E8F9F2"/>
        <!-- Wallet Base -->
        <rect x="45" y="55" width="105" height="75" rx="14" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <path d="M45 75C45 67 52 62 60 62H140C148 62 150 67 150 75V78H45V75Z" fill="#F2EEFF"/>
        <rect x="120" y="82" width="30" height="22" rx="6" fill="#7957FF"/>
        <circle cx="132" cy="93" r="3" fill="#FFFFFF"/>
        <!-- Floating Mint Green Inflow Arrow -->
        <circle cx="100" cy="40" r="20" fill="#23B981" filter="drop-shadow(0 6px 12px rgba(35, 185, 129, 0.35))"/>
        <path d="M100 32V48M100 48L94 42M100 48L106 42" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Rupee Coin -->
        <circle cx="62" cy="115" r="16" fill="#F5B544"/>
        <text x="57" y="121" fill="#FFFFFF" font-size="14" font-weight="bold" font-family="sans-serif">₹</text>
      </svg>
    `,
    expenses: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#FDEEF0"/>
        <!-- Shopping Bag -->
        <rect x="55" y="65" width="90" height="80" rx="12" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <path d="M78 65V50C78 38 88 34 100 34C112 34 122 38 122 50V65" stroke="#7957FF" stroke-width="3" stroke-linecap="round"/>
        <!-- Coral Tag -->
        <rect x="80" y="90" width="40" height="24" rx="6" fill="#F06575"/>
        <circle cx="88" cy="102" r="2.5" fill="#FFFFFF"/>
        <line x1="95" y1="102" x2="112" y2="102" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <!-- Floating Sparkles -->
        <circle cx="155" cy="55" r="5" fill="#48B9F5"/>
        <circle cx="48" cy="110" r="4" fill="#C7B8FF"/>
      </svg>
    `,
    budgets: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#F2EEFF"/>
        <!-- Circular Progress Ring Skeleton -->
        <circle cx="100" cy="90" r="50" stroke="#E8EBF3" stroke-width="10"/>
        <circle cx="100" cy="90" r="50" stroke="#7957FF" stroke-width="10" stroke-dasharray="80 300" stroke-linecap="round"/>
        <!-- Central Target Card -->
        <circle cx="100" cy="90" r="32" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(17, 24, 63, 0.08))"/>
        <path d="M92 90H108M100 82V98" stroke="#23B981" stroke-width="3" stroke-linecap="round"/>
        <!-- Decorative envelope corners -->
        <circle cx="46" cy="65" r="14" fill="#48B9F5"/>
        <path d="M42 65L46 68L51 62" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    goals: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#FEF7EC"/>
        <!-- Savings Jar -->
        <rect x="65" y="55" width="70" height="90" rx="16" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <rect x="75" y="45" width="50" height="12" rx="4" fill="#7957FF"/>
        <!-- Coins inside Jar -->
        <circle cx="90" cy="120" r="12" fill="#F5B544"/>
        <circle cx="110" cy="125" r="12" fill="#23B981"/>
        <circle cx="100" cy="105" r="12" fill="#48B9F5"/>
        <!-- Flag Milestone on Top -->
        <line x1="145" y1="35" x2="145" y2="85" stroke="#11183F" stroke-width="2" stroke-linecap="round"/>
        <path d="M145 35L170 45L145 55V35Z" fill="#F06575"/>
      </svg>
    `,
    categories: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#F2EEFF"/>
        <!-- Grid of colorful category tiles -->
        <rect x="52" y="45" width="40" height="40" rx="8" fill="#7957FF" filter="drop-shadow(0 4px 8px rgba(121, 87, 255, 0.3))"/>
        <circle cx="72" cy="65" r="6" fill="#FFFFFF"/>
        <rect x="108" y="45" width="40" height="40" rx="8" fill="#23B981" filter="drop-shadow(0 4px 8px rgba(35, 185, 129, 0.3))"/>
        <path d="M124 60L128 69L134 62" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <rect x="52" y="98" width="40" height="40" rx="8" fill="#48B9F5" filter="drop-shadow(0 4px 8px rgba(72, 185, 245, 0.3))"/>
        <line x1="64" y1="118" x2="80" y2="118" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="108" y="98" width="40" height="40" rx="8" fill="#F06575" filter="drop-shadow(0 4px 8px rgba(240, 101, 117, 0.3))"/>
        <circle cx="128" cy="118" r="6" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
    `,
    recurring: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#F2EEFF"/>
        <!-- Calendar Base -->
        <rect x="55" y="45" width="90" height="85" rx="12" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <rect x="55" y="45" width="90" height="24" rx="12" fill="#7957FF"/>
        <!-- Repeat Arrow Circle -->
        <circle cx="100" cy="100" r="22" fill="#E8F9F2"/>
        <path d="M92 98C93 92 97 88 103 88C109 88 114 93 114 99M108 104C107 108 103 112 97 112C91 112 86 107 86 101" stroke="#23B981" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M112 94L116 99L111 102" fill="#23B981"/>
        <path d="M88 106L84 101L89 98" fill="#23B981"/>
      </svg>
    `,
    analytics: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#F2EEFF"/>
        <!-- Empty Chart Axis -->
        <rect x="50" y="40" width="100" height="100" rx="8" fill="#FFFFFF" stroke="#E8EBF3" stroke-width="2"/>
        <line x1="62" y1="124" x2="138" y2="124" stroke="#D3D8E8" stroke-width="2"/>
        <line x1="62" y1="52" x2="62" y2="124" stroke="#D3D8E8" stroke-width="2"/>
        <!-- Dotted Trend Prediction Line -->
        <path d="M66 112L85 95L108 102L134 68" stroke="#7957FF" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/>
        <circle cx="134" cy="68" r="5" fill="#48B9F5"/>
      </svg>
    `,
    error: `
      <svg class="empty-illustration-svg" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="90" r="75" fill="#FDEEF0"/>
        <circle cx="100" cy="90" r="48" fill="#FFFFFF" stroke="#F06575" stroke-width="2"/>
        <path d="M100 70V95M100 108H100.02" stroke="#F06575" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `
  };

  // ========================================================================
  // 2. Scenario Configurations
  // ========================================================================
  const scenarios = {
    transactions: {
      navId: 'nav-transactions',
      breadcrumb: 'Dashboard / Transactions',
      pageTitle: 'Transactions',
      pageSubtitle: 'Your financial activity, organized in one place.',
      illustration: illustrations.transactions,
      title: 'Your financial journey starts here.',
      subtitle: "You haven't added any transactions yet. Start recording your income and expenses to see where your money goes and build better financial habits.",
      primaryText: '+ Add Your First Transaction',
      primaryHref: 'transactions.html',
      secondaryText: 'Explore Dashboard',
      secondaryHref: 'dashboard.html',
      hint: 'Tip: Start with your latest income and a few everyday expenses to get a clearer picture of your finances.',
      benefits: null
    },
    income: {
      navId: 'nav-income',
      breadcrumb: 'Dashboard / Income',
      pageTitle: 'Income',
      pageSubtitle: 'Track your earnings, salary, and incoming cash flow.',
      illustration: illustrations.income,
      title: 'Your income story starts here.',
      subtitle: 'Record your salary, freelance earnings, or other income sources to understand how much money you receive.',
      primaryText: '+ Add Income',
      primaryHref: 'add-income.html',
      secondaryText: 'View Transactions',
      secondaryHref: 'transactions.html',
      hint: 'Tip: Log recurring salary and freelance retainers as soon as they reach your account.',
      benefits: null
    },
    expenses: {
      navId: 'nav-expenses',
      breadcrumb: 'Dashboard / Expenses',
      pageTitle: 'Expenses',
      pageSubtitle: 'Understand where your money goes and stay within limits.',
      illustration: illustrations.expenses,
      title: 'No expenses recorded yet.',
      subtitle: 'Add your everyday spending to understand your habits, monitor your budgets, and identify opportunities to save.',
      primaryText: '+ Add Expense',
      primaryHref: 'add-expense.html',
      secondaryText: 'Explore Budgets',
      secondaryHref: 'budgets.html',
      hint: 'Tip: Categorizing purchases right away helps keep your budget warning alerts accurate.',
      benefits: null
    },
    budgets: {
      navId: 'nav-budgets',
      breadcrumb: 'Dashboard / Budgets',
      pageTitle: 'Budgets',
      pageSubtitle: 'Set spending limits for categories and receive proactive alerts.',
      illustration: illustrations.budgets,
      title: 'Give your money a plan.',
      subtitle: "You haven't created any budgets yet. Set spending limits for categories that matter to you and track your progress throughout the month.",
      primaryText: 'Create Your First Budget',
      primaryHref: 'budgets.html',
      secondaryText: 'View Expenses',
      secondaryHref: 'add-expense.html',
      hint: null,
      benefits: [
        'Set category spending limits',
        'Monitor monthly burn rates',
        'Receive automated threshold alerts'
      ]
    },
    goals: {
      navId: 'nav-goals',
      breadcrumb: 'Dashboard / Goals',
      pageTitle: 'Goals & Savings',
      pageSubtitle: 'Set targets, build savings, and track your milestones.',
      illustration: illustrations.goals,
      title: 'Turn your plans into savings goals.',
      subtitle: 'Create a goal for something important to you, set a target amount, and track your progress as you save.',
      primaryText: 'Create Your First Goal',
      primaryHref: 'goals.html',
      secondaryText: 'View Dashboard',
      secondaryHref: 'dashboard.html',
      hint: 'Tip: Setting smaller milestone targets makes larger ambitions feel easily achievable.',
      benefits: null
    },
    categories: {
      navId: 'nav-categories',
      breadcrumb: 'Dashboard / Categories',
      pageTitle: 'Categories',
      pageSubtitle: 'Custom classifications for income and expenses.',
      illustration: illustrations.categories,
      title: 'Organize your finances your way.',
      subtitle: 'Create custom categories to group your income and expenses in a way that makes sense to you.',
      primaryText: 'Create Category',
      primaryHref: 'categories.html',
      secondaryText: 'View Transactions',
      secondaryHref: 'transactions.html',
      hint: 'Tip: Default system categories are always preserved to safeguard historical reports.',
      benefits: null
    },
    recurring: {
      navId: 'nav-recurring',
      breadcrumb: 'Dashboard / Recurring',
      pageTitle: 'Recurring Transactions',
      pageSubtitle: 'Automate repetitive subscriptions, bills, and repeating income.',
      illustration: illustrations.recurring,
      title: 'Make recurring finances easier.',
      subtitle: "You haven't set up recurring schedules yet. Add regular income or expenses to keep track of upcoming financial commitments.",
      primaryText: 'Create Recurring Schedule',
      primaryHref: 'recurring.html',
      secondaryText: 'View Transactions',
      secondaryHref: 'transactions.html',
      hint: 'Notice: Creating a schedule does not automatically debit or credit money until marked paid.',
      benefits: null
    },
    analytics: {
      navId: 'nav-analytics',
      breadcrumb: 'Dashboard / Analytics',
      pageTitle: 'Analytics & Reports',
      pageSubtitle: 'Interactive visualizations and financial insights.',
      illustration: illustrations.analytics,
      title: 'Your insights are waiting.',
      subtitle: 'Add income and expense transactions to unlock spending breakdowns, cash-flow trends, and personalized financial insights.',
      primaryText: '+ Add Your First Transaction',
      primaryHref: 'transactions.html',
      secondaryText: 'Explore Transactions',
      secondaryHref: 'transactions.html',
      hint: 'Tip: Finora analytics generate deeper insights once you record transactions across multiple categories.',
      benefits: null
    },
    error: {
      navId: 'nav-transactions',
      breadcrumb: 'Dashboard / Error',
      pageTitle: 'Service Unavailable',
      pageSubtitle: 'Could not connect to MongoDB database.',
      illustration: illustrations.error,
      title: "We couldn't load your data.",
      subtitle: 'Something went wrong while retrieving your information from the server. Please check your network and try again.',
      primaryText: 'Retry Connection',
      primaryHref: '#retry',
      secondaryText: 'Back to Dashboard',
      secondaryHref: 'dashboard.html',
      hint: null,
      benefits: null
    }
  };

  // ========================================================================
  // 3. Render Empty State Function
  // ========================================================================
  const cardElement = document.getElementById('main-empty-card');
  const breadcrumbElem = document.getElementById('breadcrumb-current');
  const pageTitleElem = document.getElementById('header-title');
  const pageSubtitleElem = document.getElementById('header-subtitle');
  const navLinks = document.querySelectorAll('.nav-item-link');

  function renderScenario(key) {
    const sc = scenarios[key] || scenarios.transactions;

    // Update Sidebar active state
    navLinks.forEach(link => {
      if (link.id === sc.navId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Update Header
    if (breadcrumbElem) breadcrumbElem.textContent = sc.breadcrumb.split('/ ')[1] || 'Transactions';
    if (pageTitleElem) pageTitleElem.textContent = sc.pageTitle;
    if (pageSubtitleElem) pageSubtitleElem.textContent = sc.pageSubtitle;

    // Build Card Markup
    let benefitsHtml = '';
    if (sc.benefits && sc.benefits.length > 0) {
      benefitsHtml = `
        <div class="empty-benefits-strip">
          ${sc.benefits.map(b => `<div class="benefit-item"><i class="ri-checkbox-circle-fill"></i> <span>${b}</span></div>`).join('')}
        </div>
      `;
    }

    let hintHtml = '';
    if (sc.hint) {
      hintHtml = `
        <div class="empty-hint-card">
          <i class="ri-lightbulb-line"></i>
          <span>${sc.hint}</span>
        </div>
      `;
    }

    cardElement.innerHTML = `
      <div class="empty-illustration-stage">
        ${sc.illustration}
      </div>
      <h2 class="empty-title">${sc.title}</h2>
      <p class="empty-subtitle">${sc.subtitle}</p>
      
      <div class="empty-actions-row">
        <a href="${sc.primaryHref}" class="btn-primary" id="btn-primary-action">
          ${sc.primaryText}
        </a>
        <a href="${sc.secondaryHref}" class="btn-secondary" id="btn-secondary-action">
          ${sc.secondaryText}
        </a>
      </div>

      ${hintHtml}
      ${benefitsHtml}
    `;

    // Bind special retry action if error state
    const btnRetry = document.getElementById('btn-primary-action');
    if (key === 'error' && btnRetry) {
      btnRetry.addEventListener('click', (e) => {
        e.preventDefault();
        btnRetry.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Reconnecting...';
        setTimeout(() => {
          renderScenario('transactions');
          showToast('Connected! Restored transaction view.', 'success');
        }, 800);
      });
    }
  }

  // ========================================================================
  // 4. Demo Switcher Buttons
  // ========================================================================
  const demoButtons = document.querySelectorAll('.demo-btn');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scenarioKey = btn.getAttribute('data-scenario');
      renderScenario(scenarioKey);
      showToast(`Switched preview to ${btn.textContent.trim()} empty state.`, 'info');
    });
  });

  // ========================================================================
  // 5. User Profile Menu & Mobile Sidebar
  // ========================================================================
  const userProfileMenu = document.getElementById('user-profile-menu');
  const profilePopover = document.getElementById('profile-popover');

  if (userProfileMenu && profilePopover) {
    userProfileMenu.addEventListener('click', (e) => {
      profilePopover.classList.toggle('open');
      e.stopPropagation();
    });

    document.addEventListener('click', () => {
      profilePopover.classList.remove('open');
    });

    profilePopover.addEventListener('click', (e) => e.stopPropagation());
  }

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      backdrop.classList.toggle('mobile-open');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('mobile-open');
    });
  }

  // ========================================================================
  // 6. Toast Utility
  // ========================================================================
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 1100; display: flex; flex-direction: column; gap: 8px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'background: #11183F; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; box-shadow: 0 8px 24px rgba(17,24,63,0.25); font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 10px; animation: toastIn 0.3s ease;';
    
    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-checkbox-circle-fill';
    toast.innerHTML = `<i class="${icon}" style="color: ${type === 'success' ? '#23B981' : '#7957FF'}; font-size: 1.125rem;"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initial load: Default to transactions
  renderScenario('transactions');
});
